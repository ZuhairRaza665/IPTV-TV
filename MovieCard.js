import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { addLikedItem, removeLikedItem } from "./redux/actions";
import { movies, showsName } from "./api";
import LottieView from "lottie-react-native"; // Import LottieView
import { auth, db } from "./firebase"; // Import the Firebase initialization
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore"; // Import Firestore functions

const MovieCard = ({
  navigation,
  bigData,
  direction,
  numOfColmb,
  top,
  likedItems,
  addLikedItem,
  removeLikedItem,
  isContinueWatching,
}) => {
  const handleLongPress = (item) => {
    const isItemLiked = likedItems.some(
      (likedItem) => likedItem?.title === item?.title
    );

    if (isItemLiked) {
      removeLikedItem(item);
    } else {
      addLikedItem(item);
    }
  };

  // useEffect(() => {
  //   // console.log("Movies Card 1st index: ", bigData[0]);
  // }, []);

  const getTime = async (title) => {
    const userID = auth.currentUser.uid.toString();

    try {
      const userDocRef = doc(db, "users", userID);

      // Get the current data of the user document
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const continueWatchingArray = userData["Continue Watching"];

        let exist = false;
        let itemIndex = -1;

        userData["Continue Watching"].map((existingItem, index) => {
          if (existingItem.title === title) {
            exist = true;
            itemIndex = index;
          }
        });

        // console.log("Index is: ", itemIndex);

        if (exist) {
          let oldTime = userData["Continue Watching"][itemIndex].time;
          // console.log("time from old time: ", oldTime);
          return oldTime;
        }
      }
    } catch (error) {
      console.error("Error updating liked array:", error);
    }
  };

  const handleOnPress = async (item) => {
    if (isContinueWatching) {
      try {
        const time = await getTime(item.title);
        if (time) {
          // console.log("Time 123: ", time);
          navigation.navigate("VideoScreen", { item, time });
        } else {
          let time2 = 0;
          // console.log("Time 123: ", time);
          navigation.navigate("VideoScreen", { item, time2 });
        }
      } catch (error) {
        // console.error("Error getting time:", error);
      }
    } else {
      const matchingMovie = movies.find((movie) => movie.title === item.title);

      if (matchingMovie) {
        // // console.log("entering movies: ");
        navigation.navigate("MovieScreen", { item });
      } else {
        // // console.log("entering showsnam: ");
        console.log("item is: ", item);
        navigation.navigate("ShowsScreen", { item, navigation });
      }
    }
  };

  const renderItem = ({ item }) => {
    const isItemLiked = likedItems.some(
      (likedItem) => likedItem?.title === item?.title
    );

    return (
      <TouchableWithoutFeedback
        onLongPress={() => handleLongPress(item)}
        onPress={() => handleOnPress(item)}
      >
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={
              item?.poster_path
                ? {
                    uri: `https://image.tmdb.org/t/p/original/${item?.poster_path}`,
                  }
                : {
                    uri: "data:image/png;base64,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",
                  }
            }
          />
          {isItemLiked && (
            <View style={styles.heartIconContainer}>
              <Icon name="heart" size={20} color="red" />
            </View>
          )}
          <View style={styles.container2}>
            <Text style={styles.titleSty}>{item?.title}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderSeeMoreButton = () => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ShowMore", { bigData, navigation })}
        style={styles.seeMoreButton}
      >
        <View style={[styles.logoContainer, { backgroundColor: "black" }]}>
          <View style={styles.lottieContainer}>
            <LottieView
              source={require("./assets/odJn8M18m0 (3).json")} // Replace with the correct path
              autoPlay
              loop
              style={styles.lottieAnimation} // Apply other Lottie animation styles if needed
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  if (direction === "vertical") {
    return (
      <FlatList
        data={bigData}
        renderItem={renderItem}
        keyExtractor={(item) => item?.title}
        numColumns={numOfColmb}
      />
    );
  }

  return (
    <FlatList
      data={bigData?.length > 10 ? bigData?.slice(0, 10) : bigData}
      renderItem={renderItem}
      keyExtractor={(item) => item?.title}
      horizontal={true}
      ListFooterComponent={renderSeeMoreButton}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: 350,
    width: 165,
    backgroundColor: "#212020",
    margin: 11,
    borderRadius: 15,
    top: 10,
  },
  container2: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    height: "80%",
    borderRadius: 5,
  },
  titleSty: {
    fontSize: 15,
    color: "white",
    fontWeight: "900",
    textAlign: "center",
  },
  heartIconContainer: {
    position: "absolute",
    top: 10,
    right: "10%",
  },
  lottieContainer: {
    top: 150,
    right: 15,
    width: 100,
    height: 100,
    backgroundColor: "black", // Apply black background color to the container
    alignItems: "center",
    justifyContent: "center",
  },
  lottieAnimation: {
    width: 80,
    height: 80,
  },
  seeMoreButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 40,
    alignSelf: "center",
    marginTop: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    likedItems: state.likedItems,
  };
};

const mapDispatchToProps = {
  addLikedItem,
  removeLikedItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(MovieCard);
