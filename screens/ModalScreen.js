import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import tw from "twrnc";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const ModalScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [image, setImage] = useState(
    "data:image/jpeg;base64,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"
  );
  const [job, setJob] = useState("Programmer");
  const [age, setAge] = useState("30");

  const incompleteForm = !image || !job || !age;

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job,
      age,
      timestamp: serverTimestamp(),
    })
      .then(() => navigation.goBack())
      .catch((err) => alert(err.message));
  };

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
        onChangeText={setImage}
        style={tw`text-center text-xl pb-2 `}
        placeholder="Enter a Profile Pic URL"
      />

      <Text style={tw`text-center p-4 font-bold  text-red-400`}>
        Step 2: The Job
      </Text>
      <TextInput
        value={job}
        onChangeText={setJob}
        style={tw`text-center text-xl pb-2 `}
        placeholder="Enter your occupation"
      />

      <Text style={tw`text-center p-4 font-bold  text-red-400`}>
        Step 3: The Age
      </Text>
      <TextInput
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        maxLength={2}
        style={tw`text-center text-xl pb-2 `}
        placeholder="Enter your age"
      />

      <TouchableOpacity
        onPress={updateUserProfile}
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
