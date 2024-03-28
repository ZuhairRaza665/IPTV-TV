// actions.js

import {
  updateUserLikedArray,
  // updateContinueWatching,
} from "../updateUserLikedArray";

export const ADD_LIKED_ITEM = "ADD_LIKED_ITEM";
export const REMOVE_LIKED_ITEM = "REMOVE_LIKED_ITEM";
export const ADD_LIKED_MOVIES = "ADD_LIKED_MOVIES";
export const ADD_CONTINUE_WATCHING = "ADD_CONTINUE_WATCHING";
export const REMOVE_CONTINUE_WATCHING = "REMOVE_CONTINUE_WATCHING";
export const UPDATE_CONTINUE_WATCHING = "UPDATE_CONTINUE_WATCHING";

export const addLikedItem = (item) => {
  if (item.title != null) {
    // // console.log("item being liked: ", item.title);
    updateUserLikedArray(item, "add");
  }
  return {
    type: ADD_LIKED_ITEM,
    payload: item,
  };
};

export const removeLikedItem = (item) => {
  if (item.id != null) {
    // // console.log("item being liked: ", item.title);
    updateUserLikedArray(item, "remove");
  }
  return {
    type: REMOVE_LIKED_ITEM,
    payload: item,
  };
};

export const addLikedMovies = (likedMovies) => ({
  type: ADD_LIKED_MOVIES,
  payload: likedMovies,
});

export const addToContinueWatching = (item, continueFrom) => {
  // if (item.id != null) {
  //   // console.log("Entering addtoWatiching");
  //   updateContinueWatching(item.title, continueFrom, null);
  // }
  return {
    type: ADD_CONTINUE_WATCHING,
    payload: item,
  };
};

export const removeToContinueWatching = (item, continueFrom) => {
  // if (item.id != null) {
  //   updateContinueWatching(
  //     (itemTitle = item.title),
  //     (time = continueFrom),
  //     (action = "remove")
  //   );
  // }
  return {
    type: REMOVE_CONTINUE_WATCHING,
    payload: item,
  };
};

export const updateContinueWatchingInRedux = (newContinueWatchingArray) => {
  return {
    type: UPDATE_CONTINUE_WATCHING,
    payload: newContinueWatchingArray,
  };
};

// export const updateContinueWatchingItem = (item, time) => {
//   if (item.title != null) {
//     // console.log("Entering update Continue Watching");
//     updateContinueWatching(item.title, time, null);
//   }
//   return {
//     type: UPDATE_CONTINUE_WATCHING,
//     payload: item,
//   };
// };
