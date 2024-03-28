import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VideoScreen from "./screens/VideoScreen";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import Container from "./Container";
import { Platform } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import DrawerScreen from "./Container";
import MovieScreen from "./screens/MovieScreen";
import ShowsScreen from "./screens/ShowsScreen";
import { currentUserID } from "./screens/LoginScreen";
import MovieCard from "./MovieCard";
// import { fetchMovies, fetchTV } from "./MovieDB";
import ShowMoreScreen from "./screens/ShowMoreScreen";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage from the correct package

const Stack = createNativeStackNavigator();

function App() {
  const os = Platform.OS;

  // async function deleteMovies(key) {
  //   try {
  //     await AsyncStorage.removeItem(key);
  //     // console.log("Movies data deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting movies data", error);
  //   }
  // }

  // useEffect(() => {
  //   deleteMovies("cachedData");
  //   deleteMovies("movies");
  //   // console.log("deleted async");
  // }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{ headerShown: false, gestureEnabled: false }}
            name="Container"
            component={Container}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="MovieScreen"
            component={MovieScreen}
          />

          <Stack.Screen
            name="DrawerScreen"
            options={{ headerShown: false }}
            component={DrawerScreen} // Pass the component directly
          />
          <Stack.Screen
            name="VideoScreen"
            options={{ headerShown: false }}
            component={VideoScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="ShowsScreen"
            component={ShowsScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="ShowMore"
            component={ShowMoreScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
