/* Authored field observations and bounded comparison logic. No network or language-model inference. */
const FieldLogic = {
  hypotheses: {framing:'Only the framing changed.', content:'A detail inside the shared scene changed.', different:'These are different captures of the setting.'},
  features: {chair:{label:'Right chair',readings:{fabric:'Fabric hangs over the chair back.',bare:'The wooden chair back is exposed.',unclear:'The chair back cannot be read clearly.'}},bottle:{label:'Clear bottle',readings:{present:'The tall clear bottle is visible.',absent:'The tall clear bottle is absent.'}},candle:{label:'Candle',readings:{present:'The candle and wax are visible.',absent:'The candle and wax are absent.'}},column:{label:'Structural column',readings:{present:'The dark column is visible.',absent:'The dark column is absent.'}},other:{label:'Personal observation',readings:{note:'My observation'}}},
  regions:{chair:[.71,.27,1,1],bottle:[.15,.27,.34,.89],candle:[.30,.48,.51,.99],column:[.565,0,.66,.65]},
  points:{chair:[.85,.65],bottle:[.24,.62],candle:[.40,.78],column:[.61,.30]},
  blank(){return {stage:0,hypothesis:'',initialHypothesis:'',requested:false,refs:{},scope:'',note:'',hint:0,attempts:0,finding:null,legacyFinding:false};},
  source(id){const photo=STORY.photos.find(p=>p.id===id);if(photo)return {kind:'photo',data:photo,title:photo.t,ev:id};const file=STORY.files.find(f=>f.id===id);return file?{kind:'document',data:file,title:file.title||file.n,ev:file.ev}:null;},
  text(v,n){return typeof v==='string'?v.slice(0,n):'';},
  label(o){const src=this.source(o.source);if(o.kind==='document')return o.text;return this.features[o.feature]?.readings[o.reading]||o.note||'Personal observation';},
  restore(raw,b){
    const ids=new Set();b.observations=[];
    for(const v of Array.isArray(raw.observations)?raw.observations.slice(0,200):[]){if(!v||typeof v.id!=='string'||!/^o[1-9]\d{0,6}$/.test(v.id)||ids.has(v.id))continue;const src=this.source(v.source);if(!src||src.kind!==v.kind||!b.ev.includes(src.ev))continue;
      const o={id:v.id,source:v.source,kind:v.kind,note:this.text(v.note,2000)};
      if(v.kind==='photo'){if(!Number.isFinite(v.x)||!Number.isFinite(v.y)||v.x<0||v.x>1||v.y<0||v.y>1||!this.features[v.feature]?.readings[v.reading])continue;Object.assign(o,{x:v.x,y:v.y,feature:v.feature,reading:v.reading});}
      else {if(!Number.isInteger(v.line)||!src.data.lines[v.line]||v.text!==src.data.lines[v.line])continue;Object.assign(o,{line:v.line,text:v.text});}ids.add(o.id);b.observations.push(o);
    }
    b.obsSerial=Math.max(0,...b.observations.map(o=>Number(o.id.slice(1))),Number.isInteger(raw.obsSerial)?Math.min(raw.obsSerial,999999):0);
    b.theories=[];const theoryIds=new Set();
    for(const t of Array.isArray(raw.theories)?raw.theories.slice(0,40):[]){if(!t||typeof t.id!=='string'||!/^t[1-9]\d{0,6}$/.test(t.id)||theoryIds.has(t.id))continue;theoryIds.add(t.id);b.theories.push({id:t.id,title:this.text(t.title,160)||'Untitled theory',note:this.text(t.note,4000),status:['open','testing','reconsidered','resolved'].includes(t.status)?t.status:'open',links:(Array.isArray(t.links)?t.links:[]).filter((l,i,a)=>l&&typeof l.ref==='string'&&['support','challenge','context'].includes(l.role)&&(l.ref.startsWith('obs:')?ids.has(l.ref.slice(4)):l.ref.startsWith('ev:')&&b.ev.includes(l.ref.slice(3)))&&a.findIndex(x=>x?.ref===l.ref)===i).slice(0,120).map(l=>({ref:l.ref,role:l.role}))});}
    b.theorySerial=Math.max(0,...b.theories.map(t=>Number(t.id.slice(1))),Number.isInteger(raw.theorySerial)?Math.min(raw.theorySerial,999999):0);
    const f=raw.fieldwork&&typeof raw.fieldwork==='object'?raw.fieldwork:{};b.fieldwork=this.blank();
    for(const k of ['hypothesis','initialHypothesis'])if(this.hypotheses[f[k]])b.fieldwork[k]=f[k];
    b.fieldwork.stage=Number.isInteger(f.stage)?Math.max(0,Math.min(3,f.stage)):0;b.fieldwork.note=this.text(f.note,3000);b.fieldwork.scope=['version','identity','time'].includes(f.scope)?f.scope:'';b.fieldwork.hint=Math.max(0,Math.min(3,Number(f.hint)||0));b.fieldwork.attempts=Math.max(0,Math.min(999,Number(f.attempts)||0));
    for(const k of ['original','comparison','anchorA','anchorB','register'])if(ids.has(f.refs?.[k]))b.fieldwork.refs[k]=f.refs[k];
    b.fieldwork.requested=f.requested===true&&b.ev.includes('C20')&&['E4','H2'].every(id=>b.observations.some(o=>o.source===id));
    if(b.fieldwork.requested&&!b.flags.includes('versions:requested'))b.flags.push('versions:requested');
    if(b.solved.includes('D06')){const saved=f.finding?.refs;const candidate={hypothesis:'content',scope:'version',refs:Object.fromEntries(['original','comparison','anchorA','anchorB','register'].map((k,i)=>[k,saved?.[i]]))};const valid=Array.isArray(saved)&&saved.length===5&&new Set(saved).size===5&&saved.every(id=>ids.has(id))&&this.assess(b,candidate).ok;b.fieldwork.finding=valid?{refs:[...f.finding.refs],hypothesis:'content',scope:'version'}:null;b.fieldwork.legacyFinding=!valid;}
  },
  inside(o,feature){const r=this.regions[feature];return !!o&&o.kind==='photo'&&o.feature===feature&&r&&o.x>=r[0]&&o.y>=r[1]&&o.x<=r[2]&&o.y<=r[3];},
  assess(state,a){
    const fail=message=>({ok:false,message});if(!a||typeof a!=='object'||!state.fieldwork.requested)return fail('First retain an observation from each copy, choose a working account and request the source fields.');
    const get=k=>state.observations.find(o=>o.id===a.refs?.[k]);const left=get('original'),right=get('comparison'),aa=get('anchorA'),ab=get('anchorB'),reg=get('register');
    if(!left||!right||!aa||!ab||!reg)return fail('Cite an observation in each evidence slot. The links must lead to the actual detail you used.');
    if(new Set([left.id,right.id,aa.id,ab.id,reg.id]).size!==5)return fail('Use separate observations for the scene detail, the reference points and the source field.');
    if(left.source!=='E4'||right.source!=='H2'||!this.inside(left,'chair')||!this.inside(right,'chair'))return fail('Revisit the changed scene area in both copies. Your marked locations must show the feature being compared.');
    if(left.reading!=='fabric'||right.reading!=='bare')return fail('The descriptions you retained do not agree with both source images. Re-examine the copies or use their text observations.');
    if(aa.source!=='E4'||ab.source!=='H2'||!['bottle','candle','column'].includes(aa.feature)||aa.feature!==ab.feature||aa.reading!=='present'||ab.reading!=='present'||!this.inside(aa,aa.feature)||!this.inside(ab,ab.feature)||Math.abs(aa.x-ab.x)>.13||Math.abs(aa.y-ab.y)>.13)return fail('Your reference points do not establish a shared frame. Compare the same fixed feature at approximately the same position in both images.');
    if(reg.source!=='C41'||reg.kind!=='document'||reg.line!==3)return fail('The cited register entry does not describe the working copy being compared. Check the file references, not just the dimensions.');
    if(a.hypothesis==='framing')return fail('The cited working-copy boundaries retain this scene area. That account does not explain the difference you recorded. Keep or revise your theory.');
    if(a.hypothesis==='different')return fail('The shared reference points and parent reference work against this account. Consider what changed, and what stayed fixed.');
    if(a.hypothesis!=='content')return fail('Choose the working account you want the cited evidence to test.');
    if(a.scope!=='version')return fail('Keep the finding within what these sources establish. A comparison of copies does not identify a person or date an unrelated event.');
    return {ok:true,message:'The source comparison supports a change within the presented scene. The fixed frame and export reference test the border-only alternative. This is a version finding, not an identification or a finding about the death.'};
  }
};
