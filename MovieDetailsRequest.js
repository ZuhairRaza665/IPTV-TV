import axios from "axios";
import { movies, shows, showsName } from "./api";
import { store } from "./redux/store";
import { addLikedMovies, addToContinueWatching } from "./redux/actions";

export let errorArray = [];
export let uniqueErrorArray = [];

export const fData = async () => {
  // // console.log("starting movie");
  const movieLength = movies.length;
  const batchSize = 100;
  const batches = Math.ceil(movieLength / batchSize);
  let breakLoop = false;

  for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
    // // console.log("Batch Index for movies:", batchIndex); // Logging batch index
    const batchStart = batchIndex * batchSize;
    const batchEnd = Math.min((batchIndex + 1) * batchSize, movieLength);

    // // console.log("Batch Start for movies:", batchStart); // Logging batch start index
    // // console.log("length 2 for movies: ", movieLength);
    // // console.log("Batch End for movies:", batchEnd); // Logging batch end index

    const fetchPromises = [];

    for (let i = batchStart; i < batchEnd; i++) {
      if (i < movieLength) {
        // // console.log("Fetching data for movie:", i); // Logging the movie index being fetched
        fetchPromises.push(fetchMovieData(movies[i]));
        // // console.log("Fetching data for movie:", i); // Logging the movie index being fetched
      } else {
        // console.log("end movie");
        breakLoop = true;
        break;
      }
    }

    if (breakLoop) {
      // console.log("end movie");
      break;
    }

    await Promise.all(fetchPromises.map((promise) => promise.catch((e) => e)));
  }
};

const languages = [
  "EN:",
  "FR:",
  "AR:",
  "AF:",
  "SW:",
  "DE:",
  "PO:",
  "IT:",
  "RO:",
  "IN:",
  "NL:",
  "ES:",
  "KR:",
  "PL:",
  "RU:",
  "PK:",
  "JP:",
  "CN:",
  "KO:",
  "TR:",
  "IN-Telugu:",
  "IN-Mal:",
  "IN-EN:",
  "BR:",
  "Tamil:",
  "FR|",
  "(FR)",
];

export const fetchMovieData = async (item) => {
  let fullTitle;
  let nam = null;
  let year = null;
  let index = null;

  if (item) {
    fullTitle = item.title;
    index = fullTitle?.indexOf(" - ");

    if (index == -1) {
      index = fullTitle?.indexOf("(");
      nam = fullTitle.substring(0, index - 2);
      year = fullTitle.substring(index + 1, index + 5);
    } else {
      nam = fullTitle.substring(0, index);
      year = fullTitle.substring(index + 3, index + 7);
    }
  }

  if (nam != null) {
    for (const lang of languages) {
      if (nam.startsWith(lang)) {
        nam = nam.substring(lang.length).trim();
      }
    }

    const modifiedName = nam.replace(/ /g, "%20");

    function isYearValid(year) {
      // Convert the year to an integer
      const yearNumber = parseInt(year);

      // Check if the yearNumber is a valid number and within a reasonable range
      if (!isNaN(yearNumber) && yearNumber >= 1000 && yearNumber <= 9999) {
        return true; // Valid year
      } else {
        return false; // Not a valid year
      }
    }

    const isYear = isYearValid(year);

    let API_ENDPOINT;

    if (isYear) {
      API_ENDPOINT = `https://api.themoviedb.org/3/search/movie?query=${modifiedName}&%20US&primary_release_year=${year}&page=1&api_key=d159eaf1a8e9ef27976592ad48ed5a2a`;
    } else {
      API_ENDPOINT = `https://api.themoviedb.org/3/search/movie?query=${modifiedName}&%20US&page=1&api_key=d159eaf1a8e9ef27976592ad48ed5a2a`;
    }

    try {
      const response = await axios.get(API_ENDPOINT);
      const data = response.data;
      const movieData = data.results[0];
      const movieId = movieData.id || null;

      if (movieId) {
        item.id = movieId;
        const detailsPromise = fetchMovieDetails(item, movieId);
        await detailsPromise;
      }
    } catch (error) {
      // console.log("Error");
      errorArray.push(item);
    }
  }
};

const fetchMovieDetails = async (item, movieID) => {
  const API_ENDPOINT = `https://api.themoviedb.org/3/movie/${movieID}?&api_key=d159eaf1a8e9ef27976592ad48ed5a2a`;

  try {
    const response = await axios.get(API_ENDPOINT);
    const data = response.data;
    item.backdrop_path = data.backdrop_path;
    item.genreNames = data.genres.map((genre) => genre.name);
    item.overview = data.overview;
    item.poster_path = data.poster_path;
    item.release_date = data.release_date;
    item.runtime = data.runtime;
    item.vote_average = data.vote_average;
    item.vote_count = data.vote_count;
  } catch (error) {
    errorArray.push(item);
  }
};

export const getLikedData = async (likedList, dispatch, setRefresh) => {
  // // console.log("Liked List from getLikedData: ", likedList);
  // // console.log("movie 100 from getLikedData: ", movies[100]);
  // // console.log("movie 200 from getLikedData: ", movies[200]);
  // // console.log("movie -50 from getLikedData: ", movies[movies.length - 50]);

  const likedMovies = likedList.map((likedTitle) => {
    const foundMovie = movies.find((movie) => movie.title === likedTitle);
    if (foundMovie) {
      return foundMovie;
    } else {
      const foundTv = showsName.find((show) => show.title === likedTitle);
      return foundTv;
    }
  });

  // // console.log("Liked Movies from getLikedData: ", likedMovies);

  dispatch(addLikedMovies(likedMovies));
  setRefresh(true);
};

export const getContinueWatchingData = async (
  watchingList,
  dispatch,
  setRefresh
) => {
  // // console.log("Continue Watching List from getLikedData: ", watchingList);

  const continueWatchingArray = watchingList.map((item) => {
    const foundMovie = movies.find((movie) => movie.title === item.title);
    if (foundMovie) {
      return foundMovie;
    } else {
      const title = item.title;

      const seasonIndex = title.search(/S\d+/i);
      const seasonNumber = title?.slice(seasonIndex, seasonIndex + 3);
      // console.log("Season Number:", seasonNumber);

      const seasonNumberIndex = title?.indexOf(seasonNumber);
      let finalTitle = title.substring(0, seasonNumberIndex - 1);

      // console.log("Final Title:", finalTitle);
      // console.log("Shows index:", shows[1]);
      const foundTv = showsName.find(
        (show) => show.title.toLowerCase() === finalTitle.toLowerCase()
      );

      const foundShow = shows.find(
        (show) => show.title.toLowerCase() === item.title.toLowerCase()
      );

      if (foundShow) {
        // console.log("Found show: ", foundShow);
        foundTv.title = foundShow.title;
        foundTv.link = foundShow.link;
        // console.log("Final TV: ", foundTv);
      } else {
        // console.log("Not Found show");
      }

      // console.log("returing tv: ", foundTv);
      return foundTv;
    }
  });

  // console.log("Continue Watchings from getLikedData: ", continueWatchingArray);

  // // console.log(
  //   "Continuing wathcing array before: ",
  //   store.getState()?.continueWatching
  // );
  dispatch(addToContinueWatching(continueWatchingArray)); //ading to redux, adding the wole array and this wouldnt trigger to add to firebase
  // // console.log(
  //   "Continuing wathcing array after: ",
  //   store.getState()?.continueWatching
  // );
  setRefresh(true);
};

export const fData2 = async () => {
  // console.log("Entering shows");
  const showsLength = showsName.length;
  // console.log("Shows length: ", showsLength);
  const batchSize = 100; // Number of movies to fetch in each batch
  const batches = Math.ceil(showsLength / batchSize);
  let breakLoop = false;

  for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
    // // console.log("Batch Index for tv:", batchIndex); // Logging batch index
    const batchStart = batchIndex * batchSize;
    const batchEnd = Math.min((batchIndex + 1) * batchSize, showsLength);

    // // console.log("Batch Start for tv:", batchStart); // Logging batch start index
    // // console.log("Batch End for tv:", batchEnd); // Logging batch end index

    const fetchPromises = [];

    for (let i = batchStart; i < batchEnd; i++) {
      if (i < showsLength) {
        // // console.log("Fetching data for tvshows:", i); // Logging the movie index being fetched
        fetchPromises.push(fetchShowsDetails(showsName[i]));
        // // console.log("Fetching data for tvshows:", i); // Logging the movie index being fetched
      } else {
        // console.log("end shows");
        breakLoop = true;
        break;
      }
    }

    if (breakLoop) {
      // console.log("end shows");
      break;
    }

    await Promise.all(fetchPromises);
  }

  const uniqueTitlesMap = new Map();

  // Filter out duplicates based on the title attribute
  errorArray.forEach((item) => {
    const title = item.title;
    if (!uniqueTitlesMap.has(title)) {
      uniqueTitlesMap.set(title, true);
      uniqueErrorArray.push(item);
    }
  });
};

export const fetchShowsDetails = async (item) => {
  let title = item.title;

  for (const lang of languages) {
    if (title.startsWith(lang)) {
      title = title.substring(lang.length).trim();
    }
  }

  const modifiedName = title.replace(/ /g, "%20");
  const API_ENDPOINT = `https://api.themoviedb.org/3/search/tv?query=${modifiedName}&page=1&api_key=d159eaf1a8e9ef27976592ad48ed5a2a`;

  try {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();
    const result = data.results[0];
    item.id = result.id;
    // item.title = result.name;
    item.backdrop_path = result.backdrop_path;
    item.genreNames = result.genre_ids;
    item.overview = result.overview;
    item.poster_path = result.poster_path;
    item.release_date = result.first_air_date;
    item.vote_average = result.vote_average;
    item.vote_count = result.vote_count;
    item.number_of_seasons = result.number_of_seasons;
  } catch (error) {
    errorArray.push(item);
  }
};

export const fData3 = async () => {
  // // console.log("Entering shows");
  const showsLength = shows.length;
  // console.log("Shows length: ", showsLength);
  const batchSize = 300; // Number of movies to fetch in each batch
  const batches = Math.ceil(showsLength / batchSize);
  let breakLoop = false;

  for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
    // console.log("Batch Index for shows:", batchIndex); // Logging batch index
    const batchStart = batchIndex * batchSize;
    const batchEnd = Math.min((batchIndex + 1) * batchSize, showsLength);

    // console.log("Batch Start for shows:", batchStart); // Logging batch start index
    // console.log("Batch End for shows:", batchEnd); // Logging batch end index

    const fetchPromises = [];

    for (let i = batchStart; i < batchEnd; i++) {
      if (i < showsLength) {
        // // console.log("Fetching data for tvshows:", i); // Logging the movie index being fetched
        fetchPromises.push(fetchShowsEpisodes(shows[i]));
        // // console.log("Fetching data for tvshows:", i); // Logging the movie index being fetched
      } else {
        // console.log("end shows");
        breakLoop = true;
        break;
      }
    }

    if (breakLoop) {
      // console.log("end shows");
      break;
    }

    await Promise.all(fetchPromises);
  }
};

const fetchShowsEpisodes = async (item) => {
  const title = item.title;
  const seasonIndex = title?.indexOf("S");
  const season = title.substring(seasonIndex + 1, seasonIndex + 2);
  const episodeIndex = title?.indexOf("E");
  const episode = title.substring(episodeIndex + 1, episodeIndex + 2);
  const API_ENDPOINT = `https://api.themoviedb.org/3/tv/${item.id}/season/${season}/${episode}/1?&api_key=d159eaf1a8e9ef27976592ad48ed5a2a`;

  try {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();
    item.id = data.id;
    item.name = data.name;
    item.still_path = data.still_path;
    item.overview = data.overview;
    item.air_date = data.air_date;
    item.vote_average = data.vote_average;
    item.vote_count = data.vote_count;
    item.runtime = data.runtime;
  } catch (error) {
    errorArray.push(item);
  }
};

export const fetchOneShowsSeason = async (
  item,
  selectedSeason,
  setTotalSeasons
) => {
  console.log("Hello 1");
  const API_KEY = "d159eaf1a8e9ef27976592ad48ed5a2a";
  const API_ENDPOINT1 = `https://api.themoviedb.org/3/tv/${item.id}?&api_key=${API_KEY}`;

  console.log("item id from mvs: ", item.id);
  let number_of_seasons = null;
  let seasons = {};

  try {
    console.log("Hello 2");
    const response = await fetch(API_ENDPOINT1);
    const data = await response.json();
    number_of_seasons = data.number_of_seasons;
    console.log("Hello 3");
  } catch (error) {
    console.error("Error fetching show information:", error);
    console.log("Hello 4");
    return;
  }
  setTotalSeasons(number_of_seasons);
  console.log("total seasons: ", number_of_seasons);

  // Only fetch data for the selected season
  if (selectedSeason > 0 && selectedSeason <= number_of_seasons) {
    console.log("Hello 5");
    try {
      const API_ENDPOINT2 = `https://api.themoviedb.org/3/tv/${item.id}/season/${selectedSeason}?&api_key=${API_KEY}`;
      const response = await fetch(API_ENDPOINT2);
      const data = await response.json();
      seasons[selectedSeason] = data.episodes;

      // Add link and title information
      seasons[selectedSeason].forEach((episode, i) => {
        let seasonNo =
          selectedSeason < 10 ? `0${selectedSeason}` : selectedSeason;
        let episodenNo = i < 9 ? `0${i + 1}` : i + 1;
        const nn = `${item.title.toLowerCase()}s${seasonNo} e${episodenNo}`;
        let index2 = shows.findIndex((show) =>
          show.title.toLowerCase().includes(nn.toLowerCase())
        );
        episode.link = shows[index2]?.link;
        episode.title = shows[index2]?.title;
        console.log("Hello 6");
      });
    } catch (error) {
      console.error("Error fetching episode information:", error);
      errorArray.push(item);
      console.log("Hello 7");
    }
  }

  return seasons;
};
