import filmsAPI from './apiServiсe';
import { renderCard } from './renderCard';
import { getGenreName } from './getGenreName';
import { refs } from './refs';

const trendingFilms = new filmsAPI();

async function TrendingFilms(event) {
  event.preventDefault();
  refs.searchForm.firstElementChild.value = '';
  trendingFilms.currentPage = 1;
  refs.mainSection.innerHTML = '';
  try {
    refs.loader.classList.remove('hidden');
    const result = await trendingFilms.getTrendingFilms();
    result.data.results.forEach(film => {
      const {
        title,
        name,
        poster_path,
        id,
        vote_average,
        genre_ids,
        first_air_date,
        release_date,
      } = film;
      let genre = getGenreName(genre_ids);
      renderCard(
        id,
        poster_path,
        title,
        name,
        genre,
        first_air_date,
        release_date,
        vote_average
      );
    });
    refs.loader.classList.add('hidden');
  } catch (error) {
    console.log('error');
  }
  infinteScroll();
}
refs.logoLink.addEventListener('click', TrendingFilms);
refs.homeBtn.addEventListener('click', TrendingFilms);
window.addEventListener('load', TrendingFilms);

async function LoadMorePhoto() {
  trendingFilms.currentPage += 1;
  try {
    const result = await trendingFilms.getTrendingFilms();
    result.data.results.forEach(film => {
      const {
        title,
        name,
        poster_path,
        id,
        vote_average,
        genre_ids,
        first_air_date,
        release_date,
      } = film;
      let genre = getGenreName(genre_ids);
      renderCard(
        id,
        poster_path,
        title,
        name,
        genre,
        first_air_date,
        release_date,
        vote_average
      );
    });
  } catch (error) {
    console.log('error');
  }
  infinteScroll();
}

const infinteObserver = new IntersectionObserver(
  ([entry], observer) => {
    // перевірка останього елемента
    if (entry.isIntersecting) {
      // перестаємо його відслідковувати
      observer.unobserve(entry.target);
      // Завантажуємо нову порцію контенту
      LoadMorePhoto();
    }
  },
  { threshold: 0.5 }
);

const infinteScroll = () => {
  const lastCard = document.querySelector('.card__item:last-child');
  if (lastCard) {
    infinteObserver.observe(lastCard);
  }
};
