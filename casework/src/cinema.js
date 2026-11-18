import { modal, escape as e } from './dom.js';
// The opening is an editorial sequence of the preserved room, never additional
// evidence. Its captions introduce only the assignment and the first objective.
export const OPENING_CAPTIONS = [
  [0, 7.8, 'VESPERA · 19 OCTOBER 2025', 'The room has been secured. The questions have not.'],
  [8, 14.8, 'MAJOR CRIME · CASE 0416', 'Iris Vasilescu was found here yesterday morning.'],
  [15, 21.8, 'A LIFE LEAVES MORE THAN ONE ACCOUNT', 'A room. A phone. The people who knew her.'],
  [22, 28.8, 'YOU ARE DETECTIVE ALEX DIMA', 'Begin with what was preserved. Question what it means.'],
  [29, 38, 'THE LAST ARCHIVE', 'Your first task: inspect the apartment and recover the authorised phone copy.'],
];
export function openingMarkup() {
 return `<section class="opening-cinema" aria-label="Cinematic case introduction"><video id="opening-film" playsinline preload="metadata" poster="assets/films/opening-poster.jpg" src="assets/films/opening.mp4" aria-label="Cinematic views of the preserved apartment"></video><div class="cinema-shade" aria-hidden="true"></div><div class="cinema-letterbox" aria-hidden="true"></div><div class="cinema-titles" aria-live="off"><p id="film-kicker">${OPENING_CAPTIONS[0][2]}</p><h1 id="film-caption">${OPENING_CAPTIONS[0][3]}</h1></div><div class="cinema-controls"><button type="button" id="film-play">Play introduction</button><button type="button" id="film-mute" aria-pressed="false">Sound on</button><button type="button" id="film-read">Read the briefing</button><button type="button" id="film-transcript">Film transcript</button><output id="film-time">00:00 / 00:38</output></div><p class="cinema-description">Original score · No essential clue is exclusive to this film.</p></section>`;
}
export function mountOpening(root, volume=.65) {
 const box=root.querySelector('.opening-cinema'),video=box?.querySelector('video');if(!video)return()=>{};
 video.volume=volume;let last=-1;
 const play=box.querySelector('#film-play'),mute=box.querySelector('#film-mute');
 const finish=()=>{video.pause();box.remove();root.querySelector('.briefing')?.classList.remove('has-cinema');const next=root.querySelector('#continue');if(next)next.textContent='Continue';const title=root.querySelector('.briefing h1');title?.setAttribute('tabindex','-1');title?.focus({preventScroll:true});};
 video.addEventListener('timeupdate',()=>{const t=video.currentTime;box.querySelector('#film-time').textContent=`00:${String(Math.floor(t)).padStart(2,'0')} / 00:38`;const index=OPENING_CAPTIONS.findIndex(([a,b])=>t>=a&&t<b);if(index>=0&&index!==last){last=index;box.querySelector('#film-kicker').textContent=OPENING_CAPTIONS[index][2];box.querySelector('#film-caption').textContent=OPENING_CAPTIONS[index][3];}});
 video.addEventListener('ended',finish);
 video.addEventListener('play',()=>play.textContent='Pause introduction');
 video.addEventListener('pause',()=>play.textContent=video.ended?'Replay introduction':'Play introduction');
 video.addEventListener('error',()=>{play.disabled=true;box.querySelector('.cinema-description').textContent='The film could not load. Read the briefing to continue; no evidence is lost.';});
 play.onclick=()=>video.paused?video.play().catch(()=>{play.textContent='Tap to play introduction';}):video.pause();
 mute.onclick=()=>{video.muted=!video.muted;mute.textContent=video.muted?'Sound off':'Sound on';mute.setAttribute('aria-pressed',String(video.muted));};
 box.querySelector('#film-read').onclick=finish;
 box.querySelector('#film-transcript').onclick=()=>{video.pause();modal('Introduction / equivalent transcript', `<article class="source-paper"><h2>The Last Archive / opening</h2><p>Slow views of the same secured apartment: room, door, low table, phone and reverse room view. An original low score, rain texture and a restrained latch sound accompany the film. No person or event is depicted and no essential evidence appears only here.</p>${OPENING_CAPTIONS.map(([a,b,k,text])=>`<p><small>${a}–${b} seconds / ${e(k)}</small><br>${e(text)}</p>`).join('')}</article>`);};
 const visibility=()=>{if(document.hidden)video.pause();};document.addEventListener('visibilitychange',visibility);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)video.play().catch(()=>{play.textContent='Tap to play introduction';});
 return()=>{video.pause();document.removeEventListener('visibilitychange',visibility);};
}
