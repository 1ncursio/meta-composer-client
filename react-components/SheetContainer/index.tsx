import React, { FC, useEffect, useRef } from 'react';
import Vex from 'vexflow';

export interface SheetContainerProps {
  id?: string;
}

const SheetContainer: FC<SheetContainerProps> = ({ id }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // canvas scale 2
    if (canvasRef.current) {
      //   canvasRef.current.width = 500 * 2;
      //   canvasRef.current.height = 500 * 2;
      const VF = Vex.Flow;
      const renderer = new VF.Renderer(canvasRef.current!, VF.Renderer.Backends.CANVAS);
      renderer.resize(500, 500);
      canvasRef.current.width = 500 * 4;
      canvasRef.current.height = 500 * 4;
      canvasRef.current.style.width = '500px';
      canvasRef.current.style.height = '500px';
      // canvas의 width와 height를 1000으로, style을 500으로 하면 2배가 될 듯?
      const context = renderer.getContext();
      context.setFont('Arial', 10, 600).setBackgroundFillStyle('#eed');
      const stave = new VF.Stave(10, 40, 400, { vertical_bar_width: 100 });
      // // Add a clef and time signature.
      stave.addClef('treble').addTimeSignature('4/4');
      // // Connect it to the rendering context and draw!
      stave.setContext(context).draw();

      // add a note to the stave
      var notes = [
        // A quarter-note C.
        new VF.StaveNote({ clef: 'treble', keys: ['c/4'], duration: 'q' }),

        // A quarter-note D.
        new VF.StaveNote({ clef: 'treble', keys: ['d/4'], duration: 'q' }),

        // A quarter-note rest. Note that the key (b/4) specifies the vertical
        // position of the rest.
        new VF.StaveNote({ clef: 'treble', keys: ['b/4'], duration: 'qr' }),

        // A C-Major chord.
        new VF.StaveNote({ clef: 'treble', keys: ['c/4', 'e/4', 'g/4'], duration: 'q' }),
      ];

      var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
      voice.addTickables(notes);

      // Format and justify the notes to 350 pixels (50 pixels left for key and time signatures).
      var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 350);

      // Render voice
      voice.draw(context, stave);
    }
  }, []);

  return <canvas id={id} ref={canvasRef} />;
};

export default SheetContainer;
