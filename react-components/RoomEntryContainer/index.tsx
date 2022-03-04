import { css } from '@emotion/react';
import { useMIDI, useMIDIMessage } from '@react-midi/hooks';
import MIDImessage from 'midimessage';
import { FC, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { AiOutlineDesktop, AiOutlineSync } from 'react-icons/ai';
import { BsBadgeVr } from 'react-icons/bs';
import { ControlledPiano, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import useSWR from 'swr';
import useSocket from '@hooks/useSocket';
import fetcher from '@lib/api/fetcher';
import useStore from '@store/useStore';
import IUser from '@typings/IUser';
import * as styles from './styles';
import RtcData from '@typings/RtcData';

export interface RoomEntryContainerProps {
  isOculus: boolean;
}

const RoomEntryContainer: FC<RoomEntryContainerProps> = ({ isOculus }) => {
  const [socket] = useSocket('selfSetup');
  const [selected, setSelected] = useState(0);
  const [rendered, setRendered] = useState(false);
  const [isLinkLoading, setIsLinkLoading] = useState(false);
  const { hasMIDI, inputs } = useMIDI();
  const message = useMIDIMessage(inputs[selected]);
  const { pressedKeys, addPressedKey, removePressedKey } = useStore((state) => state.piano);
  const { peers, removePeer, resetPeers, addAfterMakePeer } = useStore((state) => state.webRTC);
  const { data: userData } = useSWR<IUser>('/auth', fetcher);

  const firstNote = MidiNumbers.fromNote('a0');
  const lastNote = MidiNumbers.fromNote('c8');

  const handleChangeSelect = useCallback(
    (e) => {
      setSelected(e.target.value);
      console.log(selected);
    },
    [selected],
  );

  /* Link 버튼 눌렀을 때 이벤트 핸들러 */
  const onClickLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLinkLoading(true);
    console.log('onClickLink');
    setTimeout(() => {
      setIsLinkLoading(false);
    }, 3000);
  };

  /* midimessage 발생했을 때 실행 */
  useEffect(() => {
    if (message) {
      const midiMessage = new MIDImessage(message);

      switch (midiMessage.messageType) {
        case 'noteon':
          addPressedKey(midiMessage.key);
          break;
        case 'noteoff':
          removePressedKey(midiMessage.key);
          break;
        default:
          break;
      }
    }
  }, [message]);

  useEffect(() => {
    if (userData && socket) {
      socket
        .on('connect', () => {
          console.log('self setup socket connected');

          socket.emit('setInit');
        })
        .on('getOffer', (offerData: RtcData) => {
          console.log('offer 받음');

          const peer = addAfterMakePeer(userData.id, false, socket, isOculus);
          peer.signal(offerData);
        })
        .on('sendOffer', () => {
          console.log('offer 보냄');

          addAfterMakePeer(userData.id, true, socket, isOculus);
        });
    }

    return () => {
      socket?.off('connect').off('getOffer').off('sendOffer');
    };
  }, [socket, userData]);

  useLayoutEffect(() => {
    setRendered(true);
  }, []);

  if (rendered && !isOculus && !hasMIDI) {
    return <div className="text-sm">Web MIDI API를 지원하지 않는 브라우저입니다. 다른 브라우저를 사용해 보세요.</div>;
  }

  return (
    <div className="flex flex-col items-center h-full gap-8">
      <div className="inline-flex justify-center">
        <AiOutlineDesktop size={128} className={styles.icon(!isOculus)} />
        <BsBadgeVr size={128} className={styles.icon(isOculus)} />
      </div>
      <select
        onChange={handleChangeSelect}
        value={selected}
        className="select select-primary select-bordered focus:outline-none select-sm w-full rounded-sm max-w-xs"
      >
        {inputs.length > 0 ? (
          inputs.map((input, index) => (
            <option key={index} value={index}>
              {`🎹 ${input.name}`}
            </option>
          ))
        ) : (
          <option>No MIDI devices found</option>
        )}
      </select>
      <button type="button" onClick={onClickLink} className={styles.linkButton(isLinkLoading)}>
        {isLinkLoading ? (
          <>링크 대기 중</>
        ) : (
          <>
            <AiOutlineSync size={24} />
            VR과 링크하기
          </>
        )}
      </button>
      {inputs.length > 0 ? (
        <h3>MIDI 키보드가 연결되었습니다! 오큘러스에 접속하기 전에 미리 테스트해 보세요.</h3>
      ) : (
        <h3>감지된 MIDI 키보드가 없습니다. MIDI 키보드를 연결해 주세요.</h3>
      )}
      {Object.keys(peers).map((peerId, i) => (
        <div key={peerId}>{`${i + 1}번째 피어 : ${peerId}`}</div>
      ))}
      <div className="w-full 2xl:h-36 xl:h-32 lg:h-28 md:h-24 h-20">
        <ControlledPiano
          noteRange={{ first: firstNote, last: lastNote }}
          activeNotes={Array.from(pressedKeys)}
          playNote={() => {}}
          stopNote={() => {}}
          onPlayNoteInput={() => {}}
          onStopNoteInput={() => {}}
          keyWidthToHeight={0.5}
          css={pianoStyle}
        />
      </div>
    </div>
  );
};

const pianoStyle = css`
  .ReactPiano__Key--active {
    background: #f59e0b; /* Change the default active key color to bright red */
  }

  .ReactPiano__Key--accidental {
    /* background: #00f; Change accidental keys to be completely black */
  }

  .ReactPiano__Key--natural {
    /* background: #fff; */
    /* border: none; */
    border-radius: 0;
  }

  /* 눌린 상태인 흰 건반 */
  .ReactPiano__Key--active.ReactPiano__Key--natural {
    border: 1px solid #c27d08;
  }
`;

export default RoomEntryContainer;
