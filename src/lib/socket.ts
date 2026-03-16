import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { imageUrl } from "../redux/base/baseAPI";

let socket: Socket | null = null;
let isAuthenticated = false;

export const getIsAuthenticated = () => isAuthenticated;

export const socketInstance = (): Socket => {
  if (!socket) {
    const token = Cookies.get("accessToken");

    socket = io(imageUrl!, {
      transports: ["polling", "websocket"],
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      extraHeaders: {
        Authorization: token ?? "",
      },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
      isAuthenticated = false;

      const currentToken = Cookies.get("accessToken");
      if (currentToken) {
        socket?.emit("authenticate", currentToken);
        console.log("🔐 Authenticate emitted");
      }
    });

    socket.on("authenticated", (data: any) => {
      console.log("✅ Socket authenticated:", data);
      isAuthenticated = true;
    });

    socket.on("authentication_error", (err: any) => {
      console.error("❌ Socket auth error:", err);
      isAuthenticated = false;
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected:", reason);
      isAuthenticated = false;
      if (reason === "io server disconnect") {
        socket = null;
      }
    });

    socket.on("reconnect", () => {
      const currentToken = Cookies.get("accessToken");
      if (currentToken) {
        socket?.emit("authenticate", currentToken);
      }
    });
  }

  return socket;
};