import React from "react";
import { View, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import TVScreen from "./screens/TVScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SearchScreen from "./screens/SearchScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import { Entypo, Ionicons } from "react-native-vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SignOutScreen from "./screens/SignoutScreen";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export const DrawerScreen = ({ navigation }) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "#0B0B0B" },
        drawerLabelStyle: { color: "white" },
      }}
    >
      <Drawer.Screen name="Home" component={MainScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Sign Out" component={SignOutScreen} />
    </Drawer.Navigator>
  );
};

const MainScreen = () => {
  const Tab = createBottomTabNavigator();

  const renderTabBarIcon = (iconName, focused) => {
    return (
      <View style={{ alignItems: "center" }}>
        {getIconComponent(iconName, focused)}
        {focused && (
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 5,
              backgroundColor: "white",
              marginTop: 4,
            }}
          />
        )}
      </View>
    );
  };

  const getIconComponent = (iconName, focused) => {
    switch (iconName) {
      case "home":
        return (
          <Entypo
            name={iconName}
            size={24}
            color={focused ? "white" : "#748c94"}
          />
        );
      case "tv":
        return (
          <Entypo
            name={iconName}
            size={24}
            color={focused ? "white" : "darkgrey"}
          />
        );
      case "search":
        return (
          <Ionicons
            name={iconName}
            size={24}
            color={focused ? "white" : "darkgrey"}
          />
        );
      case "heart":
        return (
          <Ionicons
            name={iconName}
            size={24}
            color={focused ? "white" : "darkgrey"}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#0B0B0B",
          borderTopColor: "#0B0B0B",
        },
        tabBarIcon: ({ focused }) =>
          renderTabBarIcon(route.name.toLowerCase(), focused),
      })}
    >
      <Tab.Screen name="home">
        {(props) => <HomeScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen name="Heart">
        {(props) => <FavoriteScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen name="TV" component={TVScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
};

export default DrawerScreen;
