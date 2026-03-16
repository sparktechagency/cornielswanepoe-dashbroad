import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { socketInstance } from "../lib/socket";

const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = socketInstance();
    setSocket(s);
  }, []);

  return socket;
};

export default useSocket;