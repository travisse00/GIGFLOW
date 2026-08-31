import { io } from "socket.io-client";

const socket = io("https://gigflow-qc81.onrender.com", {
  autoConnect: false,
});

export default socket;
