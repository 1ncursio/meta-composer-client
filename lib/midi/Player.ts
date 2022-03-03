class Player {
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
  song: any;
  constructor() {
    this.audioPlayer = new AudioPlayer();

    getMidiHandler().setNoteOnCallback(this.addInputNoteOn.bind(this));
    getMidiHandler().setNoteOffCallback(this.addInputNoteOff.bind(this));

    this.lastTime = this.audioPlayer.getContextTime();
    this.progress = 0;
    this.paused = true;
    this.playing = false;
    this.scrolling = 0;
    this.loadedSongs = new Set();
    this.muted = false;
    this.volume = 100;
    this.mutedAtVolume = 100;
    this.soundfontName = getSetting('soundfontName');
    this.useHqPiano = getSetting('useHQPianoSoundfont');
    this.inputInstrument = 'acoustic_grand_piano';
    this.lastMicNote = -1;

    this.newSongCallbacks = [];
    this.inputActiveNotes = {};
    this.inputPlayedNotes = [];

    this.playbackSpeed = 1;

    console.log('Player created.');
    this.playTick();

    setSettingCallback('hideRestsBelow', () => {
      if (this.song && getSetting('enableSheet')) {
        this.song.generateSheet();
      }
    });
  }
  playTick() {
    throw new Error('Method not implemented.');
  }
}

let player = null;

export const initPlayer = () => {
  player = new Player();
};
