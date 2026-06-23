// +−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−+
// |                      What Have You Made Today?                      |
// +−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−+

function brightText(el) {
  const text = el.textContent;

  // Function to generate bright colours (high saturation & lightness)
  function brightColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 90%, 60%)`;
  }

  // Replace text with spans
  el.innerHTML = [...text]
    .map((char) => `<span style="--c:${brightColor()}">${char}</span>`)
    .join("");
}

brightText(document.getElementById("whymt"));

// +−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−+
// |                      Search bar functionality                        |
// +−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−+

document.getElementById("form").addEventListener("submit", function (event) {
  const input = document.getElementById("search").value.trim();

  // Regular expression to check if the input looks like a domain name or URL
  const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/.*)?$/i;

  if (urlPattern.test(input)) {
    // Prevent the standard form submission to Google
    event.preventDefault();

    // Ensure the URL has a protocol prefix so the browser navigates away correctly
    let targetUrl = /^https?:\/\//i.test(input) ? input : "https://" + input;

    // Navigate directly to the website
    window.location.href = targetUrl;
  }
});

function gemini() {
  const input = document.getElementById("search").value.trim();

  if (input === "") {
    window.location.href = "https://www.google.com/ai";
  } else {
    window.location.href = `https://www.google.com/ai?q=${input}`;
  }
}

// +−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−+
// |                               Cookies                                |
// +−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−+

const FAVORITES_COOKIE = "speed-dial-favorites";

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`))
    ?.split("=")[1];
}

function getFavorites() {
  try {
    return JSON.parse(decodeURIComponent(getCookie(FAVORITES_COOKIE) || "[]"));
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  setCookie(FAVORITES_COOKIE, JSON.stringify(favorites));
}

const PLAYLIST_COOKIE = "speed-dial-playlist";

function getPlaylist() {
  try {
    return JSON.parse(decodeURIComponent(getCookie(PLAYLIST_COOKIE) || "[]"));
  } catch {
    return [];
  }
}

function savePlaylist(playlist) {
  setCookie(PLAYLIST_COOKIE, JSON.stringify(playlist));
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function getFaviconUrl(url) {
  try {
    const { hostname } = new URL(normalizeUrl(url));
    return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
  } catch {
    return "favicon.png";
  }
}

function renderFavorites() {
  const container = document.getElementById("favorites");

  if (!container) {
    return;
  }

  const favorites = getFavorites();

  const items = favorites
    .map(
      (favorite, index) => `
        <a class="favorite-item" href="${favorite.url}" target="_self" data-index="${index}">
          <div class="button-container">
            <button class="remove" type="button" onclick="event.preventDefault(); removeFavorite(this);" aria-label="Remove ${favorite.name}">
              <?xml version="1.0" encoding="utf-8"?><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#0000" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11V17"/><path d="M14 11V17"/><path d="M4 7H20"/><path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"/><path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"/></svg>
            </button>
            <button class="edit" type="button" onclick="event.preventDefault(); editFavorite(this);" aria-label="Edit ${favorite.name}">
              <?xml version="1.0" encoding="utf-8"?><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="Vector" d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
          <img src="${getFaviconUrl(favorite.url)}" width="50" height="50" alt="${favorite.name}" />
          <span>${favorite.name}</span>
        </a>
      `
    )
    .join("");

  container.innerHTML = `
    ${items}
    <button class="favorite-item new-favorite" type="button" onclick="addFavorite()">
      <img src="add.svg" width="50" height="50" alt="Add Site" />
      <span>Add site</span>
    </button>`;
}

function addFavorite() {
  const name = window.prompt("Favorite name", "Example Site")?.trim();
  const inputUrl = window.prompt("Favorite URL", "https://example.com")?.trim();

  if (!name || !inputUrl) {
    return;
  }

  const favorites = getFavorites();
  favorites.push({ name, url: normalizeUrl(inputUrl) });
  saveFavorites(favorites);
  renderFavorites();
}

function removeFavorite(button) {
  const item = button.closest(".favorite-item");
  const index = Number(item?.dataset.index ?? -1);

  if (index < 0) {
    return;
  }

  const favorites = getFavorites();
  favorites.splice(index, 1);
  saveFavorites(favorites);
  renderFavorites();
}

function editFavorite(button) {
  const item = button.closest(".favorite-item");
  const index = Number(item?.dataset.index ?? -1);

  if (index < 0) {
    return;
  }

  const favorites = getFavorites();
  const current = favorites[index];
  const name = window.prompt("Favorite name", current.name)?.trim();
  const inputUrl = window.prompt("Favorite URL", current.url)?.trim();

  if (!name || !inputUrl) {
    return;
  }

  favorites[index] = { name, url: normalizeUrl(inputUrl) };
  saveFavorites(favorites);
  renderFavorites();
}

window.addFavorite = addFavorite;
window.removeFavorite = removeFavorite;
window.editFavorite = editFavorite;

function renderPlaylist() {
  const container = document.getElementById("playlist-items");
  if (!container) {
    return;
  }

  const playlist = getPlaylist();

  if (playlist.length === 0) {
    container.innerHTML = `
      <li class="playlist-empty">No tracks yet. Add one to begin.</li>
      <button id="playlist-add">＋ Add track to playlist</button>
    `;
  } else {
    container.innerHTML = `
      ${playlist
        .map(
          (track, index) => `
            <li class="track" data-index="${index}">
              <div class="button-container" style="opacity: 1;">
              <button class="track-play" type="button" onclick="event.preventDefault(); playTrack(this);" aria-label="Play ${track.name}">▶</button>
              </div>
              <div class="track-info">
                <span class="track-name">${track.name}</span>
                <span class="track-url">${track.url}</span>
              </div>
              <div class="button-container">
                <button class="remove" type="button" onclick="event.preventDefault(); removeTrack(this);" aria-label="Remove ${track.name}">
                  <?xml version="1.0" encoding="utf-8"?><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#0000" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11V17"/><path d="M14 11V17"/><path d="M4 7H20"/><path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"/><path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"/></svg>
                </button>
                <button class="edit" type="button" onclick="event.preventDefault(); editTrack(this);" aria-label="Edit ${track.name}">
                  <?xml version="1.0" encoding="utf-8"?><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="Vector" d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </li>
          `,
        )
        .join("")}
      ${'<button id="playlist-add">＋ Add track to playlist</button>'}`;
  }

  const addButton = document.getElementById("playlist-add");
  if (addButton) {
    addButton.addEventListener("click", addTrack);
  }
}

function addTrack() {
  const name = window.prompt("Track name", "Sample Track")?.trim();
  const inputUrl = window.prompt("Track audio URL", "https://example.com/audio.mp3")?.trim();

  if (!name || !inputUrl) {
    return;
  }

  const playlist = getPlaylist();
  playlist.push({ name, url: normalizeUrl(inputUrl) });
  savePlaylist(playlist);
  renderPlaylist();
}

function playTrack(button) {
  const item = button.closest(".track");
  const index = Number(item?.dataset.index ?? -1);

  if (index < 0) {
    return;
  }

  const playlist = getPlaylist();
  const track = playlist[index];
  if (!track) {
    return;
  }

  const audio = document.getElementById("audio-player");
  audio.src = track.url;
  audio.play().catch(() => {});

  document.querySelectorAll("#playlist .track").forEach((row) => row.classList.remove("playing"));
  item.classList.add("playing");
}

function removeTrack(button) {
  const item = button.closest(".track");
  const index = Number(item?.dataset.index ?? -1);

  if (index < 0) {
    return;
  }

  const playlist = getPlaylist();
  playlist.splice(index, 1);
  savePlaylist(playlist);
  renderPlaylist();
}

function editTrack(button) {
  const item = button.closest(".track");
  const index = Number(item?.dataset.index ?? -1);

  if (index < 0) {
    return;
  }

  const playlist = getPlaylist();
  const current = playlist[index];
  const name = window.prompt("Track name", current.name)?.trim();
  const inputUrl = window.prompt("Track audio URL", current.url)?.trim();

  if (!name || !inputUrl) {
    return;
  }

  playlist[index] = { name, url: normalizeUrl(inputUrl) };
  savePlaylist(playlist);
  renderPlaylist();
}

window.addTrack = addTrack;
window.removeTrack = removeTrack;
window.editTrack = editTrack;
window.playTrack = playTrack;

document.getElementById("cover").addEventListener("click", () => {
  document.getElementById("playlist").style.display = "none";
  document.getElementById("cover").classList.remove("show");
});

renderFavorites();
renderPlaylist();

// +−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−+
// |                              Playlist                               |
// +−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−+

brightText(document.querySelector("#playlist div span"));

document.getElementById("view-playlist").addEventListener("click", event => {
  document.getElementById("playlist").style.display = "unset";
  document.getElementById("cover").classList.add("show");
});

document.getElementById("playlist-close").addEventListener("click", event => {
  document.getElementById("playlist").style.display = "none";
  document.getElementById("cover").classList.remove("show");
});

/*
// +−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−+
// |                               Show Body                              |
// +−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−+

// Create a reusable delay function
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Use it to display body without jittering
async function showBody() {
  await delay(1000);
  document.getElementById("main").style.opacity = "1";
}

showBody();
*/