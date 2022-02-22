import React, { FC } from 'react';
import { AiOutlineDesktop } from 'react-icons/ai';
import { BsBadgeVr } from 'react-icons/bs';
import * as styles from './styles';

export interface RoomEntryContainerProps {
  isOculus: boolean;
}

const RoomEntryContainer: FC<RoomEntryContainerProps> = ({ isOculus }) => {
  return (
    <>
      <AiOutlineDesktop size={128} className={styles.icon(isOculus)} />
      <BsBadgeVr size={128} className={styles.icon(!isOculus)} />
    </>
  );
};

export default RoomEntryContainer;
