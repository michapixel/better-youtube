// ==UserScript==
// @name        better-youtube
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      MS
// @description ...
// ==/UserScript==
const trace = console.log;
const doc = document;
const hasClass = (el, className) => [...el.classList].filter(cls => cls === className).length > 0;
const toggleClass = (el, className) => {
  if( hasClass(el, className) ) {
    el.classList.remove(className); 
    return false
  } else {
    el.classList.add(className); 
    return true;
  }
};
const getCookie = (name) => {
  var v = doc.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
};
// ----------------------->
let btn = doc.querySelector('.ytp-size-button');
let player = null;
let pc = null;
let pm = null;
let mhc = null;
let wide = getCookie('wide');
//
let pc_org = {
  height: null,
  maxHeight: null, 
};
let pm_org = { // #page-manager
  marginTop: null,
};
let mhc_org = { // #page-manager
  zIndex: null,
};
//
let fullsized = false;
// ------------------------------------------------------------------------------------------------------------------> 
const toggleFullsize = (fullsized) => {
  if(fullsized) {
    pc.style.height = 'calc(100vh - var(--ytd-watch-flexy-masthead-height + --ytd-masthead-height))';
    pc.style.maxHeight = '100vh';
    pm.style.marginTop = '0';
    mhc.style.zIndex = '-1';
  } else {
    pc.style.height = pc_org.height;
    pc.style.maxHeight = pc_org.maxHeight;
    pm.style.marginTop = pm_org.marginTop;
    mhc.style.zIndex = mhc_org.zIndex;
  }
};
//
const onKeyPressed = (ev) => {
  //trace(ev.keyCode, ev.code)
  switch(ev.code) {
    case 'Escape':
      toggleFullsize(false);
    break;
    //
    case 'KeyT':
      toggleFullsize(!hasClass(pc, 'fullsized'));
    break;
    //
  };
};
//
const onWheel = (ev) => {
  // stop scrolling
  ev.preventDefault();
  //*
  let min = 0;
  let max = 1;
  let vol_slid_width = 40;
  let delta = (0.025 * (ev.deltaY / 3)) * - 1;
  let video = doc.querySelector('video.html5-main-video');
  let volumeNow = video.volume;
  let volumeThen = Math.min(max, Math.max((volumeNow + delta), min));
  //trace(volumeNow, delta, volumeThen)
  video.volume = volumeThen;
  //*/
  let vol_panel = doc.querySelector('.ytp-volume-panel');
  vol_panel.setAttribute('aria-valuenow', parseInt(volumeThen*10, 10));
  vol_panel.setAttribute('aria-valuetext', parseInt(volumeThen*10, 10) + '% Laustärke');
  
  doc.querySelector('.ytp-volume-slider-handle').style.left = parseInt(volumeThen*vol_slid_width, 10) + 'px';
};
//
const init = () => {
  trace('running YT-Theatre-extension');
  player = doc.getElementById('player-container');
  pc = doc.getElementById('player-theater-container');
  pm = doc.getElementById('page-manager');
  mhc = doc.getElementById('masthead-container');
  //
  pc_org.height = pc.style.height;
  pc_org.maxHeight = pc.style.maxHeight;
  pm_org.marginTop = pc.style.marginTop;
  mhc_org.zIndex = mhc.style.zIndex;
  //
  //trace('restore', (wide === '1'))
  if(wide === '1') {
    fullsized = toggleClass(btn, 'fullsized');
    toggleFullsize(fullsized);
  }  
  doc.removeEventListener('DOMNodeInserted', el_listener);
  doc.addEventListener('keyup', onKeyPressed);
  player.addEventListener('wheel', onWheel);
};
//
const el_listener = (ev) => {
  let el = ev.target;
  if(el.id === 'player-theater-container') {
    //trace('theater container inserted ...')
    init();
  }
};
// 
if( doc.getElementById('player-theater-container') === null ) {
  // we need to listen to the insertion of the player-div, so:
  doc.addEventListener('DOMNodeInserted', el_listener);
} else {
  init();
}
//
btn.onclick = (ev) => {
  // trace(ev)
  let el = ev.target;
  fullsized = toggleClass(el, 'fullsized');
  toggleFullsize(fullsized);
};
//
