import { Assets, Plane } from '@belivvr/aframe-react';
import SheetContainer from '@react-components/SheetContainer';
import React from 'react';
import 'aframe';
import '@components/draw-canvas';
import '@components/canvas-updater';

// 이 컴포넌트는 무조건 next의 dynamic import를 이용해 ssr: false 세팅을 해서 사용함.
const SheetEntity = () => {
  return (
    <>
      <Assets>
        <SheetContainer id="sheet" />
      </Assets>
      <Plane
        material={{
          shader: 'flat',
          src: '#sheet',
        }}
        rotation={{ x: 0, y: 0, z: 0 }}
        position={{
          x: 0,
          y: 2,
          z: -1,
        }}
        draw-canvas
        canvas-updater
      />
    </>
  );
};

export default SheetEntity;
