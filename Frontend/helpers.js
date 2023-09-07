function compareName(artist1, artist2) {
  return artist1.name.localeCompare(artist2.name);
}

function compareGenres(artist1, artist2) {
  return artist1.genres.localeCompare(artist2.genres);
}
export { compareName, compareGenres };
