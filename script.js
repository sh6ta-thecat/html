const apiUrl = "https://sh6ta-thecat.github.io/cuddly/api.json";
const resultsContainer = document.getElementById("results");
const searchForm = document.getElementById("searchForm");
const queryInput = document.getElementById("query");
const filterSelect = document.getElementById("filter");

let animeData = [];

// Obtener los datos
async function fetchData() {
  try {
    const res = await fetch(apiUrl);
    animeData = await res.json();
    renderResults(animeData);
  } catch (error) {
    resultsContainer.innerHTML = `<p class="error">Error al obtener los datos de la API.</p>`;
  }
}

// Mostrar resultados
function renderResults(data) {
  if (data.length === 0) {
    resultsContainer.innerHTML = `<p>No se encontraron resultados.</p>`;
    return;
  }

  resultsContainer.innerHTML = data
    .map(
      (item) => `
      <a href="details.html?id=${item.id}" class="card">
        <img src="${item.imagen}" alt="${item.title}">
        <div class="card-content">
          <h2>${item.title}</h2>
          <p>Tags:&nbsp;&nbsp; ${item.tags}</p>
        </div>
      </a>
    `
    )
    .join("");
}

// Buscar
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = queryInput.value.toLowerCase().trim();
  const filter = filterSelect.value;

  let results = animeData.filter((item) => {
    if (filter === "name") return item.title.toLowerCase().includes(query);
    if (filter === "tags") return item.tags.toLowerCase().includes(query);
    return (
      item.title.toLowerCase().includes(query) ||
      item.tags.toLowerCase().includes(query)
    );
  });

  renderResults(results);
});

// Iniciar
fetchData();