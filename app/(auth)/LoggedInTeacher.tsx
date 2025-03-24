import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import io from "socket.io-client";

const socket = io("http://localhost:3002");

export default function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; self: boolean; username: string }>>([]);

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
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
          />
          <TouchableOpacity style={styles.button} onPress={sendMessage}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
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
    flex: 1,
    width: "100%",
  },
  message: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  selfMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
  },
  selfText: {
    color: "#fff",
  },
  otherText: {
    color: "#000",
  },
  username: {
    fontWeight: "bold",
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
  },
  button: {
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
});
