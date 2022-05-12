import React, { FC, useEffect, useRef } from 'react';
import Vex from 'vexflow';

export interface SheetContainerProps {
  id?: string;
}

const SheetContainer: FC<SheetContainerProps> = ({ id }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const VF = Vex.Flow;
      const renderer = new VF.Renderer(canvasRef.current!, VF.Renderer.Backends.CANVAS);
      const width = 1200;
      const height = 300;
      renderer.resize(width, height);
      const context = renderer.getContext();
      context.setFont('Arial', 10, 600);

      context.setFillStyle('white');
      // context.setStrokeStyle('red');
      context.fillRect(0, 0, width, height);

      context.setFillStyle('black');
      // context.setBackgroundFillStyle('black');
      const stave = new VF.Stave(10, 40, 400, { fill_style: 'black' });
      // // Add a clef and time signature.
      stave.addClef('treble').addTimeSignature('4/4');
      // // Connect it to the rendering context and draw!
      stave.setContext(context).draw();

      // add a note to the stave
      const notes = [
        // A quarter-note C.
        new VF.StaveNote({ clef: 'treble', keys: ['c/4'], duration: 'q' }),

        // A quarter-note D.
        new VF.StaveNote({ clef: 'treble', keys: ['d/4'], duration: 'q' }),

        // A quarter-note rest. Note that the key (b/4) specifies the vertical
        // position of the rest.
        // new VF.GhostNote({ clef: 'treble', keys: ['b/4'], duration: 'qr' }),
        new VF.GhostNote({ duration: 'q' }),

        // A C-Major chord.
        new VF.StaveNote({ clef: 'treble', keys: ['c/4', 'e/4', 'g/4'], duration: 'q' }),
      ];

      notes.forEach((note) => {
        note.setStyle({ fillStyle: 'black' });
      });

      const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
      voice.addTickables(notes);
      // voice.addTickables(notes);

      // Format and justify the notes to 350 pixels (50 pixels left for key and time signatures).
      const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 350);

      // Render voice
      voice.draw(context, stave);
    }
  }, []);

  return <canvas id={id} ref={canvasRef} />;
};

export default SheetContainer;
