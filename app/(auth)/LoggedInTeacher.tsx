import { router } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Animated, Image } from "react-native";
import io from "socket.io-client";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import AsyncStorage from "@react-native-async-storage/async-storage";

const socket = io("http://localhost:3002");

export default function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [messages, setMessages] = useState<Array<{ text: string; self: boolean; username: string }>>([]);

  useEffect(() => {
    const fetchTokenAndProfile = async () => {
      try {
        const sUserId = await AsyncStorage.getItem("currentUser");
        if (!sUserId) {
          setError("No logged-in user found.");
          setLoading(false);
          return;
        }
    
        const sToken = await AsyncStorage.getItem(`userToken_${sUserId}`);
        if (!sToken) {
          setError("Token missing for logged-in user.");
          setLoading(false);
          return;
        }
    
        await fetchUserProfile(sToken);
      } catch (oError) {
        console.error("Error fetching stored token:", oError);
        setError("Failed to retrieve stored session.");
        setLoading(false);
      }
    };

    fetchTokenAndProfile();
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      setLoading(true);
      let response = await fetch("http://192.168.100.4:3000/auth/self", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });

      let data = await response.json();

      if (response.ok) {
        const fullName = data.firstName + " " + data.lastName;
        setUsername(fullName);
        setUserData(data);
        setIsLoggedIn(true);
        setLoading(false);
      } else {
        setError("Failed to fetch user data.");
        setLoading(false);
      }
    } catch (error) {
      console.log("Fetch error:", error);
      setError("Unable to fetch user data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message.trim() === '') {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [message]);

  useEffect(() => {
    if(!username) return
    socket.on("user-joined", (data) => {
      setMessages((prevMessages) => [...prevMessages, { text: data.message, self: false, username: data.username }]);
    });

    socket.on("user-left", (data) => {
      setMessages((prevMessages) => [...prevMessages, { text: data.message, self: false, username: data.username }]);
    });

    socket.on("message", (msg) => {
      if (msg.username !== username) {
        setMessages((prevMessages) => [...prevMessages, { text: msg.text, self: false, username: msg.username }]);
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("message");
    };
  }, [username]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("newMessage", { username, text: message });
      setMessages((prevMessages) => [...prevMessages, { text: message, self: true, username }]);
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => { router.replace('/(auth)/TeacherMainPage') }}>
          <Text>Asd</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Tanár csevegő</Text>
        <TouchableOpacity style={styles.profileButton} onPress={() => {  }}>
          <Image
            source={require('./img/profile.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {isLoggedIn ? (
        <>
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <View style={[styles.message, item.self ? styles.selfMessage : styles.otherMessage]}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={item.self ? styles.selfText : styles.otherText}>{item.text}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            style={styles.messageList}
          />
          <View style={{ width: 425, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: 10 }}>
            <TextInput
              id="MsgTxt"
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Start typing..."
              autoComplete="off"
            />
            {message.trim() !== '' && (
              <Animated.View style={{ opacity: fadeAnim }}>
                <TouchableOpacity style={styles.button} onPress={sendMessage}>
                  <Image
                    source={require('./img/send.png')}
                    style={styles.imageButton}
                  />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </>
      ) : (
        loading ? (
          <Text>Loading...</Text>
        ) : (
          <Text>{error}</Text>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  messageList: {
    marginTop: 30,
    flex: 1,
    width: "100%",
  },
  message: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  selfMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#03366b",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#76d1e3",
  },
  selfText: {
    color: "#fff",
  },
  otherText: {
    color: "#000",
  },
  username: {
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: 12,
    marginBottom: 2,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "80%",
    marginBottom: 10,
    marginLeft: 10,
    alignItems: "center"
  },
  button: {
    backgroundColor: "#76d1e3",
    padding: 10,
    marginLeft: 10,
    marginBottom: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
    width: "80%",
  },
  imageButton: {
    width: 21,
    height: 21,
    resizeMode: 'contain',
  },
  header: {
    height: 60,
    backgroundColor: '#6200EE',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: "100%"
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 40,
    height: 30
  },
  profileButton: {
    padding: 2,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
  iconStyle: {
    color: '#ffffff',
    width: 30,
    height: 30,
    marginRight: 20
  }
});
