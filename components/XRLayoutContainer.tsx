import Player from '@lib/midi/Player';
import SheetEntity from '@react-components/SheetEntity';
import useStore from '@store/useStore';
import { coordStr } from '@utils/aframeUtils';
import React, { useEffect, useMemo } from 'react';

const XRLayoutContainer = () => {
  //   const [openPopup, setOpenPopup] = useState(false);
  const {
    onClickHandler,
    isMicMuted,
    toggleMuteMic,
    isOpenSettings,
    closeSettings,
    openSettings,
    offsetX,
    offsetY,
    offsetZ,
    setOffsetX,
    setOffsetY,
    setOffsetZ,
  } = useStore((state) => state.xr);
  const { initMyStream } = useStore((state) => state.webRTC);

  const micIconUnicode = useMemo(() => (isMicMuted ? 'f131' : 'f130'), [isMicMuted]);

  const playOrPauseIconUnicode = useMemo(() => (Player.getInstance().paused ? 'f04b' : 'f04c'), []);

  const onTogglePlay = () => {
    if (!Player.getInstance().song) return;

    if (Player.getInstance().paused) {
      Player.getInstance().startPlay();
    } else {
      Player.getInstance().pause();
    }
  };

  useEffect(() => {
    initMyStream();
  }, []);

  return (
    <>
      {/* 세팅 레이아웃 */}

      {/* @ts-ignore */}
      <a-gui-flex-container
        visible={isOpenSettings}
        is-top-container
        id="setting-layout"
        flex-direction="column"
        justify-content="center"
        align-items="normal"
        item-padding={1}
        width={1.6}
        height={0.8}
        panel-color="#000000"
        panel-rounded={0}
        opacity={0.8}
        position={coordStr({
          x: 1.364,
          y: 1.5,
          z: -0.42,
        })}
        rotation={coordStr({
          x: 0,
          y: -45,
          z: 0,
        })}
        scale={coordStr({
          x: 0.1,
          y: 0.1,
          z: 1,
        })}
      >
        {/* offset X container */}
        <a-gui-flex-container flex-direction="row" justify-content="center" align-items="normal" width={1.6} height={1}>
          <a-gui-icon-button
            scale={coordStr({
              x: 1,
              y: 1,
              z: 1,
            })}
            height={1}
            icon="f068"
            icon-font-size={0.5}
            font-color="#f59f0a"
            focus-color="#ccc"
            background-color="#000000"
            background-color-opacity={0.6}
            onClick={() => setOffsetX(offsetX - 0.01)}
          />
          <a-gui-label
            width={1.5}
            height={1}
            value="Offset X"
            font-size={0.35}
            line-height={0.8}
            letter-spacing={0}
            background-color="#000000"
            opacity={0.8}
            font-color="#ffffff"
            margin="0 0 0.05 0"
          />
          <a-gui-icon-button
            scale={coordStr({
              x: 1,
              y: 1,
              z: 1,
            })}
            height={1}
            icon="2b"
            icon-font-size={0.5}
            font-color="#f59f0a"
            focus-color="#ccc"
            background-color="#000000"
            background-color-opacity={0.6}
            onClick={() => setOffsetX(offsetX + 0.01)}
          />
        </a-gui-flex-container>
        <a-gui-flex-container flex-direction="row" justify-content="center" align-items="normal" width={1.6} height={1}>
          <a-gui-icon-button
            scale={coordStr({
              x: 1,
              y: 1,
              z: 1,
            })}
            height={1}
            icon="f068"
            icon-font-size={0.5}
            font-color="#f59f0a"
            focus-color="#ccc"
            background-color="#000000"
            background-color-opacity={0.6}
            onClick={() => setOffsetY(offsetY - 0.01)}
          />
          <a-gui-label
            width={1.5}
            height={1}
            value="Offset Y"
            font-size={0.35}
            line-height={0.8}
            letter-spacing={0}
            background-color="#000000"
            opacity={0.8}
            font-color="#ffffff"
            margin="0 0 0.05 0"
          />
          <a-gui-icon-button
            scale={coordStr({
              x: 1,
              y: 1,
              z: 1,
            })}
            height={1}
            icon="2b"
            icon-font-size={0.5}
            font-color="#f59f0a"
            focus-color="#ccc"
            background-color="#000000"
            background-color-opacity={0.6}
            onClick={() => setOffsetY(offsetY + 0.01)}
          />
        </a-gui-flex-container>
        <a-gui-flex-container flex-direction="row" justify-content="center" align-items="normal" width={1.6} height={1}>
          <a-gui-icon-button
            scale={coordStr({
              x: 1,
              y: 1,
              z: 1,
            })}
            height={1}
            icon="f068"
            icon-font-size={0.5}
            font-color="#f59f0a"
            focus-color="#ccc"
            background-color="#000000"
            background-color-opacity={0.6}
            onClick={() => setOffsetZ(offsetZ - 0.01)}
          />
          <a-gui-label
            width={1.5}
            height={1}
            value="Offset Z"
            font-size={0.35}
            line-height={0.8}
            letter-spacing={0}
            background-color="#000000"
            opacity={0.8}
            font-color="#ffffff"
            margin="0 0 0.05 0"
          />
          <a-gui-icon-button
            scale={coordStr({
              x: 1,
              y: 1,
              z: 1,
            })}
            height={1}
            icon="2b"
            icon-font-size={0.5}
            font-color="#f59f0a"
            focus-color="#ccc"
            background-color="#000000"
            background-color-opacity={0.6}
            onClick={() => setOffsetZ(offsetZ + 0.01)}
          />
        </a-gui-flex-container>

        {/* 세팅 닫기 버튼 */}
        <a-gui-icon-button
          scale={coordStr({
            x: 1,
            y: 1,
            z: 0.4,
          })}
          height={1}
          icon="58"
          icon-font-size={0.5}
          font-color="#f59f0a"
          focus-color="#ccc"
          background-color="#000000"
          onClick={closeSettings}
        />
      </a-gui-flex-container>
      {/* 악보 컨테이너 */}
      <a-gui-flex-container
        is-top-container
        flex-direction="column"
        justify-content="center"
        align-items="normal"
        width={1.28}
        height={1}
        panel-color="#000000"
        panel-rounded={0}
        opacity={0.5}
        position={coordStr({
          x: 0.083,
          y: 2,
          z: -1,
        })}
      >
        <SheetEntity />
      </a-gui-flex-container>
      {/* 컨트롤 버튼 컨테이너 */}
      <a-gui-flex-container
        is-top-container
        flex-direction="row"
        justify-content="center"
        align-items="normal"
        item-padding={1}
        width={1.28}
        height={0.2}
        panel-color="#000000"
        panel-rounded={0.05}
        opacity={0.5}
        position={coordStr({
          x: 0.083,
          y: 1.35,
          z: -0.98,
        })}
        scale={coordStr({
          x: 0.1,
          y: 0.1,
          z: 0.5,
        })}
      >
        {/* 볼륨 아이콘 */}
        <a-gui-icon-button
          scale={coordStr({
            x: 1,
            y: 1,
            z: 0.4,
          })}
          height={1}
          onclick=""
          icon="f027"
          icon-font-size={0.5}
          font-color="#f59f0a"
          focus-color="#ccc"
          background-color="#000000"
        />
        <a-gui-slider
          border-color="#f6f6f6"
          background-color="#000000"
          active-color="#f59f0a"
          hover-color="#f97316"
          handle-outer-radius={0}
          handle-inner-radius={0.2}
          left-right-padding={0.2}
          background-opacity={0.5}
          width={5}
          height={1}
          scale={coordStr({
            x: 0.5,
            y: 0.5,
            z: 0.2,
          })}
          slider-bar-height={0.2}
          onClick={onClickHandler}
          percent={0.2}
          margin="0 0 0.05 0"
        />
        {/* backward-step 아이콘 */}
        <a-gui-icon-button
          scale={coordStr({
            x: 1,
            y: 1,
            z: 0.4,
          })}
          height={1}
          onclick=""
          icon="f048"
          icon-font-size={0.5}
          font-color="#f59f0a"
          focus-color="#ccc"
          background-color="#000000"
        />
        {/* pause / play 아이콘 */}
        <a-gui-icon-button
          scale={coordStr({
            x: 1,
            y: 1,
            z: 0.4,
          })}
          height={1}
          icon={playOrPauseIconUnicode}
          icon-font-size={0.5}
          font-color="#f59f0a"
          focus-color="#ccc"
          background-color="#000000"
          toggle
          toggle-state={false}
          onClick={onTogglePlay}
          className="raycastable"
        />
        {/* forward-step 아이콘 */}
        <a-gui-icon-button
          scale={coordStr({
            x: 1,
            y: 1,
            z: 0.4,
          })}
          height={1}
          onclick=""
          icon="f051"
          icon-font-size={0.5}
          font-color="#f59f0a"
          focus-color="#ccc"
          background-color="#000000"
        />
        {/* 마이크 아이콘 */}
        <a-gui-icon-button
          scale={coordStr({
            x: 1,
            y: 1,
            z: 0.4,
          })}
          height={1}
          icon={micIconUnicode}
          icon-font-size={0.5}
          font-color="#f59f0a"
          focus-color="#ccc"
          background-color="#000000"
          toggle
          toggle-state={isMicMuted}
          onClick={toggleMuteMic}
        />
        {/* 설정 아이콘 */}
        <a-gui-icon-button
          scale={coordStr({
            x: 1,
            y: 1,
            z: 0.4,
          })}
          height={1}
          icon="f013"
          icon-font-size={0.5}
          font-color="#f59f0a"
          focus-color="#ccc"
          background-color="#000000"
          onClick={openSettings}
        />
        {/* 악보 선택 아이콘 */}
        <a-gui-icon-button
          scale={coordStr({
            x: 1,
            y: 1,
            z: 0.4,
          })}
          height={1}
          icon="f518"
          icon-font-size={0.5}
          font-color="#f59f0a"
          focus-color="#ccc"
          background-color="#000000"
          onClick={openSettings}
        />
        {/* <a-gui-button
          scale={coordStr({
            x: 1,
            y: 1,
            z: 0.4,
          })}
          width={1.5}
          height={1}
          value="Select Sheet"
          font-size={0.35}
          line-height={0.8}
          letter-spacing={0}
          background-color="#000000"
          opacity={0.8}
          font-color="#ffffff"
          margin="0 0 0.05 0"
        /> */}
      </a-gui-flex-container>
      {/* <a-gui-flex-container
        is-top-container
        flex-direction="column"
        justify-content="center"
        align-items="normal"
        component-padding={0.1}
        panel-color="#000000"
        opacity={1}
        width={2}
        height={3}
        panel-rounded={0.1}
        position={coordStr({ x: 0, y: 2.5, z: -6 })}
        rotation="0 0 0"
      >
        <a-gui-icon-button
          height={0.75}
          onclick=""
          icon="f6a9"
          icon-font-size={0.4}
          font-color="#f59f0a"
          hover-color="#fff"
          focus-color="#ccc"
          background-color="#fff"
        />
      </a-gui-flex-container> */}
    </>
  );
};

export default XRLayoutContainer;
