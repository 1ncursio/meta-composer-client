import { Box, Entity, Plane, Scene, Sky, Text } from '@belivvr/aframe-react';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Piano from '../../components/AFrame/Piano';

const VRPage: NextPage = () => {
  const [rendered, setRendered] = useState<boolean>(false);

  useEffect(() => {
    setRendered(true);

    if (typeof window !== 'undefined') {
      require('aframe'); // eslint-disable-line global-require
      require('aframe-geometry-merger-component');
    }
  }, [setRendered]);

  if (!rendered) {
    return <>loading</>;
  }

  return (
    <Scene
      inspector={{
        url: new URL(
          'https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js',
          // "https://aframe.io/aframe-inspector/dist/aframe-inspector.min.js",
        ),
      }}
      cursor="rayOrigin: mouse; fuse: false"
      raycaster="objects: .raycastable"
    >
      {/* <Camera
        lookControls={{
          enabled: true,
        }}
      > */}
      {/* <Cursor
        cursor={{
          rayOrigin: 'mouse',
          mouseCursorStylesEnabled: true,
          fuse: false,
          fuseTimeout: 500,
        }}
        raycaster={{
          objects: '.raycastable',
        }}
      /> */}
      {/* </Camera> */}
      <Piano
        position={{
          x: 0,
          y: 0.75,
          z: -0.4,
        }}
      />
      {/* <Mixin
        id="frame"
        geometry={{
          primitive: 'plane',
          width: 1,
          height: 1,
        }}
        material={{
          color: '#ffffff',
          shader: 'flat',
        }}
      /> */}
      <Plane position={{ x: 0, y: 0, z: 0 }} rotation={{ x: -90, y: 0, z: 0 }} width={1} height={1} color="#7BC8A4" />
      <Box
        position={{ x: 0, y: 0.5, z: -1 }}
        width={0.5}
        height={0.5}
        depth={0.5}
        color="#4CC3D9"
        animation__scale={{
          property: 'scale',
          to: '1.2 1.2 1.2',
          dur: 200,
          startEvents: ['mouseenter'],
        }}
        animation__scale__reverse={{
          property: 'scale',
          to: '1 1 1',
          dur: 200,
          startEvents: ['mouseleave'],
        }}
        className="raycastable"
        // clickable
      />
      <Text value="Hello World" position={{ x: 0, y: 1.5, z: -4 }} />
      <Sky color="#ECECEC" />
      <Entity
        handTrackingControls={{
          hand: 'left',
          modelColor: '#fbceb1',
        }}
        laserControls={{
          hand: 'left',
        }}
        oculusTouchControls={{
          hand: 'left',
        }}
        raycaster={{
          far: 100,
          objects: '.raycastable',
        }}
      />
      <Entity
        handTrackingControls={{
          hand: 'right',
          modelColor: '#fbceb1',
        }}
        laserControls={{
          hand: 'right',
        }}
        oculusTouchControls={{
          hand: 'right',
        }}
        raycaster={{
          far: 100,
          objects: '.raycastable',
        }}
      />
    </Scene>
  );
};

export default VRPage;
