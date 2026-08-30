let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: [
        "GET",
        "POST",
        "PATCH",
        "PUT",
        "DELETE",
      ],
    },
  });

  io.on("connection", (socket) => {
    console.log(
      `Socket connected: ${socket.id}`
    );

    socket.on("joinUser", (userId) => {
      if (!userId) return;

      socket.join(`user_${userId}`);

      console.log(
        `User ${userId} joined room`
      );
    });

    socket.on("disconnect", () => {
      console.log(
        `Socket disconnected: ${socket.id}`
      );
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized"
    );
  }

  return io;
};

module.exports = {
  initSocket,
  getIO,
};
