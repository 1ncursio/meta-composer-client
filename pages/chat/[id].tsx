import { IOType } from "child_process";
// import { Socket } from "dgram";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Message from "../../typings/Message";

const chat = () => {
  const router = useRouter();
  const { id } = router.query;
  const [soket, setSoket] = useState<Socket>();
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);
  useEffect(() => {
    const soket = io("localhost:4444");

    soket
      .on("connect", () => {
        console.log("soket on");
        soket.emit("setInit", {
          nickname: id,
        });
      })
      .on("getMessage", (msg: Message) => {
        setMessages((before) => [...before, msg]);
      });

    setSoket(soket);
    return () => {
      soket.disconnect();
    };
  }, [id]);

  const sendMessage = () => {
    if (soket) {
      soket.emit("sendMessage", {
        name: "jung",
        text: "test",
      });
    }
  };
  return (
    <div>
      <div>heelow chat</div>
      <button onClick={sendMessage} className="bg-yellow-400">
        send meesage go
      </button>
      {messages.map((msg: Message) => {
        <div>
          {msg.name}:{msg.text}
        </div>;
      })}
    </div>
  );
};

export default chat;
