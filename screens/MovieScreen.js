import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { movies } from "../api";

const screenWidth = Dimensions.get("window").width;

function MovieScreen({ route, navigation }) {
  const { item } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B" }}>
      <View style={{ flex: 0.55 }}>
        <View style={{ flex: 0.6, flexDirection: "row" }}>
          <View style={{ flex: 0.5, paddingLeft: 10 }}>
            <Image
              style={styles.image}
              source={{
                uri: `https://image.tmdb.org/t/p/original/${item?.poster_path}`,
              }}
            />
          </View>
          <View style={{ flex: 0.5, top: 55, left: 10 }}>
            <View style={styles.inlineContainer}>
              <Text style={styles.text}>Title: </Text>
              <Text style={[styles.text2]}>{item?.title}</Text>
            </View>
            <View style={styles.inlineContainer}>
              <Text style={styles.text}>Release: </Text>
              <Text style={styles.text2}>{item?.release_date}</Text>
            </View>
            <View style={styles.inlineContainer}>
              <Text style={styles.text}>Runtime: </Text>
              <Text style={styles.text2}>{item?.runtime} mins</Text>
            </View>
            <View style={styles.inlineContainer}>
              <Text style={styles.text}>Genre: </Text>
              <Text style={styles.text2}>
                {item?.genreNames?.slice(0, 2).join(", ")}
              </Text>
              <Text style={styles.text2}></Text>
            </View>
            <View style={styles.inlineContainer}>
              <Text style={styles.text}>Rating: </Text>
              <Text style={styles.text2}>
                {item?.vote_average + "(" + item?.vote_count + ")"}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 0.4 }}>
          <View style={styles.inlineContainer}>
            <Text
              style={{
                fontSize: 15,
                color: "white",
                fontWeight: "bold",
                top: 60,
              }}
            >
              Overivew:
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "white",
                top: 60,
              }}
            >
              {"    " + item?.overview?.slice(0, screenWidth - 340)}
            </Text>
          </View>
          <Text style={styles.text3}>
            {item?.overview?.slice(screenWidth - 340)}
          </Text>
        </View>
      </View>

      <View style={{ flex: 0.45 }}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("VideoScreen", { item })}
        >
          <Text style={styles.text}>Play</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    top: 50,
    resizeMode: "contain",
    height: "100%", // Occupies the full height of its parent
    width: "100%", // Occupies the full width of its parent
  },
  text: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  text2: {
    fontSize: 15,
    color: "white",
    maxWidth: screenWidth - 260,
  },
  text3: {
    fontSize: 15,
    color: "white",
    top: 30,
    left: 1,
    right: 1,
    maxWidth: screenWidth - 50,
  },
  inlineContainer: {
    flexDirection: "row",
    marginBottom: 30, // Add some space between the lines
  },
  btn: {
    top: "40%",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 3,
    height: 40,
    width: 150,
  },
});

export default MovieScreen;
