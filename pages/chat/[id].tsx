import Pusher from "pusher-js";
import React, { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import client from "../../lib/api/client";
import fetcher from "../../lib/api/fetcher";
import IUser from "../../typings/IUser";
import Peer from "simple-peer";
import { useRouter } from "next/router";
import { channel } from "diagnostics_channel";
import Rtc from "../../typings/Rtc";
import PusherParse from "../../typings/PuherPaser";
import Peers from "../../typings/Peers";
const index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: userData } = useSWR<IUser>("/auth", fetcher);
  // const peers: Peers = {};
  const [peers, setPeers] = useState<Peers>({});

  useEffect(() => {
    if (userData) {
    }
  }, [userData]);

  useEffect(() => {
    const pusher = new Pusher("eef5f3bc1c485b22d058", {
      cluster: "ap3",
    });

    const channel = pusher.subscribe("chat");

    channel.bind("event", function (event: PusherParse) {
      const offerData: Rtc = event.data;
      if (offerData.userId == id) {
        const peer = gett(false, id == "1" ? "2" : "1");
        peer.signal(offerData.data);
      }
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, [id, peers]);

  function gett(initiator: boolean, id: string) {
    console.log(peers);
    if (!peers[id]) {
      console.log("만드는중");
      let peer = new Peer({
        initiator: initiator,
        trickle: false,
      });
      peer
        .on("signal", (data: Peer.SignalData) => {
          client.post("/pusher", {
            userId: id,
            data,
          });
        })
        .on("connect", (stream: any) => {
          console.log("heelow");
        });
      // peers[id] = peer;
      // setPeers((before) => ({ ...before, id: peer }));

      setPeers({ ...peers, id: peer });
      console.log(peers);
    }
    return peers[id];
  }
  const peerget = (initiator: boolean) => (e: React.MouseEvent) => {
    const userId = id == "1" ? "2" : "1";
    return gett(true, userId);
  };

  // function a(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  //   return ()=>{

  //   }
  // }

  return (
    <div>
      <div>Chat Page</div>
      <button className="bg-yellow-300" onClick={peerget(true)}>
        start webRtc connect
      </button>
      <div></div>
      {/* <button className="bg-blue-300" onClick={peerget(true)}>
        event send
      </button> */}
      {/* <button onClick={(e) => a(e)}>start webRtc connect</button> */}
    </div>
  );
};

export default index;
