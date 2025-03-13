import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
  const [strEmail, setStrEmail] = useState("");
  const [strJelszo, setStrJelszo] = useState("");
  const [bMutatJelszo, setBMutatJelszo] = useState(false);
  const [bBetolt, setBBetolt] = useState(false);

  const toggleShowPassword = () => {
    setBMutatJelszo(!bMutatJelszo);
  };

  const checkLogin = async () => {
    if (!strEmail || !strJelszo) {
      Alert.alert("Hiba", "Kérjük, adja meg az e-mail címét és a jelszavát.");
      return;
    }
  
    setBBetolt(true);
  
    try {
      console.log("Bejelentkezési próbálkozás e-mail:", strEmail);
      console.log("Megadott jelszó:", strJelszo);
  
      let response = await fetch("http://192.168.100.4:3000/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: strEmail, password: strJelszo }),
      });
  
      let data = await response.json();
  
      console.log("Diák bejelentkezési válasz:", data);
  
      if (response.ok) {
        console.log("StudentID:", data.id);
        console.log("Token:", data.token);
        Alert.alert("Sikeres bejelentkezés", `Üdvözöljük, diák! Azonosító: ${data.id}`);
        router.replace(`/(auth)/LoggedIn`);
        setBBetolt(false);
        return;
      }
  
      response = await fetch("http://192.168.100.4:3000/teachers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: strEmail, password: strJelszo }),
      });
  
      data = await response.json();
  
      console.log("Tanár bejelentkezési válasz:", data);
  
      if (response.ok) {
        console.log("TeacherID:", data.teacherId);
        console.log("Token:", data.token);
        Alert.alert("Sikeres bejelentkezés", `Üdvözöljük, tanár! Azonosító: ${data.id}`);
        router.replace(`/(auth)/LoggedIn`);
        setBBetolt(false);
        return;
      }
  
      console.log("Bejelentkezés sikertelen.");
      Alert.alert("Hiba", "Hibás bejelentkezési adatok.");
    } catch (error) {
      console.log("Hiba a bejelentkezés során:", error);
      Alert.alert("Hiba", "Nem sikerült csatlakozni a szerverhez.");
    } finally {
      setBBetolt(false);
    }
  };
  
  
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 0.3, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 25, textAlign: "center" }}>Insert Webpage Name{"\n"}Bejelentkezés{"\n"}{"\n"}</Text>
      <Text style={{ fontSize: 15 }}>E-mail cím:</Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 2, width: 230, paddingHorizontal: 8 }}
        onChangeText={setStrEmail}
        value={strEmail}
        placeholder="Adja meg az e-mail címét!"
        autoComplete="email"
        keyboardType="email-address"
      />
      <Text style={{ fontSize: 15, marginTop: 10 }}>Jelszó:</Text>
      <View style={{ flexDirection: "row", alignItems: "center", width: 230, borderColor: "gray", borderWidth: 2, height: 40 }}>
        <TextInput
          style={{ flex: 1, paddingHorizontal: 8 }}
          onChangeText={setStrJelszo}
          value={strJelszo}
          placeholder="Adja meg a jelszavát!"
          secureTextEntry={!bMutatJelszo}
        />
        <MaterialCommunityIcons
          name={bMutatJelszo ? "eye-off" : "eye"}
          size={24}
          color="#aaa"
          onPress={toggleShowPassword}
          style={{ marginRight: 5 }}
        />
      </View>
      <Text>{"\n"}</Text>
      {bBetolt ? (
        <ActivityIndicator size="large" color="#0ead16" />
      ) : (
        <Button onPress={checkLogin} title="Bejelentkezés" color="#0ead16" />
      )}
    </ScrollView>
  );
}
