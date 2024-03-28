import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";
import LoadingAnimation from "../assets/loading.json";
import DoneAnimation from "../assets/animation_lkylf2yt.json";
import ErrorAnimation from "../assets/error.json";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { fetchData, movies, showsName, shows, tv } from "../api";
import {
  fData,
  getLikedData,
  getContinueWatchingData,
  fData2,
  fData3,
  fetchOneShowsSeason,
} from "../MovieDetailsRequest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { resetFlag, setResetFlag } from "./SignoutScreen";
import { useSelector, useDispatch } from "react-redux";
import { addLikedItem } from "../redux/actions";

import { auth, db } from "../firebase"; // Import the Firebase initialization
import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { store } from "../redux/store";
import { errorArray, uniqueErrorArray } from "../MovieDetailsRequest";

import { retrieveLargeData } from "../api";

export let loginStatus = "false";

const LoginScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingAnimation, setloadingAnimation] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading");
  const [DoneAnimationCompleted, setDoneAnimationCompleted] = useState(false);
  const [shouldResetAnimations, setShouldResetAnimations] = useState(false); // Add this state
  const [apiData, setApiData] = useState([]);
  const [textInputValue, setTextInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const likedItems = useSelector((state) => state.likedItems);
  const translateY = useSharedValue(0); // Initial position
  const [userId, setUserId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [focusedButton, setFocusedButton] = useState(null);
  const inputRef = useRef(null);

  const handleButtonFocus = (name) => {
    setFocusedButton(name);
  };

  const focusTextInput = () => {
    inputRef.current.focus();
  };

  const autoLogin = () => {
    // Simulate a button press by calling the LoginBtnHandle function
    // const data = retrieveLargeData();

    // if (data.length > 0) {
    //   // console.log("retrieveLargeData: ", data.slice(0, 100));
    // }
    LoginBtnHandle(true);
  };

  const checkLogin = async () => {
    const data = await AsyncStorage.getItem("loginStatus");
    loginStatus = JSON.parse(data);
  };

  useEffect(() => {
    checkLogin();

    // Call the autoLogin function when the component mounts (app reloads)
    if (loginStatus === "true") autoLogin();
  }, []);

  useEffect(() => {
    // console.log("login status from useeffect: ", loginStatus);
    if (loginStatus === "true") autoLogin();
  }, [loginStatus]);

  useEffect(() => {
    // // console.log("Liked array getting updated");
    setRefresh(true);
  }, [refresh]);

  const signInUser = async (username, password) => {
    try {
      await signInWithEmailAndPassword(
        auth,
        `${username}@yourdomainname.com`,
        `${password}`
      );
      // console.log("signing in");
      return auth.currentUser.uid;
    } catch (loginError) {
      return null;
    }
  };

  const createUserAndSignIn = async (username, password) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        `${username}@yourdomainname.com`,
        `${password}`
      );
      // console.log("signing up");
      return userCredentials.user.uid;
    } catch (createUserError) {
      return null;
    }
  };

  const handleLogin = async (isAuto) => {
    if (isAuto) {
      // Auto-login logic
      const userId3 = await AsyncStorage.getItem("userToken");
      if (userId3) {
        setUserId(userId3);
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          await getLikedData(userData.liked || [], dispatch, setRefresh);
          await getContinueWatchingData(
            userData["Continue Watching"] || [],
            dispatch,
            setRefresh
          );
        }
      }
    } else {
      const usernameIndex = textInputValue?.indexOf("username=") + 9;
      const passwordIndex = textInputValue?.indexOf("password=") + 9;
      const passwordEndIndex = textInputValue?.indexOf("&", passwordIndex);
      const username = textInputValue.substring(
        usernameIndex,
        textInputValue?.indexOf("&", usernameIndex)
      );
      const password = textInputValue.substring(
        passwordIndex,
        passwordEndIndex !== -1 ? passwordEndIndex : undefined
      );

      const userId2 =
        (await signInUser(username, password)) ||
        (await createUserAndSignIn(username, password));

      if (userId2) {
        AsyncStorage.setItem("userToken", userId2);
        setUserId(userId2);
        const userDocRef = doc(db, "users", userId2);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          await getLikedData(userData.liked || [], dispatch, setRefresh);
          await getContinueWatchingData(
            userData["Continue Watching"] || [],
            dispatch,
            setRefresh
          );
        }
      }
    }
  };

  const fetchDataAndProcess = async () => {
    try {
      console.log("textInputValue:", textInputValue);

      const data = await fetchData(
        "http://5giptv.me:8880/get.php?username=zuhair1210&password=103444873&type=m3u&output=ts"
      );
      setApiData(data);

      if (data.length <= 0) {
        setErrorMessage("Please enter a valid link.");
        setloadingAnimation(false);
        return; // Exit the function
      }

      console.log("API DATA: ", data.slice(0, 10));

      // const storedData = await AsyncStorage.getItem("movies");

      // if (storedData) {
      //   // // console.log("Fetching data from local storage movies array");
      //   // // console.log("Movies length before:  ", movies.length);
      //   // // console.log("movies stored data: ", movies[100]);
      //   // // console.log("Show name stored data: ", showsName[100]);
      //   const parsedStoredData = JSON.parse(storedData);

      //   parsedStoredData.forEach((storedItem, index) => {
      //     movies[index] = storedItem;
      //   });

      //   // // console.log("demo stored data: ", parsedStoredData[2131]);
      //   // // console.log("movies chached stored data: ", movies[2131]);
      //   // // console.log("Movies length after:  ", movies.length);
      // } else {
      //   // console.log("movies 0th index: ", movies[0]);
      //   if (movies[0] != null) {
      //     // // console.log("Logging movies 0 from login screen: ", movies[0]);
      //     await fData();
      //     // // console.log("Movie 1: ", movies[movies.length]);
      //     // // console.log("Movie 2: ", movies[movies.length - 1]);
      //     // // console.log("Movie 3: ", movies[movies.length - 50]);

      //     try {
      //       await AsyncStorage.setItem("movies", JSON.stringify(movies));
      //       // // console.log("movies array stored in AsyncStorage");
      //     } catch (error) {
      //       console.error("Error storing movies array:", error);
      //     }
      //   } else {
      //     // console.log("API not working 1");
      //   }
      // }

      // const storedData2 = await AsyncStorage.getItem("showsName");
      // let showNameAsync = [];

      // if (storedData2) {
      //   // // console.log("Fetching data from local storage local shownName array");
      //   // // console.log("showsName length before:  ", showsName.length);
      //   // // console.log("showsName stored data: ", showsName[100]);
      //   // // console.log("Show name stored data: ", showsName[100]);
      //   const parsedStoredData = JSON.parse(storedData2);
      //   showNameAsync = parsedStoredData;

      //   parsedStoredData.forEach((storedItem, index) => {
      //     showsName[index] = storedItem;
      //   });

      //   // // console.log("demo stored data: ", parsedStoredData[2131]);
      //   // // console.log("showsName chached stored data: ", showsName[2131]);
      //   // // console.log("showsName length after:  ", showsName.length);
      // } else {
      //   if (showsName[0] != null) {
      //     // // console.log("Logging showsName 0 from login screen: ", showsName[0]);
      //     await fData2();
      //     // // console.log("showsName 1: ", showsName[showsName.length]);
      //     // // console.log("showsName 2: ", showsName[showsName.length - 1]);
      //     // // console.log("showsName 3: ", showsName[showsName.length - 50]);

      //     try {
      //       await AsyncStorage.setItem("showsName", JSON.stringify(showsName));
      //       // // console.log("showsName array stored in AsyncStorage");
      //     } catch (error) {
      //       console.error("Error storing showsName array:", error);
      //     }
      //   } else {
      //     // console.log("API not working 2");
      //   }
      // }

      if (auth.currentUser) {
        // // console.log("Entering uid ");
        const userId = auth.currentUser.uid;
        // // console.log("Logggin from login screen the userid: ", userId);

        if (userId) {
          // Reference to the user's document
          const userDocRef = doc(db, "users", userId);

          // Get the user's document data
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const likedList = userData.liked || []; // getting liked list from firebase

            if (userId) {
              await getLikedData(likedList, dispatch, setRefresh);
            }
            // // console.log("User's liked list from sign in:", likedList);
            // // console.log("Updated Redux state:", store.getState().likedItems); // Log the updated state
          } else {
            // // console.log("User document not found:", userId);
          }
        } else {
          // console.log("The user doesnt exist");
        }
      }
      // // console.log("errorArray: ", errorArray.length);
      // // console.log("uniqueErrorArray: ", uniqueErrorArray.length);

      const index = showsName.findIndex((show) =>
        show.title.toLowerCase().includes("silicon valley")
      );

      let avf = {};
      const gettingData = async () => {
        const abc = await fetchOneShowsSeason(showsName[index]);
        // console.log("abc: ", abc);
        avf = abc;
      };
      gettingData();

      // // console.log("avf: ", avf);
      // // // console.log("Season 1 Episode 1: ", showsData);
      // // // console.log("Season 6 Episode 4: ", showsData[6][4]);

      await AsyncStorage.setItem("loginStatus", JSON.stringify("true"));

      // const fetchData55 = async (dataType) => {
      //   const retrievedData = await retrieveLargeData(dataType);

      //   switch (dataType) {
      //     case "movies":
      //       movies = [...retrievedData];
      //       break;
      //     case "tv":
      //       tv = [...retrievedData];
      //       break;
      //     case "shows":
      //       shows = [...retrievedData];
      //       break;
      //     case "showsName":
      //       showsName = [...retrievedData];
      //       break;
      //     default:
      //       break;
      //   }
      // };

      // await fetchData55("movies");
      // await fetchData55("tv");
      // await fetchData55("shows");
      // await fetchData55("showsName");

      // // console.log("Movie 1 from login: ", movies[1]);
      // // console.log("showsName 1 from login: ", showsName[1]);

      const searchLink = "/series/zuhair1210/103444873/529697.mkv";

      const foundMovie = shows.find((movie) => movie.link.includes(searchLink));

      if (foundMovie) {
        console.log("Found Movie:", foundMovie);
      } else {
        console.log("Movie not found.");
      }

      setloadingAnimation(false);
    } catch (error) {
      console.error("Error fetching or processing data:", error);
    }
  };

  const moveUp = () => {
    translateY.value = withTiming(-50, {
      duration: 500,
      easing: Easing.linear,
    }); // how much will the done logo go up and in how much time

    setTimeout(() => {
      handleDoneAnimationComplete();
    }, 500); // when will done button appear
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleDoneAnimationComplete = () => {
    setDoneAnimationCompleted(true);
    setShouldResetAnimations(true); // Set the flag to reset animations
  };

  const toggleModal = () => {
    setModalVisible(false); // Hide the modal

    if (apiData.length > 0) {
      console.log("Greater than 0");
      navigation.navigate("Container");
    } else {
      console.log("Less than 0");
      setShouldResetAnimations(false);
      setloadingAnimation(true);
      setDoneAnimationCompleted(false);
      translateY.value = 0; // Reset translateY
      setLoadingText("Loading");
      setResetFlag(false);
    }
  };
  const LoginBtnHandle = (isAuto) => {
    if (isAuto) {
      // console.log("Entering isAuto");
      setModalVisible(!isModalVisible);
      fetchDataAndProcess();
    } else {
      console.log("textinput: ", textInputValue);
      if (textInputValue.length > 0) {
        setModalVisible(!isModalVisible);
        fetchDataAndProcess();
      } else {
        setErrorMessage("Please enter a valid link.");
      }
    }
  };

  useEffect(() => {
    if (textInputValue.length > 0) {
      // console.log("textInputValue length > 0");
      handleLogin(false);
      // // console.log("data: ", apiData[0]);
    } else {
      handleLogin(true);
    }
  }, [apiData]);

  useEffect(() => {
    if (resetFlag) {
      setShouldResetAnimations(false);
      setloadingAnimation(true);
      setDoneAnimationCompleted(false);
      translateY.value = 0; // Reset translateY
      setLoadingText("Loading");
      setResetFlag(false);
    }
  }, [resetFlag]);

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingText((prevText) => {
        if (prevText === "Loading....") {
          return "Loading";
        } else {
          return prevText + ".";
        }
      });
    }, 500); // Change text every 500ms

    return () => {
      clearInterval(loadingInterval); // Clean up the interval on component unmount
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
      {errorMessage.length > 0 && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <TouchableWithoutFeedback
        onPress={focusTextInput}
        onFocus={() => handleButtonFocus("1")}
      >
        <View>
          <TextInput
            style={[styles.input, focusedButton === "1" && styles.focused]}
            ref={inputRef}
            placeholder="https://example.com"
            placeholderTextColor="white"
            autoCapitalize="none"
            onChangeText={(text) => {
              setTextInputValue(text);
              setErrorMessage("");
            }}
          />
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity
        style={[styles.button, focusedButton === "2" && styles.focused]}
        onPress={() => LoginBtnHandle(false)}
        onFocus={() => handleButtonFocus("2")}
        activeOpacity={1}
      >
        <Text style={styles.text3}>Login</Text>
      </TouchableOpacity>
      <Modal
        isVisible={isModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loadingAnimation ? (
              <View style={styles.activityIndicatorContainer}>
                <Text style={styles.text2}>{loadingText}</Text>
                <LottieView
                  source={LoadingAnimation}
                  autoPlay
                  loop
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            ) : (
              <View style={styles.modalContainer2}>
                <Animated.View style={animatedStyle}>
                  <LottieView
                    source={apiData.length > 0 ? DoneAnimation : ErrorAnimation}
                    autoPlay
                    style={[
                      apiData.length > 0
                        ? styles.doneAnimation
                        : styles.errorAnimation,
                    ]}
                    onAnimationFinish={moveUp}
                  />
                </Animated.View>
                {/* {DoneAnimationCompleted && ( */}
                <TouchableOpacity
                  style={[
                    apiData.length > 0 ? styles.doneBtn : styles.doneBtn2,
                  ]}
                  onPress={() => toggleModal()}
                >
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
                {/* )} */}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // Align the modal content at the bottom
    bottom: 10,
    borderBottomEndRadius: 200,
  },
  modalContainer2: {
    flex: 1,
    backgroundColor: "#212020",
  },
  modalContent: {
    backgroundColor: "#212020",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10, // Add this line to keep the bottom corners straight
    borderBottomRightRadius: 10, // Add this line to keep the bottom corner
    height: 300,
  },
  text: {
    color: "white",
    fontSize: 50,
    fontWeight: "bold",
    alignItems: "center",
    alignSelf: "center",
  },
  text2: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    alignItems: "center",
    alignSelf: "center",
    top: 30,
  },
  text3: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    alignSelf: "center",
  },
  doneBtnText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    alignItems: "center",
    alignSelf: "center",
  },
  input: {
    fontSize: 18,
    height: 40,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
    padding: 10,
    color: "white",
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: 2,
    marginTop: 60,
  },
  button: {
    height: 45,
    width: 100,
    borderColor: "white",
    color: "white",
    borderWidth: 2,
    fontSize: 18,
    textAlign: "center",
    alignSelf: "center",
    padding: 8,
    marginTop: 60,
  },
  doneBtn: {
    height: 50,
    textAlign: "center",
    alignSelf: "center",
    bottom: 60,
  },
  doneBtn2: {
    height: 50,
    textAlign: "center",
    alignSelf: "center",
    top: 100,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  doneAnimation: {
    width: "100%",
    height: "100%",
  },
  errorAnimation: {
    width: 100,
    height: 100,
    alignSelf: "center",
    right: "17%",
    top: 40,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    alignSelf: "center",
    marginTop: 10,
  },
  focused: {
    borderWidth: 4,
  },
});

export default LoginScreen;
