import fs from 'node:fs';import {CONTENT} from '../../casework/src/content.js';
const voices={Ana:'bf_isabella',Iris:'af_heart',Mara:'af_bella',Elena:'bf_emma',Julia:'af_nicole',Adrian:'am_michael',Victor:'bm_george',Luca:'am_fenrir','Captain Pavel':'bm_daniel','Unknown voice':'af_nicole'};const jobs=[];
for(const[id,a]of Object.entries(CONTENT.audio))jobs.push({id,lines:a.lines.map(([who,text])=>({who,text,voice:voices[who]||'bm_daniel'})),cue:a.cue,morse:a.morse});
for(const[id,t]of Object.entries(CONTENT.interviews)){const voice=voices[t.name.split(' ')[0]];jobs.push({id:'talk.'+id+'.open',lines:[{who:t.name,text:t.opening,voice}]});t.questions.forEach(([q,text],i)=>jobs.push({id:'talk.'+id+'.q'+i,lines:[{who:t.name,text,voice}]}));for(const[key,text]of Object.entries(t.present))jobs.push({id:'talk.'+id+'.e.'+key,lines:[{who:t.name,text,voice}]});}
jobs.push({id:'ending.julia',lines:[{who:'Julia',text:CONTENT.ending.response,voice:voices.Julia}]});fs.writeFileSync(new URL('./audio-jobs.json',import.meta.url),JSON.stringify(jobs,null,2));

CONTENT.ending.questions.forEach(([q,text],i)=>jobs.push({id:'ending.julia.q'+i,lines:[{who:'Julia',text,voice:voices.Julia}]}));fs.writeFileSync(new URL('./audio-jobs.json',import.meta.url),JSON.stringify(jobs,null,2));
