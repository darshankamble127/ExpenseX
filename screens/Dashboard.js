import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Records from "./nav/Records";
import Accounts from "./nav/Accounts";
import Categories from "./nav/Categories";
import Settings from "./nav/Settings";
import Analysis from "./nav/Analysis";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Dashboard = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Records") iconName = "calendar-clear-sharp";
          else if (route.name === "Analysis") iconName = "pie-chart-sharp";
          else if (route.name === "Accounts") iconName = "wallet-sharp";
          else if (route.name === "Categories") iconName = "pricetag-sharp";
          else if (route.name === "Settings") iconName = "settings-sharp";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#000",   // text/icon color when active
        tabBarInactiveTintColor: "#00000059", // text/icon color when inactive
        headerShown: false,                 //  hides the top header box
        tabBarStyle: {
          backgroundColor: "#ffffffff",   // bottom nav background
          height: 55,                // height of bar
          paddingBottom: 8,          // spacing for labels/icons
        },
        tabBarLabelStyle: {
          fontSize: 13,              // text size
          fontWeight: "600",         // bold text
        },
      })}
    >
      <Tab.Screen name="Records" component={Records} />
      <Tab.Screen name="Analysis" component={Analysis} />
      <Tab.Screen name="Accounts" component={Accounts} />
      <Tab.Screen name="Categories" component={Categories} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default Dashboard;
