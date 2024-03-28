import React, { useEffect } from "react";
import { View, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage from the correct package

export let resetFlag = false;

export const setResetFlag = (value) => {
  resetFlag = value;
};

const SignOutScreen = ({ navigation }) => {
  async function deleteAsync(key) {
    try {
      await AsyncStorage.removeItem(key);
      // console.log(`${key} data deleted successfully`);
    } catch (error) {
      console.error("Error deleting movies data", error);
    }
  }

  useEffect(() => {
    deleteAsync("cachedData");
    deleteAsync("movies");
    deleteAsync("showsName");
    deleteAsync("userToken");
    deleteAsync("loginStatus");

    // console.log("deleted aysnc");

    Alert.alert("Signing Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => navigation.goBack(), // Go back or navigate to a different screen
      },
      {
        text: "Sign Out",
        onPress: () => {
          // Add your sign-out logic here
          // For example, clear authentication tokens or user data
          resetFlag = true;
          navigation.navigate("Login"); // Navigate to the login screen
        },
      },
    ]);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <View style={styles.container}>
      {/* Add any additional content you want */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B", // Background color
  },
});

export default SignOutScreen;
