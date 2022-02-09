import { produce, enableMapSet } from 'immer';
import { useState, useEffect, useCallback, useRef } from 'react';
import SoundFont from 'soundfont-player';
import MIDImessage from 'midimessage';
import type { Player } from 'soundfont-player';
import type { ActionMeta, SingleValue } from 'react-select';

enableMapSet();

const useMIDI = (): {
  midi: WebMidi.MIDIAccess | null;
  midiInput: Map<string, WebMidi.MIDIInput>;
  midiOutput: Map<string, WebMidi.MIDIOutput>;
  loading: boolean;
  error: Error | null;
  pressedKeys: Set<number>;
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
  // player: Player | null;
} => {
  // const [selectedInstrument, setSelectedInstrument] = useState<InstrumentName>('acoustic_grand_piano');
  const [midi, setMidi] = useState<WebMidi.MIDIAccess | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());
  const [midiInput, setMidiInput] = useState<Map<string, WebMidi.MIDIInput>>(new Map<string, WebMidi.MIDIInput>());
  const [midiOutput, setMidiOutput] = useState<Map<string, WebMidi.MIDIOutput>>(new Map<string, WebMidi.MIDIOutput>());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // const [player, setPlayer] = useState<Player | null>(null);
  const playerRef = useRef<Player | null>(null);

  function onMIDIStarted(midiAccess: WebMidi.MIDIAccess) {
    const inputs = new Map<string, WebMidi.MIDIInput>();
    const outputs = new Map<string, WebMidi.MIDIOutput>();

    midiAccess.inputs.forEach((input) => {
      inputs.set(input.id, input);
    });

    midiAccess.outputs.forEach((output) => {
      outputs.set(output.id, output);
    });

    console.log({
      inputs,
      outputs,
    });

    setLoading(false);
    setMidiInput(inputs);
    setMidiOutput(outputs);
    setMidi(midiAccess);
    console.log('MIDI ready!');

    midiAccess.onstatechange = midiConnectionStateChange;
    startLoggingMIDIInput(midiAccess);
  }

  /* MIDI DEVICE 연결 때마다 호출되는 함수 */
  function midiConnectionStateChange(e: WebMidi.MIDIConnectionEvent) {
    console.log('connection: ', e.port.name, e.port.connection, e.port.state);
  }

  function startLoggingMIDIInput(midiAccess: WebMidi.MIDIAccess) {
    midiAccess.inputs.forEach(function (entry) {
      entry.onmidimessage = onMIDIMessage;
    });
  }

  function onMIDISystemError(err: any) {
    setError(err);
    console.log('MIDI not initialized - error encountered:' + err.code);
  }

  const onMIDIMessage = useCallback(
    (e: WebMidi.MIDIMessageEvent) => {
      if (!playerRef.current) {
        return;
      }
      const midimessage = MIDImessage(e);
      console.log({ midimessage });

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
          // console.log({ player });
          playerRef.current.play(midimessage.key);
          setPressedKeys(
            produce(pressedKeys, (draft) => {
              draft.add(midimessage.key);
            }),
          );
          break;
        case 'noteoff':
          playerRef.current.stop(midimessage.key);
          setPressedKeys(
            produce(pressedKeys, (draft) => {
              draft.delete(midimessage.key);
            }),
          );
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
    [pressedKeys, playerRef],
  );

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
    [playerRef, midiInput],
  );

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDIStarted, onMIDISystemError);
    } else {
      setError(new Error('MIDI is not supported in your browser.'));
      setLoading(false);
    }
  }, []);

  return { midi, midiInput, midiOutput, loading, error, pressedKeys, onChangeInstrument };
};

export default useMIDI;
