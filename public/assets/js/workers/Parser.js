"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Song_1 = require("./Song");
var Parser = /** @class */ (function () {
    function Parser(data) {
        this.buffer = data;
        this.bufferLen = this.buffer.length;
        this.pos = 0;
    }
    Parser.prototype.eof = function () {
        return this.pos >= this.bufferLen;
    };
    Parser.prototype.readUInt8 = function () {
        var result = this.buffer[this.pos];
        this.pos += 1;
        return result;
    };
    Parser.prototype.readInt8 = function () {
        var u = this.readUInt8();
        return u & 0x80 ? u - 0x100 : u;
    };
    Parser.prototype.readUInt16 = function () {
        var b0 = this.readUInt8();
        var b1 = this.readUInt8();
        return (b0 << 8) + b1;
    };
    Parser.prototype.readInt16 = function () {
        var u = this.readUInt16();
        return u & 0x8000 ? u - 0x10000 : u;
    };
    Parser.prototype.readUInt24 = function () {
        var b0 = this.readUInt8();
        var b1 = this.readUInt8();
        var b2 = this.readUInt8();
        return (b0 << 16) + (b1 << 8) + b2;
    };
    Parser.prototype.readInt24 = function () {
        var u = this.readUInt24();
        return u & 0x800000 ? u - 0x1000000 : u;
    };
    Parser.prototype.readUInt32 = function () {
        var b0 = this.readUInt8();
        var b1 = this.readUInt8();
        var b2 = this.readUInt8();
        var b3 = this.readUInt8();
        return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
    };
    Parser.prototype.readBytes = function (length) {
        var bytes = this.buffer.slice(this.pos, this.pos + length);
        this.pos += length;
        return bytes;
    };
    Parser.prototype.readString = function (length) {
        var bytes = this.readBytes(length);
        // return String.fromCharCode.apply(null, bytes);
        return String.fromCharCode.apply(String, Array.from(bytes));
    };
    Parser.prototype.readVarInt = function () {
        var result = 0;
        while (!this.eof()) {
            var b = this.readUInt8();
            if (b & 0x80) {
                result += b & 0x7f;
                result <<= 7;
            }
            else {
                return result + b;
            }
        }
        return result;
    };
    Parser.prototype.readChunk = function () {
        var id = this.readString(4);
        var length = this.readUInt32();
        var data = this.readBytes(length);
        return {
            id: id,
            data: data,
            length: length,
        };
    };
    /*********
     * <ADAPTED FROM JASMID>
     * Replayer.js
     *********/
    Parser.setTemporal = function (midiData) {
        var trackStates = [];
        var beatsPerMinute = 120;
        var ticksPerBeat = midiData.header.ticksPerBeat;
        var totTime = 0;
        var bpms = [];
        var beatNumber = 1;
        var generatedBeats = 0;
        var beatsBySecond = { 0: [[0, 0]] };
        var sustainsByChannelAndSecond = {};
        var timeSignatures = [];
        var keySignatures = [];
        var channels = (0, Song_1.getDefaultChannels)();
        for (var t in midiData.tracks) {
            var track = midiData.tracks[t];
            trackStates.push({
                nextEventIndex: 0,
                ticksToNextEvent: track.length ? track[0].deltaTime : -1,
            });
        }
        var midiEvent = null;
        function getNextEvent() {
            var ticksToNextEvent = -1;
            var nextEventTrack = -1;
            var nextEventIndex = -1;
            //search all tracks for next event.
            for (var i_1 = 0; i_1 < trackStates.length; i_1++) {
                if (trackStates[i_1].ticksToNextEvent !== -1 &&
                    (ticksToNextEvent === -1 || trackStates[i_1].ticksToNextEvent < ticksToNextEvent)) {
                    ticksToNextEvent = trackStates[i_1].ticksToNextEvent;
                    nextEventTrack = i_1;
                    nextEventIndex = trackStates[i_1].nextEventIndex;
                }
            }
            if (nextEventTrack !== -1 && nextEventIndex !== -1) {
                // get next event from that track and
                var nextEvent = midiData.tracks[nextEventTrack][nextEventIndex];
                if (midiData.tracks[nextEventTrack][nextEventIndex + 1]) {
                    trackStates[nextEventTrack].ticksToNextEvent += midiData.tracks[nextEventTrack][nextEventIndex + 1].deltaTime;
                }
                else {
                    trackStates[nextEventTrack].ticksToNextEvent = -1;
                }
                trackStates[nextEventTrack].nextEventIndex += 1;
                // advance timings on all tracks
                for (var i = 0; i < trackStates.length; i++) {
                    if (trackStates[i].ticksToNextEvent != -1) {
                        trackStates[i].ticksToNextEvent -= ticksToNextEvent;
                    }
                }
                return {
                    ticksToEvent: ticksToNextEvent,
                    event: nextEvent,
                    track: nextEventTrack,
                };
            }
            else {
                return null;
            }
        } //end getNextEvent
        function processNext() {
            if (!midiEvent) {
                throw new Error('No midi event to process');
            }
            var oldBPM = 0;
            if (midiEvent.event.type === 'setTempo') {
                // tempo change events can occur anywhere in the middle and affect events that follow
                oldBPM = beatsPerMinute;
                beatsPerMinute = 60000000 / midiEvent.event.microsecondsPerBeat;
            }
            if (midiEvent.event.type === 'controller' && midiEvent.event.controllerType === 7) {
                channels[midiEvent.event.channel].volume = midiEvent.event.value;
            }
            if (midiEvent.event.type === 'timeSignature') {
                // @ts-ignore
                timeSignatures.push(midiEvent);
            }
            if (midiEvent.event.type === 'keySignature') {
                // @ts-ignore
                keySignatures.push(midiEvent);
            }
            var beatsToGenerate = 0;
            var secondsToGenerate = 0;
            if (midiEvent.ticksToEvent > 0) {
                beatsToGenerate = midiEvent.ticksToEvent / ticksPerBeat;
                secondsToGenerate = beatsToGenerate / (beatsPerMinute / 60);
            }
            var time = secondsToGenerate * 1000 || 0;
            midiEvent.event.temporalDelta = time;
            totTime += time;
            midiEvent.event.timestamp = totTime;
            //Keep track of sustain on/offs
            if (midiEvent.event.type == 'controller' && midiEvent.event.controllerType == 64) {
                var currentSecond = Math.floor(totTime / 1000);
                if (!sustainsByChannelAndSecond.hasOwnProperty(midiEvent.event.channel)) {
                    sustainsByChannelAndSecond[midiEvent.event.channel] = {};
                }
                if (!sustainsByChannelAndSecond[midiEvent.event.channel].hasOwnProperty(currentSecond)) {
                    sustainsByChannelAndSecond[midiEvent.event.channel][currentSecond] = [];
                }
                sustainsByChannelAndSecond[midiEvent.event.channel][currentSecond].push({
                    timestamp: totTime,
                    isOn: midiEvent.event.value > 64,
                    value: midiEvent.event.value,
                });
            }
            //keep track of completed beats to show beatLines
            generatedBeats += beatsToGenerate;
            while (generatedBeats >= 1) {
                generatedBeats -= 1;
                //TODO fixes 311-1st, but correct?
                // let bpm = oldBPM > 0 ? oldBPM : beatsPerMinute
                var bpm = beatsPerMinute;
                secondsToGenerate = generatedBeats / (bpm / 60);
                var beatTime = totTime - secondsToGenerate * 1000;
                var beatSecond = Math.floor(beatTime / 1000);
                //TODO Mz-311 1st parses incorrectly - last setTempo has deltaTime of 50000+
                if (beatSecond >= 0) {
                    if (!beatsBySecond.hasOwnProperty(beatSecond)) {
                        beatsBySecond[beatSecond] = [];
                    }
                    beatsBySecond[beatSecond].push([beatTime, beatNumber]);
                }
                beatNumber++;
            }
            if (midiEvent.event.hasOwnProperty('channel')) {
                // channel 이벤트일 경우 channelVolume 도 저장
                // @ts-ignore
                midiEvent.event.channelVolume = channels[midiEvent.event.channel].volume;
            }
            midiEvent = getNextEvent();
            if (oldBPM) {
                bpms.push({
                    bpm: beatsPerMinute,
                    timestamp: totTime,
                });
            }
        } //end processNext
        if ((midiEvent = getNextEvent())) {
            while (midiEvent)
                processNext();
        }
        /*********
         * </ADAPTED FROM JASMID>
         *********/
        return {
            bpms: bpms,
            beatsBySecond: beatsBySecond,
            sustainsByChannelAndSecond: sustainsByChannelAndSecond,
            timeSignatures: timeSignatures,
            keySignatures: keySignatures,
        };
    };
    return Parser;
}());
exports.default = Parser;
