import { asset } from './assets.js';
export const CCTV_SAMPLES = Array.from({length:9},(_,i)=>({index:i,time:`00:${i<4?'24':'25'}:${String(i<4?56+i:i-4).padStart(2,'0')}`,image:`assets/surveillance/hotel-${i}.jpg`}));
export function surveillanceControls(){return `<section class="surveillance-console" aria-label="Camera 02 playback console"><div class="recorder-identity"><span class="recorder-led" aria-hidden="true"></span><b>AURELIA / RECORDER 02</b><span>18 OCT 2025 · LOCAL RECORDER CLOCK</span></div><div class="cctv-transport"><button type="button" id="cctv-play">Play retained interval</button><button type="button" id="cctv-prev" aria-label="Previous retained sample">−1 s</button><button type="button" id="cctv-next" aria-label="Next retained sample">+1 s</button><button type="button" id="cctv-capture">Pause for inspection</button><output id="cctv-time">00:25:00</output></div><label class="cctv-scrubber">Recorder position<input id="cctv-position" type="range" min="0" max="8" step="1" value="4" aria-label="Surveillance recorder second"></label><p class="cctv-provenance">Retained export: one original sample per second. No microphone. No interpolation or missing-interval reconstruction. A face is not resolved at this distance.</p><details><summary>Source sample descriptions / accessible inspection</summary><ol class="cctv-descriptions">${CCTV_SAMPLES.map(({index,time})=>`<li><button type="button" data-cctv-sample="${index}">${time} — ${index===0||index===8?'No person visible.':index<4?'An indistinct person approaches across the right side of the view.':index===4?'An indistinct person crosses the central approach.':'The same unresolved silhouette moves toward the left edge; the interior remains outside the view.'}</button></li>`).join('')}</ol></details><p class="cctv-workflow">Pause or step through the samples, mark the relevant image detail and retain your observation below. Compare the recorder clock with an independent time source before using it in a chronology.</p><button type="button" data-puzzle="camera">Compare with independent records</button></section>`;}
export function mountSurveillance(dialog, onFrame, initialFrame=4){
 const surface=dialog.querySelector('.photo-surface'),image=dialog.querySelector('#original-image');
 const video=document.createElement('video');video.id='cctv-film';video.playsInline=true;video.muted=true;video.preload='metadata';video.src=asset('assets/films/hotel-camera.mp4');video.setAttribute('aria-label','Camera 02 sampled retained interval');surface.prepend(video);
 const slider=dialog.querySelector('#cctv-position'),select=dialog.querySelector('#frame'),play=dialog.querySelector('#cctv-play');let current=initialFrame,changing=false;
 const stamp=()=>{dialog.querySelector('#cctv-time').textContent=CCTV_SAMPLES[current].time;surface.querySelector('.camera-overlay').firstChild.textContent='AURELIA / CAM 02 · 18 OCT '+CCTV_SAMPLES[current].time;};
 const show=(index,seek=true)=>{const next=Math.max(0,Math.min(8,Number(index)||0));const changed=next!==current;current=next;slider.value=String(current);select.value=String(current);image.src=asset(CCTV_SAMPLES[current].image);stamp();if(changed)onFrame(current);if(seek&&video.readyState>=1){changing=true;video.currentTime=current+.02;changing=false;}};
 const pause=()=>{video.pause();video.classList.remove('playing');image.style.visibility='';play.textContent='Play retained interval';};
 const jump=(index)=>{pause();show(index);};
 video.onloadedmetadata=()=>show(current);
 video.ontimeupdate=()=>{if(!changing&&!video.paused)show(Math.min(8,Math.floor(video.currentTime)),false);};
 video.onended=()=>{show(8,false);pause();};
 video.onerror=()=>{pause();play.disabled=true;dialog.querySelector('.cctv-provenance').textContent='Video could not load. Every original source sample remains available through the timeline and descriptions. No evidence is lost.';};
 play.onclick=()=>{if(!video.paused){pause();return}if(current===8)show(0);video.play().then(()=>{video.classList.add('playing');image.style.visibility='hidden';play.textContent='Pause retained interval';}).catch(()=>{play.textContent='Tap to play retained interval';});};
 slider.oninput=()=>jump(slider.value);
 select.onchange=()=>jump(select.value);
 dialog.querySelector('#cctv-prev').onclick=()=>jump(current-1);
 dialog.querySelector('#cctv-next').onclick=()=>jump(current+1);
 dialog.querySelector('#cctv-capture').onclick=()=>{pause();dialog.querySelector('#point-feedback').textContent='Sample paused. Mark the visible detail or use the equivalent text location.';};
 dialog.querySelectorAll('[data-cctv-sample]').forEach(b=>b.onclick=()=>jump(b.dataset.cctvSample));
 // Marking is always on a stable source sample, never an ambiguous moving frame.
 surface.addEventListener('click',pause,true);
 const visibility=()=>{if(document.hidden)pause();};document.addEventListener('visibilitychange',visibility);
 dialog.addEventListener('close',()=>{pause();video.removeAttribute('src');video.load();document.removeEventListener('visibilitychange',visibility);},{once:true});
 show(initialFrame);
 return {pause};
}
