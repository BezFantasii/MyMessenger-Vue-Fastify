import fastify from "fastify";
import cors from "@fastify/cors";
import { Server } from "socket.io";
import pg from '@fastify/postgres';
import users from '../backend/routes/users.js'
import 'dotenv/config';

// import users from '../backend/routes/users.js'

const server = fastify({ logger: true });
await server.register(pg, {connectionString: process.env.CONNECTION_STRING});
server.register(users)
// Register CORS
await server.register(cors, {
  origin: "*"
});

// Create Socket.IO server
const io = new Server(server.server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  path: "/socket.io/" // Explicitly set Socket.IO path
});

let chatMessages = [];
let connectedClients = new Set();
io.on("connection", (socket) => {
  socket.emit('onConnected', socket.id)
  console.log("Client connected:", socket.id);
  connectedClients.add(socket.id)
  // Send message history to new client
  socket.emit("message-history", chatMessages, socket.id);

  socket.on("message", (data) => {
    // Add new message to array
    chatMessages.push(data);
    console.log("New message:", data);
    
    // Broadcast updated history to all clients
    io.emit("message-history", chatMessages);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    console.log("client list", connectedClients)
  });
});

// Root route
server.get("/", (req, reply) => {
  reply.send("Server is running");
});

// Handle favicon requests
server.get("/favicon.ico", (req, reply) => {
  reply.code(204).send(); // No content
});

// Start server
server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});