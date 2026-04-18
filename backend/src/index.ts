import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import chatRoute from "./routes/chatRoute.js";
import messagesRoute from "./routes/messageRoute.js";
import { initQdrant } from "./configs/qdrant.js";
import { getDataSource } from "./lib/data-source.js";
import { clerkMiddleware } from "@clerk/express";
import morgan from "morgan";
dotenv.config();
const app=express();
app.use(cors());
app.use(clerkMiddleware());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/chat', chatRoute);
app.use('/api/messages', messagesRoute);
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);
 
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const PORT=8000
async function start() {

 const dataSource = await getDataSource();


  await initQdrant(); 

  app.listen(PORT, () => {
    console.log("Server running");
  });
}

start();