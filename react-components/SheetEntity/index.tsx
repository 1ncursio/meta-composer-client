import { Plane } from '@belivvr/aframe-react';
import '@components/canvas-updater';
import '@components/draw-canvas';
import 'aframe';
import React from 'react';

// 이 컴포넌트는 무조건 next의 dynamic import를 이용해 ssr: false 세팅을 해서 사용함.
const SheetEntity = () => {
  return (
    <>
      <Plane
        material={{
          shader: 'flat',
          src: '#sheet',
        }}
        // width={2.4}
        // height={0.6}
        width={1.2}
        height={0.3}
        rotation={{ x: 0, y: 0, z: 0 }}
        draw-canvas
        canvas-updater
        // scale={{ x: 0.5, y: 0.5, z: 1 }}
      />
    </>
  );
};

export default SheetEntity;
