// ====== CHECK LOGIN ======
function checkUser() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(!currentUser) { window.location.href = "signin.html"; }
}

// ====== LOGOUT ======
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "signin.html";
}

// ====== TMDB CONFIG ======
const TMDB_API_KEY = "8a619102e9e6b2a8caf22b5bd8add8f0";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
let genresMap = {};

// ====== INIT ======
async function initApp() {
    checkUser();
    await getGenres();
    getPopularMovies();
    loadMyReviews();
    showSection('results');
}
initApp();

// ====== THEME TOGGLE ======
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const btn = document.getElementById('themeToggle');
    btn.textContent = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
}

// ====== SECTION NAVIGATION ======
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// ====== GET GENRES ======
async function getGenres() {
    const res = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    data.genres.forEach(g => genresMap[g.id] = g.name);
}

// ====== SEARCH MOVIES ======
async function searchMovies() {
    const query = document.getElementById("searchInput").value;
    if (!query) return;
    const res = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`);
    const data = await res.json();
    displayMovies(data.results, "movies");
}

// ====== POPULAR MOVIES ======
async function getPopularMovies() {
    const res = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    displayMovies(data.results, "popularMovies");
}

// ====== DISPLAY MOVIES ======
function displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    movies.forEach(movie => {
        const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/200x300?text=No+Image";
        const savedReviewObj = JSON.parse(localStorage.getItem(`reviews_${currentUser.email}`)) || {};
        const savedReview = savedReviewObj[movie.id]?.review || "";
        const savedRating = savedReviewObj[movie.id]?.rating || "";
        const movieGenres = movie.genre_ids.map(id => genresMap[id]).join(', ');

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
          <img src="${poster}" alt="${movie.title}">
          <div class="movie-info">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average} | 📅 ${movie.release_date || "N/A"}</p>
            <p>Genres: ${movieGenres || "N/A"}</p>
            <div class="overview">${movie.overview || "No description available."}</div>
            <div class="review-section">
              <textarea id="review_${movie.id}" placeholder="Write your review...">${savedReview}</textarea>
              <select id="rating_${movie.id}">
                <option value="">Rate this movie</option>
                <option value="1" ${savedRating=="1"?"selected":""}>⭐</option>
                <option value="2" ${savedRating=="2"?"selected":""}>⭐⭐</option>
                <option value="3" ${savedRating=="3"?"selected":""}>⭐⭐⭐</option>
                <option value="4" ${savedRating=="4"?"selected":""}>⭐⭐⭐⭐</option>
                <option value="5" ${savedRating=="5"?"selected":""}>⭐⭐⭐⭐⭐</option>
              </select>
              <button onclick="saveReview(${movie.id})">Save</button>
              <div class="saved-review" id="saved_${movie.id}">
                ${savedReview || savedRating ? `Your Review: ${savedReview} | Rating: ${savedRating}⭐` : ""}
              </div>
            </div>
          </div>
        `;
        container.appendChild(movieCard);
    });
}

// ====== SAVE REVIEW ======
function saveReview(movieId) {
    const review = document.getElementById(`review_${movieId}`).value;
    const rating = document.getElementById(`rating_${movieId}`).value;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const reviews = JSON.parse(localStorage.getItem(`reviews_${currentUser.email}`)) || {};
    reviews[movieId] = { review, rating };
    localStorage.setItem(`reviews_${currentUser.email}`, JSON.stringify(reviews));

    document.getElementById(`saved_${movieId}`).innerHTML = `Your Review: ${review} | Rating: ${rating}⭐`;
}

// ====== LOAD MY REVIEWS ======
function loadMyReviews() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const reviews = JSON.parse(localStorage.getItem(`reviews_${currentUser.email}`)) || {};
    const container = document.getElementById("reviewList");
    container.innerHTML = "";

    Object.keys(reviews).forEach(movieId => {
        const { review, rating } = reviews[movieId];
        container.innerHTML += `<div class="movie-card"><p>Movie ID: ${movieId}<br>Rating: ${rating}⭐<br>Review: ${review}</p></div>`;
    });
}
