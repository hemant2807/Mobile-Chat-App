import { io } from "socket.io-client";

let socket: any = null;

export const connectSocket = (userId: string) => {
  socket = io("http://10.41.11.72:5000", {
    query: { userId },
    transports: ["websocket"],
  });

  return socket;
};

export const getSocket = () => socket;
