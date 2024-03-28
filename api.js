import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import db from "./SQLiteHelper";

export const tv = [];
export const movies = [];
export const shows = [];
export const showsName = [];

// const clearAsyncStorage = async () => {
//   try {
//     await AsyncStorage.clear();
//     // console.log("AsyncStorage cleared successfully.");
//   } catch (error) {
//     console.error("Error clearing AsyncStorage:", error);
//   }
// };

const storeLargeData = async (data, key) => {
  try {
    await db.transaction(async (tx) => {
      // Create a table if not exists
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${key} (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT);`
      );

      // Insert data into the table
      for (let i = 0; i < data.length; i++) {
        const serializedItem = JSON.stringify(data[i]);
        tx.executeSql(`INSERT INTO ${key} (data) VALUES (?);`, [
          serializedItem,
        ]);
      }
    });

    // console.log(`Data (${key}) stored successfully.`);
  } catch (error) {
    console.error(`Error storing ${key} data:`, error);
  }
};

// Function to retrieve data

const retrieveLargeData = async (key) => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        // Retrieve data from the table
        tx.executeSql(
          `SELECT data FROM ${key};`,
          [],
          (_, { rows }) => {
            const data = rows._array.map((item) => JSON.parse(item.data));
            resolve(data);
          },
          (_, error) => reject(error)
        );
      });
    });

    // console.log(`Data (${key}) retrieval completed.`);
    // console.log(`Data (${key}) 10th index from api:`, result[10]);

    return result;
  } catch (error) {
    console.error(`Error retrieving ${key} data:`, error);
    return null;
  }
};

export const fetchData = async (link) => {
  let firstIndexOfMovie = -1;
  let lastIndexOfMovie = -1;
  try {
    // const storedData = retrieveLargeData();
    let channelData = [];
    let retrievedMovies = [];
    let retrievedTV = [];
    let retrievedShows = [];
    let retrievedShowsName = [];

    // try {
    //   retrievedMovies = await retrieveLargeData("movies");
    //   retrievedTV = await retrieveLargeData("tv");
    //   retrievedShows = await retrieveLargeData("shows");
    //   retrievedShowsName = await retrieveLargeData("showsName");

    //   // Continue with processing the retrieved data or handle it as needed
    // } catch (error) {
    //   console.error(`An unexpected error occurred: ${error.message}`);
    //   // Handle the error appropriately
    // }

    if (
      retrievedMovies?.length > 0 &&
      retrievedTV?.length > 0 &&
      retrievedShows?.length > 0 &&
      retrievedShowsName?.length > 0
    ) {
      console.log("Fetcing data from local storage of iptv");

      try {
        channelData = [
          ...retrievedMovies,
          ...retrievedTV,
          ...retrievedShows,
          ...retrievedShowsName,
        ];

        const batchSize = 1000;

        const processBatch = (sourceArray, targetArray) => {
          for (let i = 0; i < sourceArray.length; i += batchSize) {
            const batch = sourceArray.slice(i, i + batchSize);
            targetArray.push(...batch);
          }
        };

        processBatch(retrievedMovies, movies);
        processBatch(retrievedTV, tv);
        processBatch(retrievedShows, shows);
        processBatch(retrievedShowsName, showsName);

        // // console.log("Movies 10th from api page: ", movies[10]);
        // // console.log("TV 10th from api page: ", tv[10]);
        // // console.log("Shows 10th from api page: ", shows[10]);
        console.log("ShowsName 10th from api page: ", showsName[10]);
      } catch (error) {
        console.error("An error occurred:", error);
      }

      console.log("Movies 10th from api page: ", retrievedMovies[10]);
      // tv.push(...retrievedTV);
      //shows.push(...retrievedShows);
      // showsName.push(...retrievedShows);
    } else {
      try {
        console.log("Fetching data from iptv api from api page");
        const response = await axios.get(link);

        const data = response.data;

        const lines = data.split("\n");

        let currentIndex = 0;

        while (currentIndex < lines.length) {
          if (lines[currentIndex].startsWith("#EXTINF:-1,")) {
            const title = lines[currentIndex].substring(10).trim().substring(1);
            const link = lines[currentIndex + 1].trim();
            const overview = null;
            const poster = null;
            const year = null;

            channelData.push({
              title,
              link,
              overview,
              poster,
              year,
            });
          }

          currentIndex++;
        }
      } catch (error) {
        console.error("error fetching data 3: ", error);
        return []; // Exit the function here if there's an error
      }

      for (let i = 0; i < channelData.length; i++) {
        const link = channelData[i].link.toLowerCase();

        if (
          !link.includes(".mp4") &&
          !link.includes(".mkv") &&
          !link.includes(".avi") &&
          !link.includes(".srt") &&
          !link.includes(".mpg") &&
          !link.includes(".webg") &&
          !link.includes(".mp2") &&
          !link.includes(".mpeg") &&
          !link.includes(".mpe") &&
          !link.includes(".ogg") &&
          !link.includes(".m4p") &&
          !link.includes(".m4v") &&
          !link.includes(".wmv") &&
          !link.includes(".mov") &&
          !link.includes(".qt") &&
          !link.includes(".flv") &&
          !link.includes(".swf") &&
          !link.includes(".avchd")
        ) {
          tv.push(channelData[i]);
        } else if (
          channelData[i].title.includes("E0") ||
          channelData[i].title.includes("E1") ||
          channelData[i].title.includes("E2") ||
          channelData[i].title.includes("E3") ||
          channelData[i].title.includes("E4") ||
          channelData[i].title.includes("E5") ||
          channelData[i].title.includes("E6") ||
          channelData[i].title.includes("E7") ||
          channelData[i].title.includes("E8") ||
          channelData[i].title.includes("E9")
        ) {
          shows.push(channelData[i]);
        } else {
          movies.push(channelData[i]);

          lastIndexOfMovie = i;
          if (firstIndexOfMovie == -1) {
            firstIndexOfMovie = i;
          }
        }
      }

      const addedTitles = new Set();

      for (let i = 0; i < shows.length; i++) {
        let bol = false;
        let nam = shows[i].title;

        if (nam.includes("Game of Thrones S01 E01")) {
          bol = true;
        }

        nam = nam.substring(0, nam.indexOf("S0"));

        if (!addedTitles.has(nam)) {
          if (bol) {
            //// console.log("Name is: ", nam);
          }

          addedTitles.add(nam);
          showsName.push({
            title: nam,
          });
        }
      }

      console.log("showsname:", showsName[1]);

      // storeLargeData(movies, "movies");
      // storeLargeData(tv, "tv");
      // storeLargeData(shows, "shows");
      // storeLargeData(showsName, "showsName");

      console.log("hello 241");
      // retrievedMovies = await retrieveLargeData("movies");
      // retrievedTV = await retrieveLargeData("tv");
      // retrievedShows = await retrieveLargeData("shows");
      // retrievedShowsName = await retrieveLargeData("showsName");

      // Log the 20th index of each array
      // console.log("20th index of retrievedMovies:", retrievedMovies[20]);
      // console.log("20th index of Movies:", movies[20]);
      // console.log("20th index of retrievedShows:", retrievedShows[20]);
      // console.log("20th index of Shows:", shows[20]);
      // console.log("20th index of retrievedShowsName:", retrievedShowsName[20]);
      // console.log("20th index of ShowsName:", showsName[20]);
      // console.log("20th index of retrievedTV:", retrievedTV[20]);
      console.log("20th index of TV:", tv[20]);
    }
    return channelData;
  } catch (error) {
    console.error("Error fetching data 1:", error);
    return [];
  }
};
