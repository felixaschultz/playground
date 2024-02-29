import type { MetaFunction } from "@remix-run/node";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const meta: MetaFunction = () => {
  return [
    { title: "Chat" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export function loader() {
  return { date: new Date() };
}

export default function Index() {
  /* useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    return () => {
      socket.disconnect();
    };
  }, []); */
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <h1>Remix Chat</h1>
    </div>
  );
}

/* export const action = ({request}) => {
  const uiid = v4();
  return redirect("/chat/" + uiid);
} */
