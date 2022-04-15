// import { getLoader } from './ui/Loader.js';
// import { replaceAllString, iOS } from './Util.js';
import { decode } from 'base64-arraybuffer';
import decodeArrayBuffer from './base64binary';
import { hasBuffer, setBuffer } from './Buffers';

export interface NoteBuffer {
  buffer: AudioBuffer;
  noteKey: number;
  instrument: string;
  soundfontName: string;
}

export interface IMIDI {
  [soundfontName: string]: {
    [instrument: string]: {
      [noteKey: string]: string;
    };
  };
}

export class SoundfontLoader {
  static async loadInstrument(instrument: string, soundfontName: string) {
    // let baseUrl = "https://bewelge.github.io/midi-js-soundfonts/"
    // let baseUrl = 'https://raw.githubusercontent.com/Bewelge/midi-js-soundfonts/gh-pages/';
    // if (window.location.href.split("127.0.0.").length > 1) {
    // 	baseUrl = "../soundfonts/"
    // }
    // if (instrument == 'percussion') {
    //   soundfontName = 'FluidR3_GM';
    //   baseUrl = '';
    // }
    // if (instrument == 'acoustic_grand_piano' && soundfontName == 'HQSoundfont') {
    //   soundfontName = 'HQSoundfont';
    //   baseUrl = '';
    // }
    // let fileType = 'ogg';
    // return fetch(baseUrl + soundfontName + '/' + instrument + '-' + fileType + '.js')
    return fetch('https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_grand_piano-mp3.js')
      .then((response) => {
        if (response.ok) {
          // getLoader().setLoadMessage(
          // 	"Loaded " + instrument + " from " + soundfontName + " soundfont."
          // )
          return response.text();
        }
        throw Error(response.statusText);
      })
      .then((data) => {
        let scr = window.document.createElement<'script'>('script');
        scr.lang = 'javascript';
        scr.type = 'text/javascript';
        // let newData = replaceAllString(data, 'Soundfont', soundfontName);
        let newData = data.replaceAll('Soundfont', soundfontName);
        scr.text = newData;
        document.body.appendChild(scr);
      })
      .catch(function (error) {
        console.error('Error fetching soundfont: \n', error);
      });
  }

  static async getBuffers(ctx: AudioContext) {
    let sortedBuffers = null;
    await SoundfontLoader.createBuffers(ctx).then(
      (unsortedBuffers) => {
        unsortedBuffers.forEach((noteBuffer) => {
          setBuffer(noteBuffer.soundfontName, noteBuffer.instrument, noteBuffer.noteKey, noteBuffer.buffer);
        });
      },
      (error) => console.error(error),
    );
    return sortedBuffers;
  }

  static async createBuffers(ctx: AudioContext) {
    const promises = [];
    // TODO: loadInstrument를 호출하면 window.MIDI가 생성되는데, 타입을 잡을 수 없어서 보류
    // @ts-ignore
    for (let soundfontName in MIDI) {
      // @ts-ignore
      for (let instrument in MIDI[soundfontName]) {
        if (!hasBuffer(soundfontName, instrument)) {
          console.log("Loaded '" + soundfontName + "' instrument : " + instrument);
          // @ts-ignore
          for (let noteKey in MIDI[soundfontName][instrument]) {
            // @ts-ignore
            let base64Buffer = SoundfontLoader.getBase64Buffer(MIDI[soundfontName][instrument][noteKey]);
            promises.push(
              SoundfontLoader.getNoteBuffer(ctx, base64Buffer, soundfontName, parseInt(noteKey, 10), instrument),
            );
          }
        }
      }
    }
    return await Promise.all(promises);
  }
  static async getNoteBuffer(
    ctx: AudioContext,
    base64Buffer: ArrayBuffer,
    soundfontName: string,
    noteKey: number,
    instrument: string,
  ): Promise<NoteBuffer> {
    return new Promise((resolve, reject) => {
      ctx.decodeAudioData(
        base64Buffer,
        (decodedBuffer) => {
          resolve({
            buffer: decodedBuffer,
            noteKey: noteKey,
            instrument: instrument,
            soundfontName: soundfontName,
          });
        },
        (error) => reject(error),
      );
    });

    //ios can't handle the promise based decodeAudioData
    // return await ctx
    // 	.decodeAudioData(base64Buffer, function (decodedBuffer) {
    // 		audioBuffer = decodedBuffer
    // 	})
    // 	.then(
    // 		() => {
    // 			return {
    // 				buffer: audioBuffer,
    // 				noteKey: noteKey,
    // 				instrument: instrument,
    // 				soundfontName: soundfontName
    // 			}
    // 		},
    // 		e => {
    // 			console.log(e)
    // 		}
    // 	)
  }
  static getBase64Buffer(str: string) {
    let base64 = str.split(',')[1];
    return decodeArrayBuffer(base64);
  }
}
