import React, { useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import Video from "react-native-video";

const VideoScreen = ({ route }) => {
  const { item } = route.params;
  const videoLink = item.link;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("link from video: ", videoLink);

  const onBuffer = () => {
    // Show loading indicator when video is buffering
    setIsLoading(true);
  };

  const videoError = (error) => {
    // Handle video error by displaying an error message
    setError("An error occurred while loading the video.");
    setIsLoading(false);
    console.error("Video error occurred:", error);
  };

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoLink }}
        ref={(ref) => {
          // Store reference
          this.player = ref;
        }}
        onBuffer={onBuffer}
        onError={videoError}
        style={styles.backgroundVideo}
        onLoad={() => setIsLoading(false)} // Hide loading indicator when video is loaded
      />
      {isLoading && (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  indicatorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

export default VideoScreen;
