import { View, Text, Button } from "react-native";
import React from "react";

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button
        title="go to chat screen"
        onPress={() => navigation.navigate("Chat")}
      >
        Chat screen
      </Button>
    </View>
  );
};

export default HomeScreen;
