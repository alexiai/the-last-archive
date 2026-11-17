import {state,save,soundInspected} from './engine.js';
let foreground=null,music=null,manifest=null;
export async function initAudio(){try{manifest=await(await fetch('assets/audio/manifest.json')).json()}catch{}return manifest;}
export function setSound(on){state.sound.enabled=on;save();if(on){music??=new Audio('assets/audio/music-investigation.mp3');music.loop=true;music.volume=state.sound.music;music.play().catch(()=>{});}else{foreground?.pause();music?.pause();}}
export function stopVoice(){foreground?.pause();foreground=null;}
export function setVolume(value){state.sound.volume=Math.max(0,Math.min(1,Number(value)||0));if(foreground)foreground.volume=state.sound.volume;save();}
export async function play(id,onTime){stopVoice();const item=manifest?.clips?.[id];const file=item?.file||'assets/audio/'+id+'.mp3';foreground=new Audio(file);foreground.volume=state.sound.volume;foreground.addEventListener('timeupdate',()=>onTime?.(foreground.currentTime,item));foreground.addEventListener('error',()=>window.dispatchEvent(new CustomEvent('audio-error',{detail:id})));soundInspected(id);try{await foreground.play();return true}catch{return false;}}
export function pause(){foreground?.pause();}
export function effect(name='notification'){if(!state.sound.enabled)return;const a=new Audio('assets/audio/'+name+'.mp3');a.volume=state.sound.volume*.25;a.play().catch(()=>{});}
export function getManifest(){return manifest;}
document.addEventListener('visibilitychange',()=>{if(document.hidden){foreground?.pause();music?.pause();}});
