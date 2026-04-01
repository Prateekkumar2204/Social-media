const Group = require("../model/group");

const setupSocket = (server) => {
  const socket = require("socket.io");

  const io = socket(server, {
    cors: {
      origin: "*",
      credentials: true
    }
  });

  global.onlineUsers = new Map();
  global.onlineGroupUsers = new Map();

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("add-grp-user", (userId) => {
      onlineGroupUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);

      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-receive", data);
      }
    });

    socket.on("send-video-call", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);

      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("video-call-receive", data);
      }
    });

    socket.on("send-grp-msg", async (data) => {
      try {
        const groupId = data.to;
        const group = await Group.findById(groupId);

        if (!group) {
          return;
        }

        const members = group.members;

        for (let i = 0; i < members.length; i++) {
          const memberId = members[i].toString();
          const sendUser = onlineGroupUsers.get(memberId);

          if (sendUser && data.from !== memberId) {
            socket.broadcast.to(sendUser).emit("msg-grp-receive", data);
          }
        }
      } catch (error) {
        console.log("Socket group message error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

module.exports = setupSocket;