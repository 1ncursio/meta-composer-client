import { enableMapSet } from 'immer';
import MIDImessage from 'midimessage';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ActionMeta, SingleValue } from 'react-select';
import type { Player } from 'soundfont-player';
import SoundFont from 'soundfont-player';
import useStore from '@store/useStore';

enableMapSet();

const useMIDI = (): {
  midiInput: Map<string, WebMidi.MIDIInput>;
  midiOutput: Map<string, WebMidi.MIDIOutput>;
  loading: boolean;
  isMidiConnected: boolean;
  error: Error | null;
  onChangeInstrument: (
    newValue: SingleValue<{
      value: string;
      label: string;
    }>,
    actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>,
  ) => void;
  onOK: (e: EventListenerOrEventListenerObject) => Promise<void>;
  onClickHTMLButton: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
  // player: Player | null;
} => {
  // const [selectedInstrument, setSelectedInstrument] = useState<InstrumentName>('acoustic_grand_piano');
  const { midi, initMidi, addPressedKey, removePressedKey } = useStore((state) => state.piano);
  const { peers } = useStore((state) => state.webRTC);

  const [midiInput, setMidiInput] = useState<Map<string, WebMidi.MIDIInput>>(new Map<string, WebMidi.MIDIInput>());
  const [midiOutput, setMidiOutput] = useState<Map<string, WebMidi.MIDIOutput>>(new Map<string, WebMidi.MIDIOutput>());
  const [isMidiConnected, setIsMidiConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (peers) {
      // Object.entries(peers).forEach(([userId, peer]) => {
      //   peer.on('data', (data) => {
      //     const message = new MIDImessage(data);
      //     if (message.type === 'noteon') {
      //       addPressedKey(message.note);
      //     } else if (message.type === 'noteoff') {
      //       removePressedKey(message.note);
      //     }
      //   });
      // });
      console.log('peers in useMidi', peers);
    }
  }, []);

  // const startLoggingMIDIInput = (midiAccess: WebMidi.MIDIAccess) => {
  //   midiAccess.inputs.forEach((entry) => {
  //     // entry.onmidimessage = onMIDIMessage(peers);
  //     entry.onmidimessage = (e: WebMidi.MIDIMessageEvent) => {
  //       if (!playerRef.current) {
  //         return;
  //       }
  //       console.log({ peers });
  //       const midimessage = MIDImessage(e);
  //       // console.log({ midimessage });

  //       // const cmd = event.data[0] >> 4;
  //       // const channel = event.data[0] & 0xf;
  //       // const noteNumber = event.data[1];
  //       // const velocity = event.data[2];
  //       // const type = event.type;

  //       // console.log({
  //       //   cmd,
  //       //   channel,
  //       //   noteNumber,
  //       //   velocity,
  //       //   type,
  //       // });

  //       switch (midimessage.messageType) {
  //         case 'noteon':
  //           playerRef.current.play(midimessage.key);
  //           addPressedKey(midimessage.key);
  //           // peers['1'].send(midimessage.key);
  //           break;
  //         case 'noteoff':
  //           playerRef.current.stop(midimessage.key);
  //           removePressedKey(midimessage.key);
  //           break;
  //         default:
  //           break;
  //       }

  //       // if (channel == 9) return;
  //       // if (cmd == 8 || (cmd == 9 && velocity == 0)) {
  //       //   // with MIDI, note on with velocity zero is the same as note off
  //       //   // note off
  //       //   // openWebPiano.noteOff( noteNumber );
  //       //   //   pressedKeys.splice(pressedKeys.indexOf(noteNumber), 1);
  //       //   setPressedKeys(
  //       //     produce((keys) => {
  //       //       //   keys.splice(keys.indexOf(noteNumber), 1);
  //       //       keys.delete(noteNumber);
  //       //     }),
  //       //   );
  //       // } else if (cmd == 9) {
  //       //   // note on
  //       //   // openWebPiano.noteOn(noteNumber, velocity);
  //       //   setPressedKeys(
  //       //     produce((keys) => {
  //       //       //   keys.push(noteNumber);
  //       //       keys.add(noteNumber);
  //       //     }),
  //       //   );
  //       // } else if (cmd == 11) {
  //       //   //controller( noteNumber, velocity);
  //       //   if (noteNumber == 64) {
  //       //     //   openWebPiano.sustain(velocity);
  //       //   }
  //       // } else if (cmd == 14) {
  //       //   // pitch wheel
  //       //   // pitchWheel( ((velocity * 128.0 + noteNumber)-8192)/8192.0 );
  //       // } else if (cmd == 10) {
  //       //   // poly aftertouch
  //       //   // polyPressure(noteNumber,velocity/127)
  //       // } else {
  //       //   //   console.log(
  //       //   //     "" + event.data[0] + " " + event.data[1] + " " + event.data[2]
  //       //   //   );
  //       // }
  //     };
  //   });
  // };
  // midi 객체를 사용하여 입력기를 찾아서 이벤트를 등록한다.

  // requestMIDIAccess()가 성공하면 이벤트를 등록한다.
  useEffect(() => {
    if (midi) {
      midi.onstatechange = midiConnectionStateChange;
      midi.inputs.forEach((input) => {
        input.onmidimessage = (e) => {
          console.log({ peers });
        };
      });
      console.log('MIDI initialized');
      setIsMidiConnected(true);
      console.log('peers in requestMIDIAccess', peers);
    }
  }, [midi]);

  const onMIDIStarted = useCallback(
    (midiAccess: WebMidi.MIDIAccess) => {
      // const inputs = new Map<string, WebMidi.MIDIInput>();
      // const outputs = new Map<string, WebMidi.MIDIOutput>();

      // midiAccess.inputs.forEach((input) => {
      //   inputs.set(input.id, input);
      // });

      // midiAccess.outputs.forEach((output) => {
      //   outputs.set(output.id, output);
      // });

      // console.log({
      //   inputs,
      //   outputs,
      // });

      // setLoading(false);
      // setMidiInput(inputs);
      // setMidiOutput(outputs);
      // initMidi(midiAccess);
      // console.log('MIDI ready!');

      midiAccess.onstatechange = midiConnectionStateChange;
      midiAccess.inputs.forEach((input) => {
        // entry.onmidimessage = onMIDIMessage(peers);
        input.onmidimessage = (e: WebMidi.MIDIMessageEvent) => {
          if (!playerRef.current) {
            return;
          }
          console.log({ peers });
          const midimessage = MIDImessage(e);
          // console.log({ midimessage });

          // const cmd = event.data[0] >> 4;
          // const channel = event.data[0] & 0xf;
          // const noteNumber = event.data[1];
          // const velocity = event.data[2];
          // const type = event.type;

          // console.log({
          //   cmd,
          //   channel,
          //   noteNumber,
          //   velocity,
          //   type,
          // });

          switch (midimessage.messageType) {
            case 'noteon':
              playerRef.current.play(midimessage.key);
              addPressedKey(midimessage.key);
              // peers['1'].send(midimessage.key);
              break;
            case 'noteoff':
              playerRef.current.stop(midimessage.key);
              removePressedKey(midimessage.key);
              break;
            default:
              break;
          }

          // if (channel == 9) return;
          // if (cmd == 8 || (cmd == 9 && velocity == 0)) {
          //   // with MIDI, note on with velocity zero is the same as note off
          //   // note off
          //   // openWebPiano.noteOff( noteNumber );
          //   //   pressedKeys.splice(pressedKeys.indexOf(noteNumber), 1);
          //   setPressedKeys(
          //     produce((keys) => {
          //       //   keys.splice(keys.indexOf(noteNumber), 1);
          //       keys.delete(noteNumber);
          //     }),
          //   );
          // } else if (cmd == 9) {
          //   // note on
          //   // openWebPiano.noteOn(noteNumber, velocity);
          //   setPressedKeys(
          //     produce((keys) => {
          //       //   keys.push(noteNumber);
          //       keys.add(noteNumber);
          //     }),
          //   );
          // } else if (cmd == 11) {
          //   //controller( noteNumber, velocity);
          //   if (noteNumber == 64) {
          //     //   openWebPiano.sustain(velocity);
          //   }
          // } else if (cmd == 14) {
          //   // pitch wheel
          //   // pitchWheel( ((velocity * 128.0 + noteNumber)-8192)/8192.0 );
          // } else if (cmd == 10) {
          //   // poly aftertouch
          //   // polyPressure(noteNumber,velocity/127)
          // } else {
          //   //   console.log(
          //   //     "" + event.data[0] + " " + event.data[1] + " " + event.data[2]
          //   //   );
          // }
        };
      });
    },
    [initMidi, peers, addPressedKey, removePressedKey],
  );

  /* MIDI DEVICE 연결 때마다 호출되는 함수 */
  function midiConnectionStateChange(e: WebMidi.MIDIConnectionEvent) {
    console.log('connection: ', e.port.name, e.port.connection, e.port.state);
  }

  const onMIDIMessage = useCallback(
    (peers) => (e: WebMidi.MIDIMessageEvent) => {
      if (!playerRef.current) {
        return;
      }
      const midimessage = MIDImessage(e);
      // console.log({ midimessage });

      // const cmd = event.data[0] >> 4;
      // const channel = event.data[0] & 0xf;
      // const noteNumber = event.data[1];
      // const velocity = event.data[2];
      // const type = event.type;

      // console.log({
      //   cmd,
      //   channel,
      //   noteNumber,
      //   velocity,
      //   type,
      // });

      switch (midimessage.messageType) {
        case 'noteon':
          playerRef.current.play(midimessage.key);
          addPressedKey(midimessage.key);
          console.log({ peers });
          // peers['1'].send(midimessage.key);
          break;
        case 'noteoff':
          playerRef.current.stop(midimessage.key);
          removePressedKey(midimessage.key);
          break;
        default:
          break;
      }

      // if (channel == 9) return;
      // if (cmd == 8 || (cmd == 9 && velocity == 0)) {
      //   // with MIDI, note on with velocity zero is the same as note off
      //   // note off
      //   // openWebPiano.noteOff( noteNumber );
      //   //   pressedKeys.splice(pressedKeys.indexOf(noteNumber), 1);
      //   setPressedKeys(
      //     produce((keys) => {
      //       //   keys.splice(keys.indexOf(noteNumber), 1);
      //       keys.delete(noteNumber);
      //     }),
      //   );
      // } else if (cmd == 9) {
      //   // note on
      //   // openWebPiano.noteOn(noteNumber, velocity);
      //   setPressedKeys(
      //     produce((keys) => {
      //       //   keys.push(noteNumber);
      //       keys.add(noteNumber);
      //     }),
      //   );
      // } else if (cmd == 11) {
      //   //controller( noteNumber, velocity);
      //   if (noteNumber == 64) {
      //     //   openWebPiano.sustain(velocity);
      //   }
      // } else if (cmd == 14) {
      //   // pitch wheel
      //   // pitchWheel( ((velocity * 128.0 + noteNumber)-8192)/8192.0 );
      // } else if (cmd == 10) {
      //   // poly aftertouch
      //   // polyPressure(noteNumber,velocity/127)
      // } else {
      //   //   console.log(
      //   //     "" + event.data[0] + " " + event.data[1] + " " + event.data[2]
      //   //   );
      // }
    },
    [playerRef, addPressedKey, removePressedKey],
  );

  function onMIDISystemError(err: any) {
    setError(err);
    console.log('MIDI not initialized - error encountered:' + err.code);
  }

  const onChangeInstrument = useCallback(
    async (newValue, actionMeta) => {
      try {
        console.log({
          newValue,
          actionMeta,
        });
        // setSelectedValue(e.target.value as InstrumentName);
        const instrument = await SoundFont.instrument(new AudioContext(), newValue.value);
        // setPlayer(instrument);
        playerRef.current = instrument;
        console.log('instrument loaded');
        // console.log({ player });
        // midiInput.forEach((input) => {
        //   instrument.listenToMidi(input);
        // });
      } catch (e) {
        console.error(e);
      }
    },
    [playerRef],
  );

  const onOK = useCallback(
    async (e: EventListenerOrEventListenerObject) => {
      try {
        const instrument = await SoundFont.instrument(new AudioContext(), 'acoustic_grand_piano');
        playerRef.current = instrument;
        console.log('instrument loaded');
        setIsMidiConnected(true);
      } catch (e) {
        console.error(e);
      }
    },
    [playerRef],
  );

  const onClickHTMLButton = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      try {
        const instrument = await SoundFont.instrument(new AudioContext(), 'acoustic_grand_piano');
        playerRef.current = instrument;
        console.log('instrument loaded');
        setIsMidiConnected(true);
      } catch (e) {
        console.error(e);
      }
    },
    [playerRef],
  );

  const onRequestMIDIAccess = useCallback(async () => {
    try {
      const midiAccess = await navigator.requestMIDIAccess();
      initMidi(midiAccess);
    } catch (e) {
      console.error(e);
    }
  }, [initMidi]);

  useEffect(() => {
    if (typeof navigator.requestMIDIAccess === 'function') {
      // navigator.requestMIDIAccess().then(onMIDIStarted, onMIDISystemError);
      onRequestMIDIAccess();
    } else {
      setError(new Error('MIDI is not supported in your browser.'));
      setLoading(false);
    }
    return () => {
      setIsMidiConnected(false);
      setError(null);
    };
  }, []);

  return { midiInput, midiOutput, loading, isMidiConnected, error, onChangeInstrument, onOK, onClickHTMLButton };
};

export default useMIDI;
