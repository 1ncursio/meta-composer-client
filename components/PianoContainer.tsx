import type { PositionProps } from '@belivvr/aframe-react/types/components/position';
import Piano from '@react-components/Piano';
import React, { FC } from 'react';
import XRLayoutContainer from './XRLayoutContainer';

export interface PianoContainerProps {
  position: PositionProps;
}

const PianoContainer: FC<PianoContainerProps> = ({ position }) => {
  return (
    <>
      <Piano position={position} />
      <XRLayoutContainer />
    </>
  );
};

export default PianoContainer;
