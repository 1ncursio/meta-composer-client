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

let theTracks: { [trackId: string]: Track } = {};

export const getTracks = () => {
  return theTracks;
};

export const getTrack = (trackId: string) => {
  return theTracks[trackId];
};

export const setupTracks = (activeTracks: { [trackId: string]: ActiveTrack }) => {
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

export const isTrackRequiredToPlay = (trackId: string) => {
  return theTracks[trackId].requiredToPlay;
};

export const isAnyTrackPlayalong = () => {
  return Object.keys(theTracks).filter((trackId) => theTracks[parseInt(trackId, 10)].requiredToPlay).length > 0;
};

export const getTrackVolume = (trackId: string) => {
  return theTracks[trackId].volume;
};

export const isTrackDrawn = (trackId: string) => {
  return theTracks[trackId] && theTracks[trackId].draw;
};

export const getTrackColor = (trackId: string) => {
  // TODO: rgba는 필요없을 수도 있음.
  // return theTracks[trackId] ? theTracks[trackId].color : 'rgba(0,0,0,0)';
  return theTracks[trackId].color;
};

export const setTrackColor = (trackId: string, colorId: keyof WhiteAndBlack, color: string) => {
  theTracks[trackId].color[colorId] = color;
};

export const isTrackSheetEnabled = (trackId: string) => {
  return theTracks[trackId].sheetEnabled;
};
