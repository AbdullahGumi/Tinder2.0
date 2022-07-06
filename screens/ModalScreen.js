import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import tw from "twrnc";

const ModalScreen = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);

  const incompleteForm = !image || !job || !age;

  return (
    <View style={tw`flex-1 items-center pt-1`}>
      <Image
        style={tw`h-20 w-full`}
        resizeMode="contain"
        source={{ uri: "https://links.papareact.com/2pf" }}
      />
      <Text style={tw`text-xl text-gray-500 p-2 font-bold`}>
        Welcom {user.displayName}
      </Text>

      <Text style={tw`text-center p-4 font-bold  text-red-400`}>
        Step 1: The Profile Pic
      </Text>
      <TextInput
        value={image}
        onChange={(text) => setImage(text)}
        style={tw`text-center text-xl pb-2 `}
        placeholder="Enter a Profile Pic URL"
      />

      <Text style={tw`text-center p-4 font-bold  text-red-400`}>
        Step 2: The Job
      </Text>
      <TextInput
        value={job}
        onChange={(text) => setJob(text)}
        style={tw`text-center text-xl pb-2 `}
        placeholder="Enter your occupation"
      />

      <Text style={tw`text-center p-4 font-bold  text-red-400`}>
        Step 3: The Age
      </Text>
      <TextInput
        value={age}
        onChange={(text) => setAge(text)}
        keyboardType="numeric"
        maxLength={2}
        style={tw`text-center text-xl pb-2 `}
        placeholder="Enter your age"
      />

      <TouchableOpacity
        disabled={incompleteForm}
        style={[
          tw`w-64 p-3 rounded-xl absolute bottom-10  ${
            incompleteForm ? "bg-gray-400" : "bg-red-400"
          }`,
          ,
        ]}
      >
        <Text style={tw`text-center text-white text-xl `}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
