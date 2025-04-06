import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

      let response = await fetch("http://192.168.100.4:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: strEmail, password: strJelszo }),
      });

      let data = await response.json();

      console.log("Bejelentkezési válasz: ", data);

      if (response.ok) {
        if (!data.token) {
          console.error("Missing token or id in response:", data);
          Alert.alert("Hiba", "Sikertelen bejelentkezés: nem érkezett valid adat.");
          return;
        }

        let roleResponse = await fetch("http://192.168.100.4:3000/auth/self", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${data.token}`,
          },
        });

        let roleData = await roleResponse.json();
        await AsyncStorage.setItem(`userToken_${roleData.id}`, data.token);
        await AsyncStorage.setItem("currentUser", roleData.id.toString());
        console.log("Role data:", roleData);

        if (roleResponse.ok) {
          if (roleData && roleData.role) {
            await AsyncStorage.setItem("roleData", JSON.stringify(roleData));
            console.log("RoleData stored in AsyncStorage:", roleData);

            if (roleData.role === "Teacher") {
              console.log("TeacherID: ", roleData.id);
              router.replace(`/(auth)/TeacherMainPage`);
            } else if (roleData.role === "Student") {
              console.log("StudentID: ", roleData.id);
              router.replace(`/(auth)/StudentMainPage`);
            } else {
              Alert.alert("Hiba", "Ismeretlen szerep.");
            }
          } else {
            console.error("Invalid role data received:", roleData);
            Alert.alert("Hiba", "A szerep lekérdezése nem sikerült.");
          }
        } else {
          Alert.alert("Hiba", "A szerep lekérdezése nem sikerült.");
        }

      } else {
        Alert.alert("Hiba", "Hibás bejelentkezési adatok!");
      }

    } catch (error) {
      console.log("Hiba a bejelentkezés során:", error);
      Alert.alert("Hiba", "Nem sikerült csatlakozni a szerverhez.");
    } finally {
      setBBetolt(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.heading}>
          Tanár-diák chat app{"\n"}Bejelentkezés{"\n"}{"\n"}
        </Text>
        <Text style={styles.label}>E-mail cím:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setStrEmail}
          value={strEmail}
          placeholder="Adja meg az e-mail címét!"
          autoComplete="email"
          keyboardType="email-address"
        />
        <Text style={styles.label}>Jelszó:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
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
            style={styles.eyeIcon}
          />
        </View>
        <Text>{"\n"}</Text>
        {bBetolt ? (
          <ActivityIndicator size="large" color="#0ead16" />
        ) : (
          <Button onPress={checkLogin} title="Bejelentkezés" color="#6200EE" />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Tanár-diák chat app</Text>
        <Text style={styles.footerLink}>Minden jog fenntartva.</Text>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "space-between" as "space-between",
  },
  scrollView: {
    flexGrow: 0.3,
    justifyContent: "center"  as "center",
    alignItems: "center" as "center",
  },
  heading: {
    fontSize: 25,
    textAlign: "center" as "center",
    marginTop: 50
  },
  label: {
    fontSize: 15,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 2,
    width: 230,
    paddingHorizontal: 8,
  },
  passwordContainer: {
    flexDirection: "row" as "row",
    alignItems: "center" as "center",
    width: 230,
    borderColor: "gray",
    borderWidth: 2,
    height: 40,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 8,
  },
  eyeIcon: {
    marginRight: 5,
  },
  footer: {
    padding: 15,
    backgroundColor: "#6200EE",
    alignItems: "center" as "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 12,
  },
  footerLink: {
    color: "#FFDD57",
    fontSize: 12,
    marginTop: 5,
  },
};
