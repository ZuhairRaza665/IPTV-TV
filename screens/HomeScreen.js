import MovieSlider from "../MovieSlider";
import MovieCard from "../MovieCard";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { movies, showsName } from "../api";
import { store } from "../redux/store";
import { fetchMovieData, fetchShowsDetails } from "../MovieDetailsRequest";

export let movieIndexesWithPath = [];
export let showIndexesWithPath = [];

const HomeScreen = ({ navigation }) => {
  const [random, setRandomMovie] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const fMovies = async (movie) => {
    await fetchMovieData(movie);
  };

  const fShows = async (show) => {
    await fetchShowsDetails(show);
  };

  useEffect(() => {
    const getRandomIndexes = (length, count) => {
      const indexes = [];
      while (indexes.length < count) {
        const randomIndex = Math.floor(Math.random() * length);
        if (!indexes.includes(randomIndex)) {
          indexes.push(randomIndex);
        }
      }
      return indexes;
    };

    const fetchData = async () => {
      let fetchedItems = [];
      let moviesCount = 0; // Track total fetched movies
      let showsCount = 0; // Track total fetched shows

      do {
        const remainingMoviesCount = 10 - moviesCount; // Calculate remaining movies to fetch
        const remainingShowsCount = 10 - showsCount; // Calculate remaining shows to fetch

        const randomIndexesForMovies = getRandomIndexes(
          movies.length,
          remainingMoviesCount
        );
        const randomIndexesForShows = getRandomIndexes(
          showsName.length,
          remainingShowsCount
        );

        // Fetch movies
        await Promise.all(
          randomIndexesForMovies.map(async (index) => {
            const movie = movies[index];
            await fMovies(movie);
            if (movie.poster_path && movie.backdrop_path && moviesCount < 10) {
              movies[index] = movie;
              fetchedItems.push(movie);
              movieIndexesWithPath.push(index);
              moviesCount++;
            }
          })
        );

        // Fetch shows
        await Promise.all(
          randomIndexesForShows.map(async (index) => {
            const show = showsName[index];
            await fShows(show);
            if (show.poster_path && show.backdrop_path && showsCount < 10) {
              showsName[index] = show;
              fetchedItems.push(show);
              showIndexesWithPath.push(index);
              showsCount++;
            }
          })
        );

        console.log("Number of fetched items with paths:", fetchedItems.length);
      } while (
        fetchedItems.length < 20 &&
        (moviesCount < 10 || showsCount < 10)
      );

      console.log("First item in fetched items:", fetchedItems[0]); // Log the first item in fetched items
      setRandomMovie(fetchedItems);
      setLikedItems(store.getState().likedItems);
      setContinueWatching(store.getState().continueWatching[0]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // console.log("Movie 1 from home: ", movies[1]);
    // console.log("showsName 1 from home: ", showsName[1]);
    setContinueWatching(store.getState().continueWatching[0]);
    // // console.log("The continue movie is getting updated: ", continueWatching[0]);
  });

  // useEffect(() => {
  //    console.log(
  //     "Continuing wathcing array 1: ",
  //     store.getState()?.continueWatching[0]
  //   );
  //   // console.log(
  //     "Continuing wathcing array 2: ",
  //     store.getState()?.continueWatching[0][0]
  //   );
  // });

  return continueWatching?.length > 0 ? (
    <ScrollView style={styles.container}>
      <View style={{ top: 40 }}>
        <MovieSlider moviesData={random} />
      </View>

      <Text
        style={{ color: "white", fontSize: 30, fontWeight: "bold", top: 55 }}
      >
        Continue Watching
      </Text>
      <View style={{ marginTop: 45, paddingLeft: 10 }}>
        <MovieCard
          navigation={navigation}
          direction={null}
          bigData={continueWatching}
          isContinueWatching={true}
        />
      </View>
      <View style={{ top: 7 }}>
        <Text
          style={{ color: "white", fontSize: 30, fontWeight: "bold", top: 40 }}
        >
          Explore
        </Text>
      </View>
      <View style={{ marginTop: 35, paddingLeft: 10 }}>
        <MovieCard navigation={navigation} direction={null} bigData={random} />
      </View>
      <View style={{ marginTop: 60 }}></View>
    </ScrollView>
  ) : (
    <View style={styles.container}>
      <View style={{ flex: 0.6 }}>
        <MovieSlider moviesData={random} />
      </View>
      <View style={{ flex: 0.4 }}>
        <Text
          style={{
            color: "white",
            fontSize: 30,
            fontWeight: "bold",
            top: "5%",
          }}
        >
          Explore
        </Text>
        <View style={{ top: "3%" }}>
          <MovieCard
            navigation={navigation}
            direction={null}
            bigData={random}
          />
        </View>
        <View style={{ marginTop: 80 }}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
  },
  text: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default HomeScreen;
