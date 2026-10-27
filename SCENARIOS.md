# Twenty NEW fault scenarios

- 01: Build script key absent from npm scripts | BUILD_CONFIGURATION_FAILURE | `npm run build`
- 02: Build command changes into nonexistent working directory | BUILD_CONFIGURATION_FAILURE | `npm run build`
- 03: Unsupported build output format | BUILD_CONFIGURATION_FAILURE | `npm run build`
- 04: Valid JSON but wrong build configuration shape | BUILD_CONFIGURATION_FAILURE | `npm run build`
- 05: Build output directory collides with existing file | BUILD_CONFIGURATION_FAILURE | `npm run build`
- 06: Build output parent is a regular file | BUILD_CONFIGURATION_FAILURE | `npm run build`
- 07: Duplicate lexical declaration in application source | COMPILATION_FAILURE | `npm run build`
- 08: Await used in a non-async function | COMPILATION_FAILURE | `npm run build`
- 09: Undeclared private class field | COMPILATION_FAILURE | `npm run build`
- 10: Duplicate named export | COMPILATION_FAILURE | `npm run build`
- 11: Invalid dependency package name | DEPENDENCY_FAILURE | `npm install --offline --ignore-scripts --no-audit --no-fund`
- 12: Malformed manifest inside a local vendor dependency | DEPENDENCY_FAILURE | `npm ci`
- 13: Undefined internal package import alias | DEPENDENCY_FAILURE | `npm run build`
- 14: Unsupported URL protocol in module import | BUILD_CONFIGURATION_FAILURE | `npm run build`
- 15: Configured test reporter module absent | TEST_CONFIGURATION_FAILURE | `npm test`
- 16: Configured test reporter exports invalid value | TEST_CONFIGURATION_FAILURE | `npm test`
- 17: Test fixture exists but contains invalid JSON | TEST_CONFIGURATION_FAILURE | `npm test`
- 18: Valid test produces an ordinary assertion failure | UNKNOWN | `npm test`
- 19: Docker EXPOSE has an invalid port | CONTAINER_CONFIGURATION_FAILURE | `docker build --progress=plain -t task-ledger:new19 .`
- 20: Docker COPY lacks destination argument | CONTAINER_CONFIGURATION_FAILURE | `docker build --progress=plain -t task-ledger:new20 .`

Reference suggestions are reviewer data; never include them in classifier inputs. Case 13 is dependency metadata/imports configuration; case 14 is an unsupported source import protocol (build configuration under the adopted toolchain-input policy). Record any taxonomy boundary decisions consistently.
