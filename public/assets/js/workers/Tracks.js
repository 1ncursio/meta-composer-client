"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTrackSheetEnabled = exports.setTrackColor = exports.getTrackColor = exports.isTrackDrawn = exports.getTrackVolume = exports.isAnyTrackPlayalong = exports.isTrackRequiredToPlay = exports.setupTracks = exports.getTrack = exports.getTracks = void 0;
var CONST_1 = require("./CONST");
var theTracks = {};
var getTracks = function () {
    return theTracks;
};
exports.getTracks = getTracks;
var getTrack = function (trackId) {
    return theTracks[trackId];
};
exports.getTrack = getTrack;
var setupTracks = function (activeTracks) {
    theTracks = {};
    var counter = 0; // only show the first two tracks as sheet by default
    for (var trackId in activeTracks) {
        if (!theTracks.hasOwnProperty(trackId)) {
            theTracks[trackId] = {
                draw: true,
                color: CONST_1.default.TRACK_COLORS[parseInt(trackId, 10) % 4],
                volume: 100,
                // @ts-ignore
                name: activeTracks[trackId].name || 'Track ' + trackId,
                requiredToPlay: false,
                index: trackId,
                sheetEnabled: ++counter < 3,
            };
        }
        theTracks[trackId].color = CONST_1.default.TRACK_COLORS[parseInt(trackId, 10) % 4];
    }
};
exports.setupTracks = setupTracks;
var isTrackRequiredToPlay = function (trackId) {
    return theTracks[trackId].requiredToPlay;
};
exports.isTrackRequiredToPlay = isTrackRequiredToPlay;
var isAnyTrackPlayalong = function () {
    return Object.keys(theTracks).filter(function (trackId) { return theTracks[parseInt(trackId, 10)].requiredToPlay; }).length > 0;
};
exports.isAnyTrackPlayalong = isAnyTrackPlayalong;
var getTrackVolume = function (trackId) {
    return theTracks[trackId].volume;
};
exports.getTrackVolume = getTrackVolume;
var isTrackDrawn = function (trackId) {
    return theTracks[trackId] && theTracks[trackId].draw;
};
exports.isTrackDrawn = isTrackDrawn;
var getTrackColor = function (trackId) {
    return theTracks[trackId] ? theTracks[trackId].color : 'rgba(0,0,0,0)';
};
exports.getTrackColor = getTrackColor;
var setTrackColor = function (trackId, colorId, color) {
    theTracks[trackId].color[colorId] = color;
};
exports.setTrackColor = setTrackColor;
var isTrackSheetEnabled = function (trackId) {
    return theTracks[trackId].sheetEnabled;
};
exports.isTrackSheetEnabled = isTrackSheetEnabled;
