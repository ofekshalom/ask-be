import express, { Request, Response } from "express";
import cors from "cors";
import askRoute from "./routes/askRoute";
import userAuthMiddleware from "./middleware/userAuthMiddleware";

const PORT = process.env.PORT || 3031;
const app = express();

app.use(express.json({ limit: "10mb" }));

app.use(cors());

app.use("/ask", askRoute);

app.listen(PORT, async () => {
  console.log(`Server Started. Port: ${PORT}`);
});
