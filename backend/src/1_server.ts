import http from "http";
import { app } from "./2_app";
import { connectToDatabase } from "./3_db";
import { setupSocket } from "./11_socket";

const PORT = 4000;

async function startServer() {
  await connectToDatabase();

  const server = http.createServer(app);

  setupSocket(server);

  server.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

startServer();
