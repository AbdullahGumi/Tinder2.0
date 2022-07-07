import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import tw from "twrnc";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import generateId from "../lib/generateId";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState([]);
  const { user, logout } = useAuth();

  const swipeRef = useRef(null);

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );

  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = (await passes).length > 0 ? passes : ["test"];
      const swipedUserIds = (await swipes).length > 0 ? swipes : ["test"];

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        }
      );
    };
    fetchCards();
    return unsub;
  }, []);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];

    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();

    getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          console.log("Matched");

          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );

          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });
          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          console.log("not matched");
        }
      }
    );

    setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped);
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View
        style={tw`flex-row justify-between px-5 items-center relative mt-10`}
      >
        <TouchableOpacity onPress={logout}>
          <Image
            source={{ uri: user.photoURL }}
            style={tw`h-10 w-10 rounded-full`}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tw`h-14 w-14 bg-red-500`}
            source={{
              uri: "data:image/jpeg;base64,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",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>

      <View style={tw`flex-1 -mt-6`}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={4}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => {
            console.log("left");
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            console.log("SwipedRight");
            swipeRight(cardIndex);
          }}
          backgroundColor={"#4fd0e9"}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.age}
                style={tw`bg-white h-3/4 rounded-xl relative`}
              >
                <Image
                  style={tw`h-full w-full rounded-xl absolute top-0`}
                  source={{ uri: card.photoURL }}
                />
                <View
                  style={[
                    tw`w-full bg-white h-20 absolute bottom-0 justify-between items-between flex-row px-6 py-2 rounded-b-xl`,
                    ,
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw`text-xl font-bold`}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw`text-2xl font-bold`}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw`relative bg-white h-3/4 rounded-xl justify-center items-center`,
                  styles.cardShadow,
                ]}
              >
                <Text style={tw`font-bold pb-5`}>No more profiles</Text>
                <Image
                  style={tw`h-20 w-full`}
                  height={100}
                  width={100}
                  source={{ uri: "https://links.papareact.com/6gb" }}
                />
              </View>
            )
          }
        />
      </View>
      <View style={tw`flex flex-row justify-evenly`}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-red-200`}
        >
          <Entypo size={24} name="cross" color={"red"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-green-200`}
        >
          <AntDesign size={24} name="heart" color={"green"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
