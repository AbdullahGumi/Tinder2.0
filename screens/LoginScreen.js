import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";

const LoginScreen = () => {
  const { signInWithGoogle } = useAuth();
  const navigation = useNavigation();
  return (
    <View style={tw`flex-1`}>
      <ImageBackground
        style={tw`flex-1`}
        resizeMethod="auto"
        source={{ uri: "https://tinder.com/static/tinder.png" }}
      >
        <TouchableOpacity
          onPress={signInWithGoogle}
          style={[
            tw`absolute bottom-40 w-52 bg-white p-4 rounded-2xl`,
            { marginHorizontal: "25%" },
          ]}
        >
          <Text style={tw`font-semibold text-center`}>
            Sign in & get swiping
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
