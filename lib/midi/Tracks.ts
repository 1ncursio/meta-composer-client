import CONST, { WhiteAndBlack } from './CONST';
import { ActiveTrack } from './Song';

export interface Track {
  draw: boolean;
  color: WhiteAndBlack;
  volume: number;
  name: string;
  requiredToPlay: boolean;
  index: string;
  sheetEnabled: boolean;
  overwrittenInstrument?: string;
}

let theTracks: { [trackId: number]: Track } = {};

export const getTracks = () => {
  return theTracks;
};

export const getTrack = (trackId: number) => {
  return theTracks[trackId];
};

export const setupTracks = (activeTracks: { [trackId: number]: ActiveTrack }) => {
  theTracks = {};
  let counter = 0; // only show the first two tracks as sheet by default
  for (let trackId in activeTracks) {
    if (!theTracks.hasOwnProperty(trackId)) {
      theTracks[trackId] = {
        draw: true,
        color: CONST.TRACK_COLORS[parseInt(trackId, 10) % 4],
        volume: 100,
        // @ts-ignore
        name: activeTracks[trackId].name || 'Track ' + trackId,
        requiredToPlay: false,
        index: trackId,
        sheetEnabled: ++counter < 3,
      };
    }
    theTracks[trackId].color = CONST.TRACK_COLORS[parseInt(trackId, 10) % 4];
  }

  console.log({ theTracks });
};

export const isTrackRequiredToPlay = (trackId: number) => {
  return theTracks[trackId].requiredToPlay;
};

export const isAnyTrackPlayalong = () => {
  return Object.keys(theTracks).filter((trackId) => theTracks[parseInt(trackId, 10)].requiredToPlay).length > 0;
};

export const getTrackVolume = (trackId: number) => {
  return theTracks[trackId].volume;
};

export const isTrackDrawn = (trackId: number) => {
  return theTracks[trackId] && theTracks[trackId].draw;
};

export const getTrackColor = (trackId: number) => {
  return theTracks[trackId] ? theTracks[trackId].color : 'rgba(0,0,0,0)';
};

export const setTrackColor = (trackId: number, colorId: keyof WhiteAndBlack, color: string) => {
  theTracks[trackId].color[colorId] = color;
};

export const isTrackSheetEnabled = (trackId: number) => {
  return theTracks[trackId].sheetEnabled;
};
