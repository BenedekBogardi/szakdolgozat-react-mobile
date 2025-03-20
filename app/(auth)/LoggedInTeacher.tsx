import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import io from "socket.io-client";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const socket = io("http://localhost:3002");

export default function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; self: boolean }>>([]);
  const [bBetolt, setBBetolt] = useState(false);
  const [joinedUsers, setJoinedUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.on("connect", (data) => {
      addMessage((prevMessages) => [
        ...prevMessages,
        { text: data.message, self: false },
      ]);
    });

    socket.on("user-left", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.message, self: false },
      ]);
    });

    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, { text: msg, self: false }]);
    });

    return () => {
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("newMessage", message);
      setMessages((prevMessages) => [...prevMessages, { text: message, self: true }]);
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      {}
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.self ? styles.selfMessage : styles.otherMessage,
            ]}
          >
            <Text>{item.text}</Text>
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
      {bBetolt ? (
        <ActivityIndicator size="large" color="#0ead16" />
      ) : (
        <Button onPress={sendMessage} title="Send" color="#0ead16" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
    backgroundColor: "#fff",
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
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
    color: "#fff",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
    color: "#000",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
});
