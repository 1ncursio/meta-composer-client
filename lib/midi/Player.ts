import useStore from '@store/useStore';
import AudioNote from './AudioNote';
import { AudioPlayer } from './AudioPlayer';
import MidiLoader from './MidiLoader';
import Song, { MidiChannelSongNoteEvent } from './Song';
import { getTrackVolume, isAnyTrackPlayalong, isTrackRequiredToPlay, setupTracks } from './Tracks';

export interface LongNotes {
  [key: string]: MidiChannelSongNoteEvent[];
}

export interface InputActiveNotes {
  [key: string]: InputNote;
}

export interface InputNote {
  audioNote: AudioNote;
  noteNumber: number;
  offTime?: number;
  timestamp: number;
  wasUsed: boolean;
}

const LOOK_AHEAD_TIME = 0.2;
const LOOK_AHEAD_TIME_WHEN_PLAYALONG = 0.02;
export const START_DELAY = -4.5;

export default class Player {
  private static instance: Player;
  newSongCallbacks: (() => void)[];
  inputActiveNotes: InputActiveNotes;
  audioPlayer: AudioPlayer;
  lastTime: number;
  progress: number;
  paused: boolean;
  playing: boolean;
  scrolling: number;
  loadedSongs: Set<Song>;
  muted: boolean;
  volume: number;
  mutedAtVolume: number;
  soundfontName: string;
  useHqPiano: boolean;
  inputInstrument: string;
  lastMicNote: number;
  inputPlayedNotes: InputNote[];
  playbackSpeed: number;
  song: Song | null;
  wasPaused: boolean;
  scrollOffset: number;
  noteSequence: MidiChannelSongNoteEvent[];
  channels: any;
  loading: boolean;
  longNotes: LongNotes;
  pauseTime: number;
  playedBeats: any;

  private constructor() {
    this.audioPlayer = new AudioPlayer();

    // TODO: MidiHandler 에서 이벤트 받아서 처리하도록 변경
    // getMidiHandler().setNoteOnCallback(this.addInputNoteOn.bind(this));
    // getMidiHandler().setNoteOffCallback(this.addInputNoteOff.bind(this));

    this.lastTime = this.audioPlayer.getContextTime();
    this.progress = 0;
    this.paused = true;
    this.wasPaused = true;
    this.playing = false;
    this.scrolling = 0;
    this.loadedSongs = new Set();
    this.muted = false;
    this.volume = 100;
    this.mutedAtVolume = 100;
    this.scrollOffset = 0;
    this.song = null;
    this.noteSequence = [];
    this.loading = true;

    // TODO: setting 설정 추가하면 주석 삭제
    // this.soundfontName = getSetting('soundfontName');
    // this.useHqPiano = getSetting('useHQPianoSoundfont');
    this.soundfontName = 'MusyngKite';
    this.useHqPiano = false;

    this.inputInstrument = 'acoustic_grand_piano';
    this.lastMicNote = -1;

    this.newSongCallbacks = [];
    this.inputActiveNotes = {};
    this.inputPlayedNotes = [];
    // 4초 이상인 노트
    this.longNotes = {};
    this.pauseTime = 0;

    this.playbackSpeed = 1;

    console.log('Player created.');
    this.playTick();

    // TODO: setting 설정 추가하면 주석 삭제
    // setSettingCallback('hideRestsBelow', () => {
    //   if (this.song && getSetting('enableSheet')) {
    //     this.song.generateSheet();
    //   }
    // });

    // TODO: 악보 추가되면 주석 해제
    // this.song.generateSheet();
  }

  public static getInstance() {
    return this.instance || (this.instance = new this());
  }

  getState() {
    const time = this.getTime();
    const songReady = !!this.song?.ready;

    return {
      time,
      ctxTime: this.audioPlayer.getContextTime(),
      end: songReady ? this.song!.getEnd() : 0,
      loading: this.audioPlayer.loading,
      song: this.song,
      inputActiveNotes: this.inputActiveNotes,
      inputPlayedNotes: this.inputPlayedNotes,
      bpm: this.getBPM(time),
      longNotes: songReady ? this.song!.longNotes : {},
    };
  }

  addNewSongCallback(callback: () => void) {
    this.newSongCallbacks.push(callback);
  }

  // TODO: setting 설정 추가하면 주석 삭제
  // switchSoundfont(soundfontName: string) {
  //   this.wasPaused = this.paused;
  //   this.pause();
  //   // getLoader().startLoad();
  //   let nowTime = window.performance.now();
  //   this.soundfontName = soundfontName;
  //   this.audioPlayer.switchSoundfont(soundfontName, this.song).then((resolve) => {
  //     window.setTimeout(() => {
  //       if (!this.wasPaused) {
  //         this.resume();
  //       }
  //       // getLoader().stopLoad();
  //     }, Math.max(0, 500 - (window.performance.now() - nowTime)));
  //   });
  // }

  getTimeWithScrollOffset(scrollOffset: number) {
    return this.progress + START_DELAY - scrollOffset;
  }

  getTime() {
    return this.progress + START_DELAY - this.scrollOffset;
  }

  getTimeWithoutScrollOffset() {
    return this.progress + START_DELAY;
  }

  setTime(seconds: number) {
    this.audioPlayer.stopAllSources();
    this.progress += seconds - this.getTime();
    this.resetNoteSequence();
  }

  increaseSpeed(val: number) {
    this.playbackSpeed = Math.max(0, Math.round((this.playbackSpeed + val) * 100) / 100);
  }

  getChannel(track: number) {
    if (this.song!.activeTracks[track].notes.length) {
      return this.channels[this.song!.activeTracks[track].notes[0].channel];
    }
  }

  getCurrentTrackInstrument(trackIndex: number) {
    const noteSeq = this.song!.getNoteSequence();

    let i = 0;
    let nextNote = noteSeq[i];
    while (nextNote.track !== trackIndex && i < noteSeq.length - 1) {
      i++;
      nextNote = noteSeq[i];
    }
    if (nextNote.track == trackIndex) {
      return nextNote.instrument;
    }
  }

  async loadSong(theSong: string, fileName: string, name?: string, copyright?: string) {
    this.audioPlayer.stopAllSources();
    // getLoader().startLoad();
    // getLoader().setLoadMessage('Loading ' + name ? name : fileName + '.');
    if (this.audioPlayer.isRunning()) {
      this.audioPlayer.suspend();
    }

    this.loading = true;

    // getLoader().setLoadMessage('Parsing Midi File.');
    try {
      let midiFile = await MidiLoader.loadFile(theSong);

      if (!midiFile) {
        throw new Error('Midi file is not loaded.');
      }

      //clean up previous song
      if (Player.getInstance().song) {
        // TODO: 악보 추가되면 주석 해제
        // Player.getInstance().song!.sheetGen.clear();
        // TODO: setSong을 하면서 초기화될텐데 이거 왜 하는거지?
        // for (let key in getPlayer().song) {
        //   getPlayer().song[key] = null;
        // }
        // getPlayer().song = null;
        // delete getPlayer().song;
      }
      //create song obj. When songWorker is done processing, this.setSong will be called.
      new Song(midiFile, fileName, name || '', copyright || '', (song) => {
        console.log({ song });
        console.log({ player: this });
        this.setSong(song);
      });
    } catch (error) {
      console.error(error);
      // Notification.create("Couldn't read Midi-File - " + error, 2000);
      // getLoader().stopLoad();
    }
  }
  async loadInstrumentsForSong(song: Song) {
    // getLoader().setLoadMessage('Loading Instruments');

    await this.audioPlayer.loadInstrumentsForSong(song);

    // getLoader().setLoadMessage('Creating Buffers');
    return this.audioPlayer.loadBuffers().then((v) => {
      // getLoader().stopLoad();
    });
  }

  async loadInputInstrument() {
    if (!this.audioPlayer.isInstrumentLoaded(this.inputInstrument)) {
      console.log('Loading input instrument:' + this.inputInstrument);
      let wasPaused = this.paused;
      this.pause();

      await this.audioPlayer.loadInstrument(this.inputInstrument).then((resolve) => {
        if (!wasPaused) {
          this.resume();
        }
      });
    }
  }

  async checkAllInstrumentsLoaded() {
    return this.loadInstrumentsForSong(this.song!);
  }

  setSong(song: Song) {
    this.pause();
    this.playing = false;
    this.paused = true;
    this.wasPaused = true;
    this.progress = 0;
    this.scrollOffset = 0;
    this.song = song;
    if (this.loadedSongs.has(song)) {
      this.loadedSongs.add(song);
    }
    setupTracks(song.activeTracks);
    this.loadInstrumentsForSong(this.song);
    this.newSongCallbacks.forEach((callback) => callback());
  }

  // Play 버튼 클릭시
  startPlay() {
    console.log('Starting Song');
    this.wasPaused = false;

    this.resetNoteSequence();
    this.lastTime = this.audioPlayer.getContextTime();
    this.resume();
  }

  handleScroll(stacksize?: number) {
    if (this.scrolling != 0) {
      if (!this.song) {
        this.scrolling = 0;
        return;
      }
      this.lastTime = this.audioPlayer.getContextTime();
      let newScrollOffset = this.scrollOffset + 0.01 * this.scrolling;
      //get hypothetical time with new scrollOffset.
      let oldTime = this.getTimeWithScrollOffset(this.scrollOffset);
      let newTime = this.getTimeWithScrollOffset(newScrollOffset);

      //limit scroll past end
      if (this.song && newTime > 1 + this.song.getEnd() / 1000) {
        this.scrolling = 0;
        newScrollOffset = this.getTimeWithoutScrollOffset() - (1 + this.song.getEnd() / 1000);
        this.scrollOffset + (1 + this.song.getEnd() / 1000 - this.getTime()) || this.scrollOffset;
      }

      //limit scroll past beginning
      if (newTime < oldTime && newTime < START_DELAY) {
        this.scrolling = 0;
        newScrollOffset = this.getTimeWithoutScrollOffset() - START_DELAY;
      }

      this.scrollOffset = newScrollOffset;

      //dampen scroll amount somehow...
      this.scrolling =
        (Math.abs(this.scrolling) - Math.max(Math.abs(this.scrolling * 0.003), this.playbackSpeed * 0.001)) *
          (Math.abs(this.scrolling) / this.scrolling) || 0;

      //set to zero if only minimal scrollingspeed left
      if (Math.abs(this.scrolling) <= this.playbackSpeed * 0.005) {
        this.scrolling = 0;
        this.resetNoteSequence();
      }
      //limit recursion
      if (!stacksize) stacksize = 0;
      if (stacksize > 50) {
        window.setTimeout(() => {
          this.handleScroll();
        }, 25);
        return;
      }
      this.handleScroll(++stacksize);
      return;
    }
  }

  addLongNote(note: MidiChannelSongNoteEvent) {
    if (!this.longNotes) {
      this.longNotes = {};
    }
    if (!this.longNotes.hasOwnProperty(note.track)) {
      this.longNotes[note.track] = [];
    }
    this.longNotes[note.track].push(note);
  }

  checkLongNotes() {
    Object.keys(this.longNotes).forEach((trackIndex) => {
      for (let i = this.longNotes[trackIndex].length - 1; i >= 0; i--) {
        // TODO: 일단 잘못된 윗 코드에서 아래 코드로 수정했는데, 작동안하면 되돌려야 함
        // if (this.longNotes[trackIndex].offTime < this.getTime()) {
        if (this.longNotes[trackIndex][i].offTime < this.getTime()) {
          this.longNotes[trackIndex].splice(i, 1);
        }
      }
    });
  }

  getBPM(time: number) {
    let val = 0;
    if (this.song) {
      for (let i = this.song.temporalData.bpms.length - 1; i >= 0; i--) {
        if (time * 1000 > this.song.temporalData.bpms[i].timestamp) {
          val = this.song.temporalData.bpms[i].bpm;
          break;
        }
      }
    }
    return val;
  }

  playTick() {
    const currentContextTime = this.audioPlayer.getContextTime();
    this.audioPlayer.cleanEndedNotes();

    const delta = (currentContextTime - this.lastTime) * this.playbackSpeed;

    // TODO: 마이크 인풋 받기인데 필요없을 듯
    //Setting doesnt exist yet. Pitch detection is too bad for a whole piano.
    // this.addMicInputNotes();

    //cap max updaterate.
    if (delta < 0.0069) {
      this.requestNextTick();
      return;
    }

    // TODO: Settings 추가되면 주석 해제
    // if (this.checkSettingsChanged()) {
    //   this.requestNextTick();
    //   return;
    // }

    const oldProgress = this.progress;
    this.lastTime = currentContextTime;
    if (!this.paused && this.scrolling == 0) {
      this.progress += Math.min(0.1, delta);
    } else {
      this.requestNextTick();
      return;
    }

    const currentTime = this.getTime();

    if (this.song && this.isSongEnded(currentTime - 5)) {
      this.pause();
      this.requestNextTick();
      return;
    }
    // TODO: settings 추가되면 주석 해제
    // if (getSetting('enableMetronome')) {
    //   this.playMetronomeBeats(currentTime);
    // }
    while (this.isNextNoteReached(currentTime)) {
      let toRemove = 0;
      forLoop: for (let i = 0; i < this.noteSequence.length; i++) {
        if (currentTime > 0.05 + this.noteSequence[i].timestamp / 1000) {
          toRemove++;
        } else {
          break forLoop;
        }
      }
      if (toRemove > 0) {
        this.noteSequence.splice(0, toRemove);
      }

      if (
        this.noteSequence[0] &&
        (!isTrackRequiredToPlay(this.noteSequence[0].track) || this.isInputKeyPressed(this.noteSequence[0].noteNumber))
      ) {
        this.playNote(this.noteSequence.shift()!);
      } else {
        this.progress = oldProgress;
        break;
      }
    }

    this.requestNextTick();
  }

  // TODO: settings 설정하면 주석 제거
  // checkSettingsChanged() {
  //   let soundfontName = getSetting('soundfontName');
  //   let useHqPiano = getSetting('useHQPianoSoundfont');
  //   if (soundfontName != this.soundfontName || useHqPiano != this.useHqPiano) {
  //     this.useHqPiano = useHqPiano;
  //     this.switchSoundfont(soundfontName);
  //     return true;
  //   }

  //   let inputInstrumentName = getSetting('inputInstrument');
  //   if (inputInstrumentName != this.inputInstrument) {
  //     this.inputInstrument = inputInstrumentName;
  //     this.loadInputInstrument();
  //     return true;
  //   }
  // }

  // 메트로놈 재생
  playMetronomeBeats(currentTime: number) {
    this.playedBeats = this.playedBeats || {};
    // let beatsBySecond = getCurrentSong().temporalData.beatsBySecond;
    let beatsBySecond = Player.getInstance().song!.temporalData.beatsBySecond;
    let secondsToCheck = [Math.floor(currentTime), Math.floor(currentTime) + 1];
    secondsToCheck.forEach((second) => {
      if (beatsBySecond[second]) {
        beatsBySecond[second].forEach((beat) => {
          let beatTimestamp = beat[0];
          if (!this.playedBeats.hasOwnProperty(beatTimestamp) && beatTimestamp / 1000 < currentTime + 0.5) {
            const newMeasure: boolean =
              Player.getInstance().song!.measureLines[Math.floor(beatTimestamp / 1000)]?.includes(beatTimestamp);
            this.playedBeats[beatTimestamp] = true;
            this.audioPlayer.playBeat((beatTimestamp / 1000 - currentTime) / this.playbackSpeed, newMeasure);
          }
        });
      }
    });
  }

  // TODO: 마이크 인풋 받기인데 필요없을 듯
  // addMicInputNotes() {
  //   if (getSetting('micInputEnabled')) {
  //     let currentMicNote = getCurrentMicNote();

  //     if (this.lastMicNote != currentMicNote) {
  //       if (this.lastMicNote > -1) {
  //         this.addInputNoteOff(this.lastMicNote);
  //       }
  //       if (currentMicNote > -1) {
  //         this.addInputNoteOn(currentMicNote);
  //       }
  //     }
  //     this.lastMicNote = currentMicNote;
  //   }
  // }

  requestNextTick() {
    const { xrSession } = useStore.getState().xr;
    // if (xrSession) {
    // xrSession.requestAnimationFrame(() => this.playTick());
    // } else {
    window.requestAnimationFrame(() => this.playTick());
    // }
  }

  isInputKeyPressed(noteNumber: number) {
    if (this.inputActiveNotes.hasOwnProperty(noteNumber) && !this.inputActiveNotes[noteNumber].wasUsed) {
      this.inputActiveNotes[noteNumber].wasUsed = true;
      return true;
    }
    return false;
  }
  isSongEnded(currentTime: number) {
    return currentTime >= this.song!.getEnd() / 1000;
  }

  isNextNoteReached(currentTime: number) {
    let lookahead = isAnyTrackPlayalong() ? LOOK_AHEAD_TIME_WHEN_PLAYALONG : LOOK_AHEAD_TIME;
    return (
      this.noteSequence.length && this.noteSequence[0].timestamp / 1000 < currentTime + lookahead * this.playbackSpeed
    );
  }

  stop() {
    this.progress = 0;
    this.scrollOffset = 0;
    this.playing = false;
    this.pause();
  }

  resume() {
    if (!this.paused) {
      console.log('already playing');
      return;
    }

    if (!this.song) {
      console.log('No song loaded');
      return;
    }

    console.log('Resuming Song');
    this.paused = false;
    this.resetNoteSequence();
    this.audioPlayer.resume();
  }

  resetNoteSequence() {
    if (!this.song) {
      console.log('No song loaded');
      return;
    }

    this.noteSequence = this.song.getNoteSequence();
    this.noteSequence = this.noteSequence.filter((note) => note.timestamp > this.getTime());
    this.inputActiveNotes = {};
    this.playedBeats = {};
  }

  pause() {
    console.log('Pausing Song');
    this.pauseTime = this.getTime();
    this.paused = true;
  }

  playNote(note: MidiChannelSongNoteEvent) {
    if (!note.hasOwnProperty('channel') || !note.hasOwnProperty('noteNumber')) {
      throw new Error('Invalid note');
    }

    const currentTime = this.getTime();

    // TODO: MidHandler 추가하면 주석 해제
    // if (getMidiHandler().isOutputActive()) {
    if (false) {
      // getMidiHandler().playNote(
      //   note.noteNumber + 21,
      //   note.velocity,
      //   note.offVelocity,
      //   (note.timestamp - currentTime * 1000) / this.playbackSpeed,
      //   (note.offTime - currentTime * 1000) / this.playbackSpeed,
      // );
    } else {
      this.audioPlayer.playCompleteNote(
        currentTime,
        note,
        this.playbackSpeed,
        this.getNoteVolume(note),
        isAnyTrackPlayalong(),
      );
    }
  }

  getNoteVolume(note: MidiChannelSongNoteEvent) {
    return (this.volume / 100) * (getTrackVolume(note.track) / 100) * (note.channelVolume / 127);
  }

  addInputNoteOn(noteNumber: number) {
    if (this.inputActiveNotes.hasOwnProperty(noteNumber)) {
      console.log('NOTE ALREADY PLAING');
      this.audioPlayer.noteOffContinuous(this.inputActiveNotes[noteNumber].audioNote);
      delete this.inputActiveNotes[noteNumber];
    }
    let audioNote = this.audioPlayer.createContinuousNote(noteNumber, this.volume, this.inputInstrument);
    let activeNoteObj = {
      audioNote: audioNote,
      wasUsed: false,
      noteNumber: noteNumber,
      timestamp: this.audioPlayer.getContextTime() * 1000,
    };

    this.inputActiveNotes[noteNumber] = activeNoteObj;
  }

  addInputNoteOff(noteNumber: number) {
    if (!this.inputActiveNotes.hasOwnProperty(noteNumber)) {
      console.log('NOTE NOT PLAYING');
      return;
    }
    this.audioPlayer.noteOffContinuous(this.inputActiveNotes[noteNumber].audioNote);
    this.inputActiveNotes[noteNumber].offTime = this.audioPlayer.getContextTime() * 1000;
    this.inputPlayedNotes.push(this.inputActiveNotes[noteNumber]);

    delete this.inputActiveNotes[noteNumber];
  }

  skipForward() {
    this.setTime(this.getTime() + 3);
  }
  skipBack() {
    this.setTime(this.getTime() - 3);
  }
}

// var thePlayer = null;
// export const initThePlayer = () => {
//   thePlayer = new Player();
// };
// export const getPlayer = () => {
//   return thePlayer;
// };

// export const getCurrentSong = () => {
//   return thePlayer.song;
// };

// export const getPlayerState = () => {
//   return thePlayer.getState();
// };
