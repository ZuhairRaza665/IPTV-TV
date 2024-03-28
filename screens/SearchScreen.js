import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Switch,
  Text,
  Keyboard,
  Dimensions,
  VirtualizedList,
} from "react-native";
import MovieCard from "../MovieCard";
import { movies, showsName } from "../api";
import SwitchButton from "../SwitchButton";
import {
  errorArray,
  fetchMovieData,
  fetchShowsDetails,
} from "../MovieDetailsRequest";
import { movieIndexesWithPath, showIndexesWithPath } from "./HomeScreen";

const generateRandomIndexes = (maxIndex, count) => {
  const indexes = [];
  while (indexes.length < count) {
    const randomIndex = Math.floor(Math.random() * maxIndex);
    if (!indexes.includes(randomIndex)) {
      indexes.push(randomIndex);
    }
  }
  return indexes;
};

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const temp = [];

  const fMovies = async (movie) => {
    await fetchMovieData(movie);
  };

  const fShows = async (show) => {
    await fetchShowsDetails(show);
  };

  useEffect(() => {
    if (searchText.length === 0) {
      console.log("Movies indexes from search: ", movieIndexesWithPath);
      console.log("Shows indexes from search: ", showIndexesWithPath);

      const indexesWithPath =
        selectedIndex === 0 ? movieIndexesWithPath : showIndexesWithPath;
      const sourceArray = selectedIndex === 0 ? movies : showsName;

      for (let i = 0; i < indexesWithPath.length; i++) {
        temp.push(sourceArray[indexesWithPath[i]]);
      }

      setSearchResults(temp);
    }
  }, [selectedIndex, searchText]);

  useEffect(() => {
    setSearchText("");
  }, [selectedIndex]);

  const handleSearch = async () => {
    try {
      // console.log("Entring fill state");
      // Code for filtering based on search text and selectedIndex
      let filteredResults = [];
      if (selectedIndex === 0) {
        filteredResults = movies.filter((result) =>
          result.title.toLowerCase().includes(` ${searchText.toLowerCase()}`)
        );

        // console.log("length is: ", filteredResults.length);
        const promises = filteredResults.slice(0, 10).map(async (result) => {
          await fMovies(result);
        });

        await Promise.all(promises);

        // console.log("Movies");
      } else {
        // console.log("searching on shows: ");

        filteredResults = showsName.filter((result) =>
          result.title.toLowerCase().includes(` ${searchText.toLowerCase()}`)
        );
        // console.log("TV");

        const promises = filteredResults.slice(0, 10).map(async (result) => {
          await fShows(result);
        });

        await Promise.all(promises);
      }

      // // console.log("Filtered result is: ", filteredResults);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error fetching data 2:", error);
      setSearchResults([]);
    }
    // // console.log("Seardch length: ", searchResults.length);
  };

  const handleSearchSubmit = () => {
    // Close the keyboard
    Keyboard.dismiss();
    // Trigger the search
    handleSearch();
  };

  const renderItem = ({ item }) => (
    <MovieCard navigation={navigation} item={item} />
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search..."
        placeholderTextColor={"white"}
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        style={styles.text}
        onSubmitEditing={handleSearchSubmit}
        // autoCorrect={false}
      />

      <SwitchButton setSelectedIndex={setSelectedIndex} />

      <View style={{ top: searchResults.length < 3 ? -100 : 23 }}>
        <MovieCard
          navigation={navigation}
          direction="vertical"
          numOfColmb={Math.floor(Dimensions.get("window").width / 165)}
          bigData={searchResults?.slice(0, 10)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "20%",
    paddingBottom: "24%",
    backgroundColor: "#0B0B0B",
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
});

export default SearchScreen;
