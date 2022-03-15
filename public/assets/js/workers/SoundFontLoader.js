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
exports.SoundfontLoader = void 0;
// import { getLoader } from './ui/Loader.js';
// import { replaceAllString, iOS } from './Util.js';
var base64_arraybuffer_1 = require("base64-arraybuffer");
var Buffers_1 = require("./Buffers");
var SoundfontLoader = /** @class */ (function () {
    function SoundfontLoader() {
    }
    SoundfontLoader.loadInstrument = function (instrument, soundfontName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
                return [2 /*return*/, fetch('https://gleitz.github.io/midi-js-soundfonts/MusyngKite/acoustic_grand_piano-mp3.js')
                        .then(function (response) {
                        if (response.ok) {
                            // getLoader().setLoadMessage(
                            // 	"Loaded " + instrument + " from " + soundfontName + " soundfont."
                            // )
                            return response.text();
                        }
                        throw Error(response.statusText);
                    })
                        .then(function (data) {
                        var scr = window.document.createElement('script');
                        scr.lang = 'javascript';
                        scr.type = 'text/javascript';
                        // let newData = replaceAllString(data, 'Soundfont', soundfontName);
                        var newData = data.replaceAll('Soundfont', soundfontName);
                        scr.text = newData;
                        document.body.appendChild(scr);
                    })
                        .catch(function (error) {
                        console.error('Error fetching soundfont: \n', error);
                    })];
            });
        });
    };
    SoundfontLoader.getBuffers = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var sortedBuffers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sortedBuffers = null;
                        return [4 /*yield*/, SoundfontLoader.createBuffers(ctx).then(function (unsortedBuffers) {
                                unsortedBuffers.forEach(function (noteBuffer) {
                                    (0, Buffers_1.setBuffer)(noteBuffer.soundfontName, noteBuffer.instrument, noteBuffer.noteKey, noteBuffer.buffer);
                                });
                            }, function (error) { return console.error(error); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, sortedBuffers];
                }
            });
        });
    };
    SoundfontLoader.createBuffers = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, soundfontName, instrument, noteKey, base64Buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        // TODO: loadInstrument를 호출하면 window.MIDI가 생성되는데, 타입을 잡을 수 없어서 보류
                        // @ts-ignore
                        for (soundfontName in MIDI) {
                            // @ts-ignore
                            for (instrument in MIDI[soundfontName]) {
                                if (!(0, Buffers_1.hasBuffer)(soundfontName, instrument)) {
                                    console.log("Loaded '" + soundfontName + "' instrument : " + instrument);
                                    // @ts-ignore
                                    for (noteKey in MIDI[soundfontName][instrument]) {
                                        base64Buffer = SoundfontLoader.getBase64Buffer(MIDI[soundfontName][instrument][noteKey]);
                                        promises.push(SoundfontLoader.getNoteBuffer(ctx, base64Buffer, soundfontName, parseInt(noteKey, 10), instrument));
                                    }
                                }
                            }
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SoundfontLoader.getNoteBuffer = function (ctx, base64Buffer, soundfontName, noteKey, instrument) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        ctx.decodeAudioData(base64Buffer, function (decodedBuffer) {
                            resolve({
                                buffer: decodedBuffer,
                                noteKey: noteKey,
                                instrument: instrument,
                                soundfontName: soundfontName,
                            });
                        }, function (error) { return reject(error); });
                    })];
            });
        });
    };
    SoundfontLoader.getBase64Buffer = function (str) {
        return base64_arraybuffer_1.default.decode(str);
    };
    return SoundfontLoader;
}());
exports.SoundfontLoader = SoundfontLoader;
