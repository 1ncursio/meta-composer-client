import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import useSWR from "swr";
import fetcher from "../../lib/api/fetcher";
import IUser from "../../typings/IUser";
import Message from "../../typings/Message";
import Peers from "../../typings/Peers";
import Peer from "simple-peer";
import Rtc from "../../typings/Rtc";
const index = () => {
  const { data: userData } = useSWR<IUser>("/auth", fetcher);
  const [peer, setPeer] = useState<Peer.Instance>();
  const [soket, setSoket] = useState<Socket>();
  useEffect(() => {
    if (userData && !soket) {
      const socket = io("localhost:4400");
      socket
        .on("connect", () => {
          console.log("soket on");
          socket.emit("setInit", {
            userId: userData?.id,
          });
        })
        .on("getOffer", (offerData: Rtc) => {
          const peer = makePeer(false);
          peer?.signal(offerData.data);
          setPeer(peer);
        })
        .on("sendOffer", () => {
          console.log("센드 오퍼");
          setPeer(makePeer(true));
        });
      setSoket(socket);
    }
    return () => {
      if (soket) {
        soket.emit("selfDisconnect", {
          userId: userData?.id,
        });
      }
    };
  }, [userData]);

  function makePeer(initiator: boolean) {
    if (!peer) {
      console.log("만드는중");
      let peer = new Peer({
        initiator: initiator,
        trickle: false,
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
          console.log("connet complate");
        })
        .on("data", () => {
          console.log("ddd");
        })
        .on("end", () => {
          console.log("끊김");
          setPeer(undefined);
        })
        .on("error", (err: Error) => {
          console.log(err);
        });

      setPeer(peer);
      return peer;
    } else {
      return peer;
    }
  }
  return <div>Rtc Connect</div>;
};

export default index;
