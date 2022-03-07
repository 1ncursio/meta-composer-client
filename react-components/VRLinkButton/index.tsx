import React, { FC } from 'react';
import { AiOutlineSync } from 'react-icons/ai';
import { BiErrorCircle } from 'react-icons/bi';
import * as styles from './styles';

export interface VRLinkButtonProps {
  state: 'idle' | 'connecting' | 'connected' | 'disconnected';
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const VRLinkButton: FC<VRLinkButtonProps> = ({ state, onClick }) => {
  if (state === 'idle') {
    return (
      <button type="button" onClick={onClick} className={styles.linkButton(state)}>
        <AiOutlineSync size={24} />
        VR과 링크하기
      </button>
    );
  }

  if (state === 'connecting') {
    return (
      <button type="button" onClick={onClick} className={styles.linkButton(state)}>
        링크 대기 중
      </button>
    );
  }

  if (state === 'connected') {
    return (
      <button type="button" onClick={onClick} className={styles.linkButton(state)}>
        링크 완료
      </button>
    );
  }

  // if (state === 'disconnected')
  return (
    <button type="button" onClick={onClick} className={styles.linkButton(state)}>
      <BiErrorCircle size={24} />
      링크 끊김
    </button>
  );
};

export default VRLinkButton;
