"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBuffer = exports.hasBuffer = exports.getBufferForNote = exports.getBuffers = void 0;
var CONST_1 = require("./CONST");
var buffers = {};
var getBuffers = function () {
    return buffers;
};
exports.getBuffers = getBuffers;
var getBufferForNote = function (soundfontName, instrument, noteNumber) {
    var noteKey = CONST_1.default.MIDI_NOTE_TO_KEY[noteNumber + 21];
    // TODO: 에러나면 수정
    // let buffer;
    // try {
    //   buffer = buffers[soundfontName][instrument][noteKey];
    // } catch (e) {
    //   console.error(e);
    // }
    // return buffer;
    return buffers[soundfontName][instrument][noteKey];
};
exports.getBufferForNote = getBufferForNote;
var hasBuffer = function (soundfontName, instrument) {
    return buffers.hasOwnProperty(soundfontName) && buffers[soundfontName].hasOwnProperty(instrument);
};
exports.hasBuffer = hasBuffer;
var setBuffer = function (soundfontName, instrument, noteKey, buffer) {
    if (!buffers.hasOwnProperty(soundfontName)) {
        buffers[soundfontName] = {};
    }
    if (!buffers[soundfontName].hasOwnProperty(instrument)) {
        buffers[soundfontName][instrument] = {};
    }
    buffers[soundfontName][instrument][noteKey] = buffer;
};
exports.setBuffer = setBuffer;
