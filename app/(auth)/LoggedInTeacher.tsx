import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Animated, Image } from "react-native";
import io from "socket.io-client";

const socket = io("http://localhost:3002");

export default function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [messages, setMessages] = useState<Array<{ text: string; self: boolean; username: string }>>([]);

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
    socket.on("user-joined", (data) => {
      setMessages((prevMessages) => [...prevMessages, { text: data.message, self: false, username: "" }]);
    });

    socket.on("user-left", (data) => {
      setMessages((prevMessages) => [...prevMessages, { text: data.message, self: false, username: "" }]);
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

  const handleLogin = () => {
    if (username.trim()) {
      socket.emit("joinChat", username);
      setIsLoggedIn(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("newMessage", { username, text: message });
      setMessages((prevMessages) => [...prevMessages, { text: message, self: true, username }]);
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.inputAtLogin}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
          />
          <TouchableOpacity style={styles.buttonAtLogin} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: 20 }}></View>
            avagy ide jön majd egy header*/}
            
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  loginContainer: {
    width: "100%",
    alignItems: "center",
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
  inputAtLogin: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "80%",
    marginBottom: 10,
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
  buttonAtLogin: {
    backgroundColor: "#0ead16",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageButton: {
    width: 21,
    height: 21,
    resizeMode: 'contain',
  }
});
