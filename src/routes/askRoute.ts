import express from "express";
import axios from "axios";

const router = express.Router();

interface Chunk {
  chunkId: string;
  confidence: string;
}
interface Answers {
  confidence: string;
  html: string;
}

router.post("/", async (req: express.Request, res: express.Response) => {
  const question = req.body.question;
  if (!question) {
    res.status(403).send({ error: "should add question param" });
  } else {
    const response = axios.post(
      "https://inference-runner.hw.ask-ai.co/ask",
      { question: question },
      {
        headers: {
          "X-API-Key": "7c4e87e6-aef8-467a-b43a-4f80147453bf",
        },
      }
    );

    const chunks = (await response).data.chunks as Chunk[];
    console.log(chunks);
    const filteredChunkes = chunks.filter(
      (chunk) => Number(chunk.confidence) >= 70
    );

    const generateChunkToken = axios.post(
      "https://chunk-holder.hw.ask-ai.co/auth/generate-token",
      null,
      {
        headers: {
          "X-API-Key": "d486a94c-29f4-453a-a822-f909a97dbfa7",
        },
      }
    );

    const token = (await generateChunkToken)?.data?.token;
    if (!token) {
      res.status(404).send();
    }
    console.log(filteredChunkes);

    const answers: Answers[] = [];
    for (const chunk of filteredChunkes) {
      const chunkResponse = axios.get(
        `https://chunk-holder.hw.ask-ai.co/chunks/${chunk.chunkId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      answers.push({
        confidence: chunk.confidence,
        html: (await chunkResponse).data,
      });
    }

    res.json(answers);
  }
});

export default router;
