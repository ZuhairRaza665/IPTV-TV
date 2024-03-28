// reducers.js
import {
  ADD_LIKED_ITEM,
  REMOVE_LIKED_ITEM,
  REMOVE_CONTINUE_WATCHING,
  ADD_CONTINUE_WATCHING,
  UPDATE_CONTINUE_WATCHING,
} from "./actions";
import { ADD_LIKED_MOVIES } from "./actions";

const initialState = {
  likedItems: [],
  continueWatching: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LIKED_MOVIES:
      return {
        ...state,
        likedItems: action.payload,
      };
    case ADD_LIKED_ITEM:
      return {
        ...state,
        likedItems: [...state.likedItems, action.payload],
      };
    case REMOVE_LIKED_ITEM:
      return {
        ...state,
        likedItems: state.likedItems.filter(
          (likedItem) => likedItem.title !== action.payload.title
        ),
      };
    case ADD_CONTINUE_WATCHING:
      return {
        ...state,
        continueWatching: [...state.continueWatching, action.payload],
      };
    case REMOVE_CONTINUE_WATCHING:
      return {
        ...state,
        continueWatching: state.continueWatching.filter(
          (item) => item.title !== action.payload.title
        ),
      };
    case UPDATE_CONTINUE_WATCHING:
      // Merge the new array with the existing state
      return {
        ...state,
        continueWatching: action.payload.map((newItem) => {
          // Find the existing item in the state by title
          const existingItem = state.continueWatching.find(
            (item) => item.title === newItem.title
          );

          // If an existing item is found, merge its properties with the new item
          if (existingItem) {
            return {
              ...existingItem,
              ...newItem,
            };
          }

          // If no existing item is found, use the new item
          return newItem;
        }),
      };

    default:
      return state;
  }
};

export default rootReducer;
