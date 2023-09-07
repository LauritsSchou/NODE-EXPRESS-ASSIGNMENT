import fs from "fs/promises";

async function readArtists() {
  const json = await fs.readFile("./data.json");
  return JSON.parse(json);
}
async function getArtists(req, res) {
  const artists = await readArtists();
  res.json(artists);
}
async function getArtistById(req, res) {
  const artists = await readArtists();
  const id = Number(req.params.id);
  const artist = artists.find((artist) => artist.id === id);
  if (!artist) {
    res.status(404).json({ error: "Artist not found" });
  } else {
    res.json(artist);
  }
}
async function postArtist(req, res) {
  const artists = await readArtists();
  const newArtist = {
    id: artists.length,
    ...req.body,
  };
  const exists = artists.find((artist) => artist.name.toLocaleLowerCase() === newArtist.name.toLocaleLowerCase());
  if (exists) {
    res.status(400).json({ error: "Artist already exists" });
  } else {
    artists.push(newArtist);
    fs.writeFile("data.json", JSON.stringify(artists));
    res.status(201).json(artists);
  }
}

async function deleteArtist(req, res) {
  const artists = await readArtists();
  const id = Number(req.params.id);
  const newArtists = artists.filter((artist) => artist.id !== id);
  fs.writeFile("data.json", JSON.stringify(newArtists));
  res.status(200).json(artists);
}

async function updateArtist(req, res) {
  const id = Number(req.params.id);
  const artists = await readArtists();
  const artistToUpdate = artists.find((artist) => artist.id === id);
  const body = req.body;
  artistToUpdate.name = body.name;
  artistToUpdate.birthdate = body.birthdate;
  artistToUpdate.activeSince = body.activeSince;
  artistToUpdate.genres = body.genres;
  artistToUpdate.labels = body.labels;
  artistToUpdate.website = body.website;
  artistToUpdate.image = body.image;
  artistToUpdate.shortDescription = body.shortDescription;
  fs.writeFile("data.json", JSON.stringify(artists));
  res.json(artists);
}
async function favoriteArtist(req, res) {
  const id = Number(req.params.id);
  const artists = await readArtists();
  const artistToUpdate = artists.find((artist) => artist.id === id);
  if (!artistToUpdate) {
    res.status(404).json({ error: "Artist not found" });
  } else {
    artistToUpdate.favorite = !artistToUpdate.favorite;
    fs.writeFile("data.json", JSON.stringify(artists));
    res.json(artists);
  }
}
export { readArtists, getArtists, getArtistById, updateArtist, deleteArtist, favoriteArtist, postArtist };
