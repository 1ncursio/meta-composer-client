import { AudioPlayer } from './AudioPlayer';
import Song from './Song';

export default class Player {
  private static instance: Player;
  newSongCallbacks: never[];
  inputActiveNotes: {};
  audioPlayer: any;
  addInputNoteOn: any;
  addInputNoteOff: any;
  lastTime: any;
  progress: number;
  paused: boolean;
  playing: boolean;
  scrolling: number;
  loadedSongs: Set<unknown>;
  muted: boolean;
  volume: number;
  mutedAtVolume: number;
  soundfontName: any;
  useHqPiano: any;
  inputInstrument: string;
  lastMicNote: number;
  inputPlayedNotes: never[];
  playbackSpeed: number;
  song: Song;
  private constructor() {
    this.audioPlayer = new AudioPlayer();

    // TODO: MidiHandler 에서 이벤트 받아서 처리하도록 변경
    // getMidiHandler().setNoteOnCallback(this.addInputNoteOn.bind(this));
    // getMidiHandler().setNoteOffCallback(this.addInputNoteOff.bind(this));

    this.lastTime = this.audioPlayer.getContextTime();
    this.progress = 0;
    this.paused = true;
    this.playing = false;
    this.scrolling = 0;
    this.loadedSongs = new Set();
    this.muted = false;
    this.volume = 100;
    this.mutedAtVolume = 100;

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

    this.playbackSpeed = 1;

    console.log('Player created.');
    this.playTick();

    // TODO: setting 설정 추가하면 주석 삭제
    // setSettingCallback('hideRestsBelow', () => {
    //   if (this.song && getSetting('enableSheet')) {
    //     this.song.generateSheet();
    //   }
    // });

    this.song.generateSheet();
  }

  public static getInstance() {
    return this.instance || (this.instance = new this());
  }

  playTick() {
    throw new Error('Method not implemented.');
  }
}
