import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MovieCard from "../MovieCard";

const ShowMoreScreen = ({ route, navigation }) => {
  const { bigData } = route.params;

  return (
    <View style={styles.container}>
      <MovieCard
        navigation={navigation} // Pass your navigation here if needed
        direction="vertical"
        numOfColmb={2} // Corrected prop name
        bigData={bigData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "20%",
    backgroundColor: "#0B0B0B",
  },
});

export default ShowMoreScreen;
