import {nonEmpty,positiveInteger} from './validation.js';
export function releaseOf(raw){return {name:nonEmpty(raw.name,'name'),version:nonEmpty(raw.version,'version'),build:positiveInteger(raw.build,'build')};}
export function releaseKey(release){return `${release.name}@${release.version}+${release.build}`;}
