import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const at=rel=>path.join(root,rel);
const read=rel=>fs.readFileSync(at(rel),'utf8');
const write=(rel,val)=>{fs.mkdirSync(path.dirname(at(rel)),{recursive:true});fs.writeFileSync(at(rel),val,'utf8');};
const catalog=JSON.parse(read('scenarios/catalog.json'));
const arg=process.argv[2];
if(arg==='--list'){for(const s of catalog)console.log(s.id.padEnd(38),s.expected_category.padEnd(34),s.expected_stage);process.exit(0);}
if(arg==='--status'){console.log(read('experiment.json'));process.exit(0);}
if(!arg || arg==='--help'){console.log('node tools/activate-scenario.mjs (--list|--status|--reset|<scenario-id>)');process.exit(arg?0:2);}
const id=arg==='--reset'?'baseline':arg;
const scenario=catalog.find(s=>s.id===id);
if(!scenario){console.error('Unknown scenario:',id);process.exit(2);}
if(!fs.existsSync(at('.lab-root')) || read('.lab-root').trim()!=='SPRING_BOOT_FAILURE_LAB_ONLY'){
 console.error('Not in dedicated Spring Boot lab');process.exit(2);
}
for(const f of ['pom.xml','src/main/java/dev/cicd/lab/FailureProbe.java','.mvn/maven.config'])write(f,read('scenarios/base/'+f));
for(const f of ['Dockerfile','.mvn/settings.xml'])fs.rmSync(at(f),{force:true});
let pom=read('pom.xml');
let probe=read('src/main/java/dev/cicd/lab/FailureProbe.java');
const setProbe=b=>{probe=`package dev.cicd.lab;\npublic final class FailureProbe {\n private FailureProbe() {}\n public static String check(){ ${b} }\n}\n`;};
const addPlugin=b=>{pom=pom.replace('  </plugins></build>',b+'\n  </plugins></build>');};
const updatePlugin=(name,fragment)=>{
 const marker=`<artifactId>${name}</artifactId><version>${name==='maven-surefire-plugin'?'3.2.5':'3.13.0'}</version>`;
 if(!pom.includes(marker))throw new Error('Baseline plugin marker not found');
 pom=pom.replace(marker,marker+fragment);
};
switch(id){
 case 'baseline':break;
 case 's01-java-cannot-find-symbol':setProbe('return missingVariable;');break;
 case 's02-java-incompatible-types':setProbe('String name=42;return name;');break;
 case 's03-java-missing-package':probe='package dev.cicd.lab;\nimport dev.cicd.missing.MissingClient;\npublic final class FailureProbe{public static String check(){return MissingClient.name();}}\n';break;
 case 's04-java-unreported-exception':setProbe('java.nio.file.Files.readString(java.nio.file.Path.of("README.md"));return "ok";');break;
 case 's05-java-variable-uninitialized':setProbe('String value;if(System.nanoTime()<0L)value="never";return value;');break;
 case 's06-maven-invalid-plugin-goal':addPlugin('<plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-resources-plugin</artifactId><version>3.3.1</version><executions><execution><id>invalid-goal</id><phase>validate</phase><goals><goal>generate-assets</goal></goals></execution></executions></plugin>');break;
 case 's07-maven-invalid-javac-flag':updatePlugin('maven-compiler-plugin','<configuration><compilerArgs><arg>--not-a-real-javac-option</arg></compilerArgs></configuration>');break;
 case 's08-maven-invalid-release':pom=pom.replace('<maven.compiler.release>17</maven.compiler.release>','<maven.compiler.release>bogus</maven.compiler.release>');break;
 case 's09-surefire-invalid-jvm-option':updatePlugin('maven-surefire-plugin','<configuration><argLine>-XX:ThisIsNotARealJVMOption=1</argLine><forkCount>1</forkCount><reuseForks>false</reuseForks></configuration>');break;
 case 's10-surefire-no-matching-tests':updatePlugin('maven-surefire-plugin','<configuration><includes><include>**/NoSuchTestInSpringLab.java</include></includes><failIfNoTests>true</failIfNoTests></configuration>');break;
 case 's11-surefire-missing-javaagent':updatePlugin('maven-surefire-plugin','<configuration><argLine>-javaagent:${project.basedir}/vendor/missing-test-agent.jar</argLine><forkCount>1</forkCount><reuseForks>false</reuseForks></configuration>');break;
 case 's12-maven-missing-dependency':pom=pom.replace('<artifactId>spring-boot-starter-web</artifactId>','<artifactId>spring-boot-starter-web</artifactId><version>99.99.99</version>');break;
 case 's13-maven-missing-local-jar':pom=pom.replace('  </dependencies>','<dependency><groupId>dev.cicd.lab</groupId><artifactId>local-missing-jar</artifactId><version>1.0.0</version><scope>system</scope><systemPath>${project.basedir}/vendor/never-built.jar</systemPath></dependency>\n  </dependencies>');break;
 case 's14-maven-registry-refused':
  write('.mvn/maven.config','--batch-mode\n--no-transfer-progress\n--settings=.mvn/settings.xml\n-Dmaven.repo.local=.cicd-lab-maven-cache\n');
  write('.mvn/settings.xml','<?xml version="1.0" encoding="UTF-8"?>\n<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"><mirrors><mirror><id>lab-unreachable</id><url>http://127.0.0.1:65534/maven2/</url><mirrorOf>*</mirrorOf></mirror></mirrors></settings>\n');break;
 case 's15-docker-missing-copy':write('Dockerfile','FROM eclipse-temurin:17-jre\nWORKDIR /app\nCOPY missing-spring-app.jar /app/app.jar\nENTRYPOINT ["java", "-jar", "/app/app.jar"]\n');break;
 case 's16-docker-invalid-instruction':write('Dockerfile','FROM eclipse-temurin:17-jre\nINVALID_SPRING_DOCKER_COMMAND true\nWORKDIR /app\n');break;
 case 's17-build-requires-java21':addPlugin('<plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-enforcer-plugin</artifactId><version>3.5.0</version><executions><execution><id>requires-java21-inside-runner</id><phase>validate</phase><goals><goal>enforce</goal></goals><configuration><rules><requireJavaVersion><version>[21,)</version><message>RUNTIME_MISMATCH: Build helper requires Java 21 but runner uses Java 17</message></requireJavaVersion></rules><fail>true</fail></configuration></execution></executions></plugin>');break;
 case 's18-java-syntax-error':setProbe('int count=3 return "count="+count;');break;
 default:throw Error('Missing handler for '+id);
}
write('pom.xml',pom);
write('src/main/java/dev/cicd/lab/FailureProbe.java',probe);
write('experiment.json',JSON.stringify({active_scenario:id,expected_category:scenario.expected_category,expected_stage:scenario.expected_stage,expected_error:scenario.expected_error,is_ground_truth_verified:false},null,2)+'\n');
console.log('Activated '+id+'\nExpected Category: '+scenario.expected_category+'\nExpected Error: '+scenario.expected_error);
