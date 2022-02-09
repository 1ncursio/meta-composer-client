import { Box, Cursor, Entity, Mixin, Plane, Scene, Sky, Text } from '@belivvr/aframe-react';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Piano from '../../components/AFrame/Piano';

const VRPage: NextPage = () => {
  const [rendered, setRendered] = useState<boolean>(false);

  useEffect(() => {
    setRendered(true);

    if (typeof window !== 'undefined') {
      require('aframe'); // eslint-disable-line global-require
    }
  }, [setRendered]);

  if (!rendered) {
    return <>loading</>;
  }

  return (
    <Scene
    // inspector={{
    //   url: new URL(
    //     "https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js"
    //     // "https://aframe.io/aframe-inspector/dist/aframe-inspector.min.js",
    //   ),
    // }}
    >
      {/* <Camera
        lookControls={{
          enabled: true,
        }}
      > */}
      <Cursor
        cursor={{
          rayOrigin: 'mouse',
          mouseCursorStylesEnabled: true,
          fuse: false,
          fuseTimeout: 500,
        }}
        raycaster={{
          objects: '.raycastable',
        }}
      />

      {/* </Camera> */}
      <Piano
        position={{
          x: 0,
          y: 0.75,
          z: -0.4,
        }}
      />

      {/* <Raycaster /> */}
      <Mixin
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
      />
      <Plane position={{ x: 0, y: 0, z: 0 }} rotation={{ x: -90, y: 0, z: 0 }} width={1} height={1} color="#7BC8A4" />
      <Box
        position={{ x: 0, y: 0.5, z: -0.4 }}
        width={1}
        height={1}
        depth={1}
        color="#4CC3D9"
        animation={{
          property: 'scale',
          to: '2.4 2.4 2.4',
          dur: 200,
          startEvents: ['mouseenter'],
          pauseEvents: ['mouseleave'],
        }}
      />
      {/* <Entity
        cursor={{
          rayOrigin: "mouse",
          downEvents: ["click"],
        }}
      /> */}

      <Text value="Hello World" position={{ x: 0, y: 1.5, z: -4 }} />
      <Sky color="#ECECEC" />
      <Entity
        handTrackingControls={{
          hand: 'left',
          modelColor: '#fbceb1',
        }}
        // laserControls={{
        //   hand: "left",
        // }}
        // raycaster={{
        //   far: 100,
        // }}
      />
      <Entity
        handTrackingControls={{
          hand: 'right',
          modelColor: '#fbceb1',
        }}
        // laserControls={{
        //   hand: "right",
        // }}
        // raycaster={{
        //   far: 100,
        // }}
      />
    </Scene>
  );
};

export default VRPage;
