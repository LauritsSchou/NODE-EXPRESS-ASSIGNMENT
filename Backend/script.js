import express from "express";
import cors from "cors";
import { getArtists, getArtistById, updateArtist, deleteArtist, favoriteArtist, postArtist } from "./controller.js";
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

app.get("/artists", getArtists);

app.get("/artists/:id", getArtistById);

app.post("/artists", postArtist);

app.delete("/artists/:id", deleteArtist);

app.put("/artists/:id", updateArtist);

app.put("/artists/favorites/:id", favoriteArtist);
