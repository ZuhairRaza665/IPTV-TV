import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
// import { fetchMovies } from "../MovieDB";

const TVScreen = ({ navigation }) => {
  const handleOnPress = (item) => {
    const link = item.link || null;
    // console.log("item: ", link);
    navigation.navigate("VideoScreen", { link });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.container2}
      onPress={() => handleOnPress(item)}
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const [movies, setMovies] = useState([]);

  return (
    <View style={styles.container}>
      {movies.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id?.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "20%",
    backgroundColor: "#0B0B0B",
  },
  container2: {
    margin: 10,
    backgroundColor: "#212020",
    height: 40,
    width: "100%",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
    color: "white",
    textAlign: "center",
  },
});

export default TVScreen;
