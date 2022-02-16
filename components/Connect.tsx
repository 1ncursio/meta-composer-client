import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import useSWR from "swr";
import fetcher from "../lib/api/fetcher";
import IUser from "../typings/IUser";
import Message from "../typings/Message";
import Peers from "../typings/Peers";
import Peer from "simple-peer";
import Rtc from "../typings/Rtc";
import RtcData from "../typings/RtcData";
import client from "../lib/api/client";

const Connect = () => {
  const { data: userData } = useSWR<IUser>("/auth", fetcher);
  const [connected, setConnected] = useState<boolean>(false);
  const [myPeer, setMyPeer] = useState<Peer.Instance>();
  const [soket, setSoket] = useState<any>();

  useEffect(() => {
    if (userData && !connected) {
      const socket = io("localhost:4400");
      socket
        .on("connect", () => {
          console.log("soket on");
          socket.emit("setInit", {
            userId: userData?.id,
          });
        })
        .on("getOffer", (offerData: RtcData) => {
          const peer = makePeer(false, socket, myPeer);
          peer?.signal(offerData);
          setMyPeer(peer);
        })
        .on("sendOffer", () => {
          setMyPeer(makePeer(true, socket, myPeer));
        });
      setConnected(true);
    }
    //     1.dependancy(두번째 인자로 넘기는 배열)가 바뀌어서 effect가 달라져야할 때 (이전 effect 청소)
    //   2. 해당 component가 unmount 될 때

    return () => {
      console.log("실행");
      if (soket) {
        setTimeout(() => {
          soket.emit("selfDisconnect", {
            userId: userData?.id,
          });
        });
      }
    };
  }, [userData, connected]);

  // const auth = useCallback(
  //   (initiator: boolean, soket: Socket) => () => {\
  //   },
  //   []
  // );

  const makePeer = (
    initiator: boolean,
    soket: Socket,
    myPeer: Peer.Instance | undefined
  ) => {
    console.log({ myPeer }, "makepeer");
    if (!myPeer) {
      console.log("만드는중");
      let peer = new Peer({
        initiator: initiator,
        trickle: false,
        config: {
          iceServers: [
            {
              urls: "turn:numb.viagenie.ca",
              credential: "muazkh",
              username: "webrtc@live.com",
            },
            {
              urls: "turn:numb.viagenie.ca:3478?transport=udp",
              credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
              username: "28224511:1379330808",
            },
            {
              urls: "turn:numb.viagenie.ca?transport=tcp",
              credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
              username: "28224511:1379330808",
            },
          ],
        },
      });
      peer
        .on("signal", (data: Peer.SignalData) => {
          // console.log("hee");
          console.log({ soket });
          if (soket && userData) {
            console.log("heepw");
            soket.emit("getOffer", {
              userId: userData.id,
              data,
            });
          }
        })
        .on("connect", (stream: any) => {
          console.log("Peer connet complate!!!");
        })
        .on("data", () => {
          console.log("ddd");
        })
        .on("end", () => {
          console.log("끊김");
          // setMyPeer(undefined);
        })
        .on("error", (err: Error) => {
          console.log(err);
        });
      return peer;
    } else {
      return myPeer;
    }
  };
  return <div> childeren</div>;
};

export default Connect;
