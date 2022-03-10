import { css } from '@emotion/react';
import useSocket from '@hooks/useSocket';
import fetcher from '@lib/api/fetcher';
import { INoteEvent } from '@lib/midi/NoteEvent';
import VRLinkButton from '@react-components/VRLinkButton';
import { useMIDI, useMIDIMessage } from '@react-midi/hooks';
import useStore from '@store/useStore';
import IUser from '@typings/IUser';
import RtcData from '@typings/RtcData';
import MIDImessage from 'midimessage';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlineDesktop } from 'react-icons/ai';
import { BsBadgeVr } from 'react-icons/bs';
import { ControlledPiano, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import useSWR from 'swr';
import * as styles from './styles';

export interface RoomEntryContainerProps {
  isOculus: boolean;
}

const RoomEntryContainer: FC<RoomEntryContainerProps> = ({ isOculus }) => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [socket] = useSocket(workspaceName);
  const [selected, setSelected] = useState(0);
  const [rendered, setRendered] = useState(false);
  const { hasMIDI, inputs } = useMIDI();
  const message = useMIDIMessage(inputs[selected]);
  const { pressedKeys, addPressedKey, removePressedKey } = useStore((state) => state.piano);
  const { peers, addAfterMakePeer, linkState, setLinkState } = useStore((state) => state.webRTC);
  const { data: userData } = useSWR<IUser>('/auth', fetcher);
  const router = useRouter();

  const firstNote = MidiNumbers.fromNote('a0');
  const lastNote = MidiNumbers.fromNote('c8');

  const canStartXR = useMemo(() => linkState === 'connected' && isOculus, [linkState, isOculus]);

  const handleChangeSelect = useCallback(
    (e) => {
      setSelected(e.target.value);
      console.log(selected);
    },
    [selected],
  );

  /* Link 버튼 눌렀을 때 이벤트 핸들러 */
  const onClickLink = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      setLinkState('connecting');

      // 웹소켓 연결
      setWorkspaceName('selfSetup');
    },
    [setLinkState, setWorkspaceName],
  );

  const onPlayNoteInput = useCallback(
    (keyNumber: number) => {
      if (!userData || linkState !== 'connected' || !peers[userData.id]) return;

      // 노트에 넣고 피어 이벤트 발생
      addPressedKey(keyNumber);

      const data = {
        type: 'noteOn',
        note: keyNumber,
      };
      peers[userData.id].send(JSON.stringify(data));
    },
    [addPressedKey, userData, peers, linkState],
  );

  const onStopNoteInput = useCallback(
    (keyNumber: number) => {
      if (!userData || linkState !== 'connected' || !peers[userData.id]) return;

      // 노트에서 삭제하고 피어 이벤트 발생
      if (pressedKeys.has(keyNumber)) {
        removePressedKey(keyNumber);
        const data: INoteEvent = {
          type: 'noteOff',
          note: keyNumber,
          velocity: 127,
        };

        peers[userData.id].send(JSON.stringify(data));
      }
    },
    [removePressedKey, userData, peers, linkState, pressedKeys],
  );

  const onEnterWebXR = useCallback(() => {
    if (!userData || linkState !== 'connected' || !peers[userData.id]) return;

    router.push('/vr');
  }, [userData, linkState, peers, router]);

  /* midimessage 발생했을 때 실행 */
  useEffect(() => {
    if (message) {
      const midiMessage = new MIDImessage(message);

      switch (midiMessage.messageType) {
        case 'noteon':
          addPressedKey(midiMessage.key);
          break;
        case 'noteoff':
          if (pressedKeys.has(midiMessage.key)) {
            removePressedKey(midiMessage.key);
          }
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
          console.log('self setup 소켓이 연결됨');
          socket.emit('setInit');
        })
        .on('getOffer', (offerData: RtcData) => {
          console.log('offer 받음');

          const peer = addAfterMakePeer(userData.id, false, socket, isOculus);

          peer.signal(offerData.data);
        })
        .on('sendOffer', () => {
          console.log('offer 보냄');

          addAfterMakePeer(userData.id, true, socket, isOculus);
        })
        .on('disconnect', () => {
          console.log('self setup 소켓 연결 끊김');
          // setLinkState('disconnected');
        });
    }

    return () => {
      socket?.off('connect').off('getOffer').off('sendOffer').off('disconnect');
    };
  }, [socket, userData]);

  useEffect(() => {
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
      <VRLinkButton state={linkState} onClick={onClickLink} />
      {canStartXR && (
        <button type="button" onClick={onEnterWebXR} className="btn btn-accent">
          WebXR 입장하기!
        </button>
      )}
      {!isOculus ? (
        inputs.length > 0 ? (
          <h3>MIDI 키보드가 연결되었습니다! 오큘러스에 접속하기 전에 미리 테스트해 보세요.</h3>
        ) : (
          <h3>감지된 MIDI 키보드가 없습니다. MIDI 키보드를 연결해 주세요.</h3>
        )
      ) : null}
      {/* 피어 테스트용 코드 */}
      {/* {Object.keys(peers).map((peerId, i) => (
        <div key={peerId}>{`${i + 1}번째 피어 : ${peerId}`}</div>
      ))} */}
      <div className="w-full 2xl:h-36 xl:h-32 lg:h-28 md:h-24 h-20">
        <ControlledPiano
          noteRange={{ first: firstNote, last: lastNote }}
          activeNotes={Array.from(pressedKeys)}
          playNote={() => {}}
          stopNote={() => {}}
          onPlayNoteInput={onPlayNoteInput}
          onStopNoteInput={onStopNoteInput}
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
