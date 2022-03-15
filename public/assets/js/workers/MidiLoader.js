"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var Parser_1 = require("./Parser");
var MidiLoader = /** @class */ (function () {
    function MidiLoader() {
    }
    MidiLoader.loadFile = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(url, { responseType: 'arraybuffer' })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, parseMidi(new Uint8Array(response.data))];
                    case 2:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return MidiLoader;
}());
exports.default = MidiLoader;
function parseMidi(data) {
    var p = new Parser_1.default(data);
    var headerChunk = p.readChunk();
    if (headerChunk.id != 'MThd')
        throw "Bad MIDI file.  Expected 'MHdr', got: '" + headerChunk.id + "'";
    var header = parseHeader(headerChunk.data);
    var tracks = [];
    for (var i = 0; !p.eof() && i < header.numTracks; i++) {
        var trackChunk = p.readChunk();
        if (trackChunk.id != 'MTrk')
            throw new Error("Bad MIDI file.  Expected 'MTrk', got: '".concat(trackChunk.id, "'"));
        var track = parseTrack(trackChunk.data);
        tracks.push(track);
    }
    var midiData = { header: header, tracks: tracks };
    var temporalData = Parser_1.default.setTemporal(midiData);
    return {
        header: header,
        tracks: tracks,
        temporalData: temporalData,
        trackInstruments: {},
    };
}
function parseHeader(data) {
    var p = new Parser_1.default(data);
    var format = p.readUInt16();
    var numTracks = p.readUInt16();
    // 세팅되지 않은 값은 -1로 설정
    var framesPerSecond = -1;
    var ticksPerFrame = -1;
    var ticksPerBeat = -1;
    var timeDivision = p.readUInt16();
    if (timeDivision & 0x8000) {
        framesPerSecond = 0x100 - (timeDivision >> 8);
        ticksPerFrame = timeDivision & 0xff;
    }
    else {
        ticksPerBeat = timeDivision;
    }
    return {
        format: format,
        numTracks: numTracks,
        ticksPerBeat: ticksPerBeat,
        ticksPerFrame: ticksPerFrame,
        framesPerSecond: framesPerSecond,
    };
}
function parseTrack(data) {
    var parser = new Parser_1.default(data);
    var events = [];
    while (!parser.eof()) {
        var event = readEvent();
        events.push(event);
    }
    return events;
    var lastEventTypeByte = null;
    function readEvent() {
        var event = {};
        event.deltaTime = parser.readVarInt();
        var eventTypeByte = parser.readUInt8();
        if ((eventTypeByte & 0xf0) === 0xf0) {
            // system / meta event
            if (eventTypeByte === 0xff) {
                // meta event
                event.meta = true;
                var metatypeByte = parser.readUInt8();
                var length = parser.readVarInt();
                switch (metatypeByte) {
                    case 0x00:
                        event.type = 'sequenceNumber';
                        if (length !== 2)
                            throw 'Expected length for sequenceNumber event is 2, got ' + length;
                        event.number = parser.readUInt16();
                        return event;
                    case 0x01:
                        event.type = 'text';
                        event.text = parser.readString(length);
                        return event;
                    case 0x02:
                        event.type = 'copyrightNotice';
                        event.text = parser.readString(length);
                        return event;
                    case 0x03:
                        event.type = 'trackName';
                        event.text = parser.readString(length);
                        return event;
                    case 0x04:
                        event.type = 'instrumentName';
                        event.text = parser.readString(length);
                        return event;
                    case 0x05:
                        event.type = 'lyrics';
                        event.text = parser.readString(length);
                        return event;
                    case 0x06:
                        event.type = 'marker';
                        event.text = parser.readString(length);
                        return event;
                    case 0x07:
                        event.type = 'cuePoint';
                        event.text = parser.readString(length);
                        return event;
                    case 0x20:
                        event.type = 'channelPrefix';
                        if (length != 1)
                            throw 'Expected length for channelPrefix event is 1, got ' + length;
                        event.channel = parser.readUInt8();
                        return event;
                    case 0x21:
                        event.type = 'portPrefix';
                        if (length != 1)
                            throw 'Expected length for portPrefix event is 1, got ' + length;
                        event.port = parser.readUInt8();
                        return event;
                    case 0x2f:
                        event.type = 'endOfTrack';
                        if (length != 0)
                            throw 'Expected length for endOfTrack event is 0, got ' + length;
                        return event;
                    case 0x51:
                        event.type = 'setTempo';
                        if (length != 3)
                            throw 'Expected length for setTempo event is 3, got ' + length;
                        event.microsecondsPerBeat = parser.readUInt24();
                        return event;
                    case 0x54:
                        event.type = 'smpteOffset';
                        if (length != 5)
                            throw 'Expected length for smpteOffset event is 5, got ' + length;
                        var hourByte = parser.readUInt8();
                        // const FRAME_RATES = { 0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30 };
                        var FRAME_RATES = new Map();
                        FRAME_RATES.set(0x00, 24);
                        FRAME_RATES.set(0x20, 25);
                        FRAME_RATES.set(0x40, 29);
                        FRAME_RATES.set(0x60, 30);
                        event.frameRate = FRAME_RATES.get(hourByte & 0x60);
                        event.hour = hourByte & 0x1f;
                        event.min = parser.readUInt8();
                        event.sec = parser.readUInt8();
                        event.frame = parser.readUInt8();
                        event.subFrame = parser.readUInt8();
                        return event;
                    case 0x58:
                        event.type = 'timeSignature';
                        if (length != 4)
                            throw 'Expected length for timeSignature event is 4, got ' + length;
                        event.numerator = parser.readUInt8();
                        event.denominator = 1 << parser.readUInt8();
                        event.metronome = parser.readUInt8();
                        event.thirtyseconds = parser.readUInt8();
                        return event;
                    case 0x59:
                        event.type = 'keySignature';
                        if (length != 2)
                            throw 'Expected length for keySignature event is 2, got ' + length;
                        event.key = parser.readInt8();
                        event.scale = parser.readUInt8();
                        return event;
                    case 0x7f:
                        event.type = 'sequencerSpecific';
                        event.data = parser.readBytes(length);
                        return event;
                    default:
                        event.type = 'unknownMeta';
                        event.data = parser.readBytes(length);
                        event.metatypeByte = metatypeByte;
                        return event;
                }
            }
            else if (eventTypeByte == 0xf0) {
                event.type = 'sysEx';
                var length = parser.readVarInt();
                event.data = parser.readBytes(length);
                return event;
            }
            else if (eventTypeByte == 0xf7) {
                event.type = 'endSysEx';
                var length = parser.readVarInt();
                event.data = parser.readBytes(length);
                return event;
            }
            else {
                throw 'Unrecognised MIDI event type byte: ' + eventTypeByte;
            }
        }
        else {
            // channel event
            var param1;
            if ((eventTypeByte & 0x80) === 0) {
                // running status - reuse lastEventTypeByte as the event type.
                // eventTypeByte is actually the first parameter
                if (lastEventTypeByte === null)
                    throw 'Running status byte encountered before status byte';
                param1 = eventTypeByte;
                eventTypeByte = lastEventTypeByte;
                event.running = true;
            }
            else {
                param1 = parser.readUInt8();
                lastEventTypeByte = eventTypeByte;
            }
            var eventType = eventTypeByte >> 4;
            event.channel = eventTypeByte & 0x0f;
            switch (eventType) {
                case 0x08:
                    event.type = 'noteOff';
                    event.midiNoteNumber = param1;
                    event.noteNumber = param1 - 21;
                    event.velocity = parser.readUInt8();
                    return event;
                case 0x09:
                    var velocity = parser.readUInt8();
                    event.type = velocity === 0 ? 'noteOff' : 'noteOn';
                    event.midiNoteNumber = param1;
                    event.noteNumber = param1 - 21;
                    event.velocity = velocity;
                    if (velocity === 0)
                        event.byte9 = true;
                    return event;
                case 0x0a:
                    event.type = 'noteAftertouch';
                    event.midiNoteNumber = param1;
                    event.noteNumber = param1 - 21;
                    event.amount = parser.readUInt8();
                    return event;
                case 0x0b:
                    event.type = 'controller';
                    event.controllerType = param1;
                    event.value = parser.readUInt8();
                    return event;
                case 0x0c:
                    event.type = 'programChange';
                    event.programNumber = param1;
                    return event;
                case 0x0d:
                    event.type = 'channelAftertouch';
                    event.amount = param1;
                    return event;
                case 0x0e:
                    event.type = 'pitchBend';
                    event.value = param1 + (parser.readUInt8() << 7) - 0x2000;
                    return event;
                default:
                    throw 'Unrecognised MIDI event type: ' + eventType;
            }
        }
    }
}
