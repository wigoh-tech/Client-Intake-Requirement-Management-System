
import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:4000",
  methods: ["GET", "POST"],
}));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
  },
});

interface ConnectedSockets {
  [userId: string]: Socket;
}

const connectedSockets: ConnectedSockets = {};

io.on("connection", (socket: Socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("register", (userId: string) => {
    connectedSockets[userId] = socket;
    console.log(`User registered with ID: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);

    // Remove socket from connectedSockets when it disconnects
    for (const userId in connectedSockets) {
      if (connectedSockets[userId].id === socket.id) {
        delete connectedSockets[userId];
        console.log(`User ${userId} disconnected and removed.`);
        break;
      }
    }
  });
});

app.post("/notify", (req: Request, res: Response) => {
  const comment = req.body;

  console.log("New comment received via API:", comment);

  // Broadcast comment to all connected clients
  io.emit("new_comment", comment);

  res.status(200).json({ message: "Comment broadcasted." });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on http://localhost:${PORT}`);
});

