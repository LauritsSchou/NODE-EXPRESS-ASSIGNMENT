const endpoint = "http://localhost:3000";
const headers = { "Content-Type": "application/json" };
async function getArtists() {
  const response = await fetch(`${endpoint}/artists`);
  const data = await response.json();
  return data;
}
async function deleteArtist(id) {
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    return response;
  } else {
    console.error("Failed to delete artist. Status: " + response.status);
  }
}
async function submitUpdatedArtist(
  id,
  name,
  birthdate,
  activeSince,
  genres,
  labels,
  website,
  image,
  shortDescription
) {
  const artistToUpdate = {
    id,
    name,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    image,
    shortDescription,
  };
  const url = `${endpoint}/artists/${id}`;
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(artistToUpdate),
    headers: headers,
  });
  if (response.ok) {
    return response;
  } else {
    console.error("Failed to update artist. Status: " + response.status);
  }
}
async function submitNewArtist(
  name,
  birthdate,
  activeSince,
  genres,
  labels,
  website,
  image,
  shortDescription
) {
  const newArtist = {
    name,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    image,
    shortDescription,
  };
  const artistAsJson = JSON.stringify(newArtist);
  const response = await fetch(`${endpoint}/artists`, {
    method: "POST",
    body: artistAsJson,
    headers: headers,
  });
  if (response.ok) {
    return response;
  } else {
    console.error("Failed to submit new artist. Status: " + response.status);
  }
}
async function changeFavorites(artist) {
  console.log("change favorites clicked");
  const response = await fetch(`${endpoint}/artists/favorites/${artist.id}`, {
    method: "PUT",
  });
  if (response.ok) {
    return response;
  } else {
    console.error(
      "Failed to change favorite status. Status: " + response.status
    );
  }
}
export {
  getArtists,
  deleteArtist,
  submitUpdatedArtist,
  submitNewArtist,
  changeFavorites,
};
