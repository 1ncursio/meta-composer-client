import { loadJson } from '@utils/util';
import { InputListeners } from './InputListeners';
import Player from './midi/Player';
import { Render } from './midi/RenderV2';
import { getPresetHandler } from './settings/ParticlePreset';
import { initSettings } from './settings/Settings';
import { getLoader } from './ui/Loader.js';
import { UI } from './ui/UI.js';
/**
 *Bugs:
 whats happending in measure 62 in kv331 1st.  
 *memory leak audioNotes
 *memory leak threeJs Particles
 
 * TODOs:
 *
 * - implement different modes:
 * 		- normal
 * 		- play along
 * 			- wait to hit right note (score in seconds / mistakes)
 * 			- own speed -> notes play as soon as key is hit (score in seconds / mistakes)
 * 			- rythm -> no waiting score accuracy
 * 		- scale training
 * 			- recognize scale
 * 			- play in scale
 *		- by ear
			- note
			- chords
			- melody
 * UI:
 * - Add Back/Forward History + add button to about page on app
 * - Accessability
 * - Mobile
 * - Load from URL / circumvent CORS.. Extension?
 * - channel menu
 * - Fix fullscreen on mobile
 *
 * Audio 
 * - implement control messages for
 * 		- sostenuto pedal
 * 			- only keys that are pressed while pedal is hit are sustained
 * 		- soft pedal
 * 			- how does that affect sound?
 * - implement pitch shift
 * - settings for playalong:
 * 		- accuracy needed
 * 		- different modes
 *
 * MISC
 * - add more starting songs from piano-midi
 * 
 * 
 *
 *
 *
 * 
 */
let ui;
let loading;
let listeners;

window.onload = function () {
  let paths = document.querySelector('#layer1').querySelectorAll('path');
  paths.forEach((path, i) => {
    window.setTimeout(() => {
      path.style.fill = 'var(--fontColor)';
      path.style.strokeDashoffset = 0;
    }, (i * i * i * 35) / (i * i));
  });

  if (window.location.search == '?app') {
    tapToStart();
  } else {
    // history.pushState({ page: 1 }, "Start", "")
  }

  // :TODO LandingPage 필요없어서 주석처리함. 문제 생기면 주석 풀어야됨
  //   initLandingPage(document.querySelector('#lpTop'), document.querySelector('#lpMainWrapper'), tapToStart);
};

async function init() {
  //   initThePlayer();
  render = new Render();
  ui = new UI(render);
  initSettings();
  listeners = new InputListeners(ui, render);
  renderLoop();

  getPresetHandler();

  // loadStartingSong()

  loadJson('./js/data/exampleSongs.json', (json) => {
    ui.setExampleSongs(JSON.parse(json));
    // loadStartingSong()
  });

  //   getSongsFromDb().then((ab) => {
  //     ab.onsuccess = (ev) => {
  //       let dbSongs = ev.target.result;
  //       dbSongs.forEach((songDbObj) => {
  //         console.log('Retrieved song from DB : ' + songDbObj.fileName);
  //         ui.addDbSong(songDbObj);
  //       });
  //     };
  //     ab.onerror = (ev) => {
  //       console.log('Error getting saved songs from IndexedDB: ' + ev.target.error);
  //     };
  //   });
}

async function tapToStart() {
  document.querySelector('#landingPage').style.opacity = '0';
  window.setTimeout(() => {
    document.querySelector('#landingPage').style.display = 'none';
  }, 500);
  document.body.style.backgroundColor = 'rgba(0,0,0,0)';

  getLoader().startLoad();
  await init();
  // history.pushState({ page: 2 }, "App", "/?app")

  loading = true;
}

let render;
function renderLoop() {
  try {
    render.render(Player.getInstance().getState());
  } catch (e) {
    console.error(e);
  }
  window.requestAnimationFrame(renderLoop);
}
// async function loadStartingSong() {
// 	const domain = window.location.href
// 	let url = "https://midiano.com/mz_331_3.mid?raw=true" // "https://bewelge.github.io/piano-midi.de-Files/midi/alb_esp1.mid?raw=true" //
// 	if (domain.split("github").length > 1) {
// 		url = "https://Bewelge.github.io/MIDIano/mz_331_3.mid?raw=true"
// 	}

// 	FileLoader.loadSongFromURL(url, (response, fileName) =>
// 		getPlayer().loadSong(response, fileName, "Mozart - Turkish March")
// 	) // Local: "../mz_331_3.mid")
// }
