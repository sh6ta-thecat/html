const apiUrl = "https://sh6ta-thecat.github.io/cuddly/api.json";
const detailsContainer = document.getElementById("animeDetails");

// Obtener ID de la URL (?id=123)
const params = new URLSearchParams(window.location.search);
const animeId = params.get("id");

async function fetchDetails() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    const anime = data.find((item) => item.id == animeId);

    if (!anime) {
      detailsContainer.innerHTML = `<p class="error">Anime no encontrado.</p>`;
      return;
    }

    detailsContainer.innerHTML = `
      <div class="anime-card">
        <img src="${anime.imagen}" alt="${anime.title}">
        <div class="anime-info">
          <h2>${anime.title}</h2>
          <p><strong>Tags:</strong> ${anime.tags}</p>
          <p><strong>Descripción:</strong> ${anime.descripcion || "Sin descripción disponible."}</p>
        </div>
      </div>
    `;
  } catch (error) {
    detailsContainer.innerHTML = `<p class="error">Error al cargar los detalles.</p>`;
  }
}

fetchDetails();
