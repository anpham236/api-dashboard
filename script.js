const form = document.getElementById("searchForm");
const input = document.getElementById("usernameInput");
const statusEl = document.getElementById("status");

const card = document.getElementById("result");
const avatar = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const bioEl = document.getElementById("bio");
const reposEl = document.getElementById("repos");
const followersEl = document.getElementById("followers");
const followingEl = document.getElementById("following");
const profileLink = document.getElementById("profileLink");

function setStatus(message) {
  statusEl.textContent = message;
}

function setLoading(isLoading) {
  const button = form.querySelector("button");
  button.disabled = isLoading;
  button.textContent = isLoading ? "Loading..." : "Search";
}

function hideCard() {
  card.classList.add("hidden");
}

function showCard() {
  card.classList.remove("hidden");
}

async function fetchGitHubUser(username) {
  const url = `https://api.github.com/users/${encodeURIComponent(username)}`;
  const res = await fetch(url);

  if (!res.ok) {
    // 404 is common for missing user
    if (res.status === 404) throw new Error("User not found. Try another username.");
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

function renderUser(user) {
  avatar.src = user.avatar_url;
  nameEl.textContent = user.name ?? user.login;
  bioEl.textContent = user.bio ?? "No bio provided.";
  reposEl.textContent = `Repos: ${user.public_repos}`;
  followersEl.textContent = `Followers: ${user.followers}`;
  followingEl.textContent = `Following: ${user.following}`;
  profileLink.href = user.html_url;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = input.value.trim();
  if (!username) return;

  hideCard();
  setStatus("");
  setLoading(true);

  try {
    const user = await fetchGitHubUser(username);
    renderUser(user);
    showCard();
    setStatus("Success.");
  } catch (err) {
    setStatus(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
});