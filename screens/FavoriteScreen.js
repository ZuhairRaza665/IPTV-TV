import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import MovieCard from "../MovieCard";
import { db } from "../firebase"; // Import the Firebase initialization
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { addLikedItem } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";

const FavoriteScreen = ({ navigation }) => {
  const [likedItems, setLikedItems] = useState([]);
  const dispatch = useDispatch();

  const getLatestLike = async () => {
    const userId3 = await AsyncStorage.getItem("userToken");
    if (userId3) {
      const userDocRef = doc(db, "users", userId3);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        // console.log("user Liked: ", userData.liked);
        setLikedItems(userData.liked);

        for (leti = 0; i < likedItems.length; i++) {
          dispatch(addLikedItem(likedItems[i]));
        }
      }
    }
  };

  useEffect(() => {
    getLatestLike();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favorites</Text>
      <MovieCard
        navigation={navigation} // Pass your navigation here if needed
        direction="vertical"
        numOfColmb={2} // Corrected prop name
        bigData={likedItems}
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
  text: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    paddingLeft: "5%",
  },
});

const mapStateToProps = (state) => ({
  likedItems: state.likedItems,
});

export default connect(mapStateToProps)(FavoriteScreen);
