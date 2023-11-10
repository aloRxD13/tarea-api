const apiKey = '984020dfa554f5c32d786763fc4de275';
let language = 'es';
let currentPage = 1;
const moviesPerPage = 10;
let totalPageCount = 0; // Variable para almacenar el número total de páginas

document.addEventListener('DOMContentLoaded', () => {
  const genreSelect = document.getElementById('genre-select');
  const movieList = document.getElementById('movie-list');
  const languageSelect = document.getElementById('language-select');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info'); // Elemento para mostrar la información de la página

  // Función para cargar géneros en el select
  function loadGenres() {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?language=${language}&api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        genreSelect.innerHTML = '<option value="">Todos los géneros</option>';
        data.genres.forEach(genre => {
          genreSelect.innerHTML += `<option value="${genre.id}">${genre.name}</option>`;
        });
      })
      .catch(error => console.error('Error al obtener géneros:', error));
  }

  // Función para cargar películas populares
  function loadPopularMovies(genreId = '') {
    const offset = (currentPage - 1) * moviesPerPage;
    fetch(`https://api.themoviedb.org/3/movie/popular?language=${language}&api_key=${apiKey}${genreId ? `&with_genres=${genreId}` : ''}&page=${currentPage}`)
      .then(response => response.json())
      .then(data => {
        movieList.innerHTML = '';
        data.results.forEach(movie => {
          const movieItem = document.createElement('div');
          movieItem.classList.add('movie-item');
          movieItem.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>${movie.overview}</p>
          `;
          movieList.appendChild(movieItem);
        });

        // Actualizar la información de la página
        totalPageCount = data.total_pages; // Actualizar el número total de páginas
        updatePageInfo();
        
        // Habilitar/deshabilitar botones de paginación
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPageCount;
      })
      .catch(error => console.error('Error al obtener películas populares:', error));
  }

  // Función para actualizar la información de la página
  function updatePageInfo() {
    pageInfo.textContent = `Página ${currentPage} de ${totalPageCount}`;
  }

  // Event listener para el cambio de género
  genreSelect.addEventListener('change', () => {
    const selectedGenreId = genreSelect.value;
    currentPage = 1; // Reiniciar la página a la primera cuando se cambia el género
    loadPopularMovies(selectedGenreId);
  });

  // Event listener para cambiar el idioma con el select
  languageSelect.addEventListener('change', () => {
    language = languageSelect.value;
    currentPage = 1; // Reiniciar la página a la primera cuando se cambia el idioma
    loadGenres();
    loadPopularMovies();
  });

  // Event listener para el botón "Anterior"
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadPopularMovies(genreSelect.value);
    }
  });

  // Event listener para el botón "Siguiente"
  nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPageCount) {
      currentPage++;
      loadPopularMovies(genreSelect.value);
    }
  });

  // Cargar géneros y películas populares al cargar la página
  loadGenres();
  loadPopularMovies();
});
