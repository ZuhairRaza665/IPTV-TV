import { createStore } from "redux";
import rootReducer from "./reducers"; // Assuming you have reducers defined

// Create Redux store
const store = createStore(rootReducer);

export { store };
