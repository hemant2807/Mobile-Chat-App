import io from "socket.io-client";

const SOCKET_URL = "http://10.41.11.72:5000";
let socket: any = null;

export const initSocket = (userId: string) => {
  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    query: { userId },
  });

  return socket;
};

export const getSocket = () => socket;
