import React, { useRef } from 'react';

const PeerStreamContainer = () => {
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <div>
      <video autoPlay muted playsInline ref={peerVideoRef} />
    </div>
  );
};

export default PeerStreamContainer;
