import { compareName, compareGenres } from "./helpers.js";
import { getArtists, deleteArtist, submitNewArtist, submitUpdatedArtist, changeFavorites } from "./rest-service.js";
window.addEventListener("load", initApp);
async function initApp() {
  updateArtistsGrid();
  document.querySelector("#select-sort-by").addEventListener("change", sortByChanged);
  document.querySelector(".create").addEventListener("click", createArtistClicked);
  document.querySelector("#input-search").addEventListener("keyup", inputSearchChanged);
  document.querySelector("#input-search").addEventListener("search", inputSearchChanged);
  document.querySelector("#select-filter-by").addEventListener("change", filterChanged);
}
async function updateArtistsGrid() {
  const artists = await getArtists();
  showArtists(artists);
}

function showArtists(listOfArtists) {
  document.querySelector("#artists").innerHTML = "";
  for (const artist of listOfArtists) {
    showArtist(artist);
  }
}
function showArtist(artist) {
  const favoriteButtonText = artist.favorite ? "Remove from favorites" : "Add to favorites";
  const artistHTML = /*html*/ ` <article class="grid-item">
                <img src="${artist.image}">
                <h1>${artist.name}</h1>
                <h2>${artist.genres}</h2>
                <div class="btns">
                <button class="delete">Delete</button>
                <button class="update">Update</button>
                <button class="favorite">${favoriteButtonText}</button>
                </div>
                
            </article>`;
  document.querySelector("#artists").insertAdjacentHTML("beforeend", artistHTML);
  document.querySelector("#artists article:last-child img").addEventListener("click", () => artistClicked(artist));
  document.querySelector("#artists article:last-child .delete").addEventListener("click", () => deleteClicked(artist));
  document.querySelector("#artists article:last-child .update").addEventListener("click", () => updateClicked(artist));
  document.querySelector("#artists article:last-child .favorite").addEventListener("click", () => changeFavoritesClicked(artist));
}
async function changeFavoritesClicked(artist) {
  const response = await changeFavorites(artist);
  if (response.ok) {
    updateArtistsGrid();
  }
}
async function deleteClicked(artist) {
  const response = await deleteArtist(artist.id);
  if (response.ok) {
    updateArtistsGrid();
  }
}
function updateClicked(artist) {
  document.querySelector("#update-form").showModal();
  const updateArtistForm = /*html*/ `
  <form id="update-artist" method="dialog">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required/><br>
  <label for="birthdate">Birthdate:</label>
  <input type="text" id="birthdate" name="birthdate" /><br>
  <label for="activeSince">Active since:</label>
  <input type="text" id="activeSince" name="activeSince" /><br>
  <label for="genres">Genres:</label>
  <input type="text" id="genres" name="genres" /><br>
  <label for="labels">Labels:</label>
  <input type="text" id="labels" name="labels" /><br>
  <label for="website">Website:</label>
  <input type="url" id="website" name="website" /><br>
  <label for image-url>
  Image URL:
  </label>
  <input type="url" id="image" name="image"/><br>
  <label for="shortDescription">Description:</label>
  <textarea id="shortDescription" name="shortDescription" rows="6" cols="50"></textarea>
  <button>Update</button>
  <button id ="closeModalButton">Close</button>
  </form>
  `;
  document.querySelector("#update-form").innerHTML = updateArtistForm;
  document.querySelector("#name").value = artist.name;
  document.querySelector("#birthdate").value = artist.birthdate;
  document.querySelector("#activeSince").value = artist.activeSince;
  document.querySelector("#genres").value = artist.genres;
  document.querySelector("#labels").value = artist.labels;
  document.querySelector("#website").value = artist.website;
  document.querySelector("#image").value = artist.image;
  document.querySelector("#shortDescription").value = artist.shortDescription;

  document.querySelector("#update-form").addEventListener("submit", () => prepareUpdatedArtistData(artist));
}

function artistClicked(artist) {
  document.querySelector("#artistDetails").showModal();
  const dialogHTML = /*html*/ `
    <h1>${artist.name}</h1>
<img src="${artist.image}" class="center">
<h2>${artist.shortDescription}</h2>
<h2>Date of birth: ${artist.birthdate}</h2>
<h2>Active since: ${artist.activeSince}</h2>
<h2>Genres: ${artist.genres}</h2>
<h2>Labels: ${artist.labels}</h2>
<h2>Website: ${artist.website}</h2>

    <form method="dialog">
		<button id ="closeModalButton">Close</button>
    </form>`;

  document.querySelector("#artistDetails").innerHTML = dialogHTML;
}
async function prepareUpdatedArtistData(artist) {
  const name = document.querySelector("#name").value;
  const birthdate = document.querySelector("#birthdate").value;
  const activeSince = document.querySelector("#activeSince").value;
  const genres = document.querySelector("#genres").value;
  const labels = document.querySelector("#labels").value;
  const website = document.querySelector("#website").value;
  const image = document.querySelector("#image").value;
  const shortDescription = document.querySelector("#shortDescription").value;

  const response = await submitUpdatedArtist(artist.id, name, birthdate, activeSince, genres, labels, website, image, shortDescription);
  if (response.ok) {
    document.querySelector("#update-form").close();
    updateArtistsGrid();
  }
}

function createArtistClicked() {
  document.querySelector("#create-form").showModal();
  const createArtistForm = /*html*/ `
    <form id="update-artist" method="dialog">
     <label for="name">Name:</label>
    <input type="text" id="name" name="name" required/><br>
      <label for="birthdate">Birthdate:</label>
      <input type="text" id="birthdate" name="birthdate" /><br>
      <label for="activeSince">Active since:</label>
      <input type="text" id="activeSince" name="activeSince" /><br>
      <label for="genres">Genres:</label>
      <input type="text" id="genres" name="genres" /><br>
      <label for="labels">Labels:</label>
      <input type="text" id="labels" name="labels" /><br>
      <label for="website">Website:</label>
      <input type="url" id="website" name="website" /><br>
      <label for image-url>
        Image URL:
      </label>
      <input type="url" id="image" name="image"/><br>
      <label for="shortDescription">Description:</label>
      <textarea id="shortDescription" name="shortDescription" rows="6" cols="50"></textarea>
      <br>
      <button>Submit</button>
      <input type="button" id="btn-cancel" value="Cancel">
    </form>
    `;
  document.querySelector("#create-form").innerHTML = createArtistForm;
  document.querySelector("#create-form").addEventListener("submit", prepareNewArtistData);
  document.querySelector("#btn-cancel").addEventListener("click", () => {
    document.querySelector("#create-form").close();
  });
}
async function prepareNewArtistData() {
  const name = document.querySelector("#name").value;
  const birthdate = document.querySelector("#birthdate").value;
  const activeSince = document.querySelector("#activeSince").value;
  const genres = document.querySelector("#genres").value;
  const labels = document.querySelector("#labels").value;
  const website = document.querySelector("#website").value;
  const image = document.querySelector("#image").value;
  const shortDescription = document.querySelector("#shortDescription").value;
  const response = await submitNewArtist(name, birthdate, activeSince, genres, labels, website, image, shortDescription);
  if (response.ok) {
    updateArtistsGrid();
    document.querySelector("#create-form").close();
  }
}
async function inputSearchChanged(event) {
  const query = event.target.value.toLowerCase();
  const artists = await getArtists();
  const filteredArtists = artists.filter((artist) => artist.name.toLowerCase().includes(query) || artist.genres.toLowerCase().includes(query));
  showArtists(filteredArtists);
}
async function sortByChanged() {
  const sortField = document.querySelector("#select-sort-by").value;
  const artists = await getArtists();

  if (sortField === "name") {
    artists.sort(compareName);
  } else if (sortField === "genres") {
    artists.sort(compareGenres);
  }

  showArtists(artists);
}
async function filterChanged() {
  const filterField = document.querySelector("#select-filter-by").value;
  const artists = await getArtists();
  if (filterField === "show-all") {
    showArtists(artists);
  } else {
    const filteredArtists = artists.filter((artist) => artist.favorite === true);
    showArtists(filteredArtists);
  }
}
