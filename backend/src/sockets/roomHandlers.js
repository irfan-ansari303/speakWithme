const rooms = new Map();
const MAX_MEMBERS = 7;

// Helper function
const getRoomMembers = (roomId) => {
  const room = rooms.get(roomId);
  if (!room) return [];
  return Array.from(room.members.entries()).map(([socketId, userId]) => ({
    socketId,
    userId
  }));
};

export const roomHandlers = (io, socket) => {
  console.log(`🔌 Socket connected: ${socket.id}, User: ${socket.userId}`);

  // Create room
  socket.on("create-room", (roomId, callback) => {
    if (!roomId) roomId = `room-${Date.now()}`;

    if (rooms.has(roomId)) {
      return callback?.({ ok: false, msg: "Room already exists" });
    }

    const room = {
      adminId: socket.userId,
      members: new Map()
    };

    room.members.set(socket.id, socket.userId);
    rooms.set(roomId, room);

    socket.join(roomId);

    console.log(`🏠 Room created: ${roomId}`);

    callback?.({
      ok: true,
      roomId,
      adminId: room.adminId,
      members: getRoomMembers(roomId)
    });

    io.to(roomId).emit("room-updated", {
      roomId,
      adminId: room.adminId,
      members: getRoomMembers(roomId)
    });
  });

  // Join room
  socket.on("join-room", (roomId, callback) => {
    const room = rooms.get(roomId);

    if (!room) return callback?.({ ok: false, msg: "Room does not exist" });
    if (room.members.size >= MAX_MEMBERS)
      return callback?.({ ok: false, msg: "Room full (max 7 users)" });

    room.members.set(socket.id, socket.userId);
    socket.join(roomId);

    console.log(`👤 User ${socket.userId} joined ${roomId}`);

    callback?.({
      ok: true,
      roomId,
      adminId: room.adminId,
      members: getRoomMembers(roomId)
    });

    io.to(roomId).emit("room-updated", {
      roomId,
      adminId: room.adminId,
      members: getRoomMembers(roomId)
    });
  });

  // Leave room
  socket.on("leave-room", (roomId, callback) => {
    const room = rooms.get(roomId);
    if (!room) return callback?.({ ok: false });

    room.members.delete(socket.id);
    socket.leave(roomId);

    console.log(`🚪 User ${socket.userId} left room ${roomId}`);

    if (room.members.size === 0) {
      rooms.delete(roomId);
      console.log(`🗑 Room deleted: ${roomId}`);
    } else {
      if (room.adminId === socket.userId) {
        const nextAdmin = room.members.values().next().value;
        room.adminId = nextAdmin;
      }

      io.to(roomId).emit("room-updated", {
        roomId,
        adminId: room.adminId,
        members: getRoomMembers(roomId)
      });
    }

    callback?.({ ok: true });
  });

  // Kick member
  socket.on("kick-member", ({ roomId, targetSocketId }, callback) => {
    const room = rooms.get(roomId);
    if (!room) return callback?.({ ok: false });

    if (room.adminId !== socket.userId)
      return callback?.({ ok: false, msg: "Only admin can kick" });

    room.members.delete(targetSocketId);
    io.sockets.sockets.get(targetSocketId)?.leave(roomId);

    io.to(targetSocketId).emit("kicked", { roomId });

    io.to(roomId).emit("room-updated", {
      roomId,
      adminId: room.adminId,
      members: getRoomMembers(roomId)
    });

    callback?.({ ok: true });
  });

  // Disconnect handler
  socket.on("disconnect", () => {
    console.log(`❌ ${socket.id} disconnected`);

    for (const [roomId, room] of rooms.entries()) {
      if (room.members.has(socket.id)) {
        room.members.delete(socket.id);
        socket.leave(roomId);

        if (room.members.size === 0) {
          rooms.delete(roomId);
        } else {
          if (room.adminId === socket.userId) {
            const nextAdmin = room.members.values().next().value;
            room.adminId = nextAdmin;
          }

          io.to(roomId).emit("room-updated", {
            roomId,
            adminId: room.adminId,
            members: getRoomMembers(roomId)
          });
        }
      }
    }
  });
};
    