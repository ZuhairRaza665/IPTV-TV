import { auth, db } from "./firebase"; // Import the Firebase initialization
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore"; // Import Firestore functions
import { store } from "./redux/store";
import { updateContinueWatchingInRedux } from "./redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const updateUserLikedArray = async (itemTitle, action) => {
  // console.log("Entering liked array");

  const userID = await AsyncStorage.getItem("userToken");

  try {
    const userDocRef = doc(db, "users", userID);

    // Get the current data of the user document
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();

      if (action === "add") {
        // Update the 'liked' array with the new value
        // console.log("adding");
        const newLikedArray = [...userData.liked, itemTitle];
        await updateDoc(userDocRef, { liked: newLikedArray });
      } else if (action === "remove") {
        const newLikedArray = userData.liked.filter(
          (item) => item !== itemTitle
        );
        await updateDoc(userDocRef, { liked: newLikedArray });
      }

      // console.log("Liked array updated for user:", userID);
    } else {
      // console.log("User document not found:", userID);
    }
  } catch (error) {
    console.error("Error updating liked array:", error);
  }
};

export const updateContinueWatching = async (
  item,
  newTimeValue,
  action,
  dispatch
) => {
  const userID = auth.currentUser.uid.toString();

  try {
    const userDocRef = doc(db, "users", userID);

    // Get the current data of the user document
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const continueWatchingArray = userData["Continue Watching"];

      if (action === "remove") {
        const newContinueWatchingArray = continueWatchingArray.filter(
          (item) => item.title !== item.title
        );
        await updateDoc(userDocRef, {
          "Continue Watching": newContinueWatchingArray,
        });
      } else {
        let exist = false;
        let itemIndex = -1;

        userData["Continue Watching"].map((existingItem, index) => {
          if (existingItem.title === item.title) {
            exist = true;
            itemIndex = index;
          }
        });

        // console.log("Index is: ", itemIndex);

        if (exist) {
          //updating
          // console.log("entering update");
          let oldTime = userData["Continue Watching"][itemIndex].time;
          // // console.log("Index time: ", oldTime);

          if (newTimeValue > oldTime) {
            const updatedContinueWatching = [...userData["Continue Watching"]];
            updatedContinueWatching[itemIndex].time = newTimeValue;

            await updateDoc(userDocRef, {
              "Continue Watching": updatedContinueWatching,
            });
          }
        } else {
          //adding
          // console.log("entering adding");
          if (newTimeValue > 0) {
            const newContinueWatchingArray = [
              ...continueWatchingArray,
              { title: item.title, time: newTimeValue },
            ];
            await updateDoc(userDocRef, {
              "Continue Watching": newContinueWatchingArray,
            });

            const newContinueWatchingArray2 = [
              ...continueWatchingArray,
              { item },
            ];

            console.log(
              "Before redux storage: ",
              store.getState()?.continueWatching
            );

            dispatch(updateContinueWatchingInRedux(newContinueWatchingArray2));

            console.log(
              "Updated redux storage: ",
              store.getState()?.continueWatching
            );
          }
        }
      }

      // // console.log("Liked array updated for user:", userID);
    } else {
      // // console.log("User document not found:", userID);
    }
  } catch (error) {
    console.error("Error updating liked array:", error);
  }
};
