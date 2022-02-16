import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import useSWR from "swr";
import fetcher from "../../lib/api/fetcher";
import IUser from "../../typings/IUser";
import Message from "../../typings/Message";
import Peers from "../../typings/Peers";
import Peer from "simple-peer";
import Rtc from "../../typings/Rtc";
import RtcData from "../../typings/RtcData";
import client from "../../lib/api/client";
import Connect from "../../components/Connect";

const index = () => {
  return (
    <div>
      <div>Rtc Connect</div>
      <Connect></Connect>
    </div>
  );
};

export default index;
