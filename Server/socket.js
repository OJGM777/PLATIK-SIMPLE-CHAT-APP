import { Server } from "socket.io";
import handleSocketEvents from "./socketHandlers.js";


const setupSocket = (server) => {
    const io = new Server(server, {
      pingTimeout: 120000,
      cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
      },
    });
  
    io.on("connection", (socket) => {
      handleSocketEvents(io, socket);  // ✅ Llamamos a los manejadores
    });
  
    return io;
  };

export default setupSocket;