import useStore from '@store/useStore';
import React, { useEffect, useRef } from 'react';

const MyStreamContainer = () => {
  const { getMedia } = useStore((state) => state.webRTC);

  const myVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (myVideoRef.current) {
      getMedia(myVideoRef.current);
    }
  }, [myVideoRef.current]);

  return (
    <>
      <video
        autoPlay
        // muted
        playsInline
        ref={myVideoRef}
        onClick={() => {
          console.log('click');
        }}
      />
    </>
  );
};

export default MyStreamContainer;
