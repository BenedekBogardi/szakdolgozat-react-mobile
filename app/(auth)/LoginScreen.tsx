import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Button, ScrollView, Text, TextInput, View, ActivityIndicator, Platform, KeyboardAvoidingView } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn } from "react-native-reanimated";
import { useFonts, DancingScript_700Bold } from "@expo-google-fonts/dancing-script";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [strEmail, setStrEmail] = useState("");
  const [strJelszo, setStrJelszo] = useState("");
  const [bMutatJelszo, setBMutatJelszo] = useState(false);
  const [bBetolt, setBBetolt] = useState(false);

  const [fontsLoaded] = useFonts({ DancingScript_700Bold });

  const toggleShowPassword = () => {
    setBMutatJelszo(!bMutatJelszo);
  };

  const showToast = (title: string, message: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
    });
  };

  const checkLogin = async () => {
    if (!strEmail || !strJelszo) {
      showToast("Hiba", "Kérjük, adja meg az e-mail címét és a jelszavát.");
      return;
    }

    setBBetolt(true);
    try {
      let response = await fetch("http://192.168.100.4:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: strEmail, password: strJelszo }),
      });

      let data = await response.json();

      if (response.ok) {
        if (!data.token) {
          showToast("Hiba", "Sikertelen bejelentkezés: nem érkezett valid adat.");
          return;
        }

        let roleResponse = await fetch("http://192.168.100.4:3000/auth/self", {
          method: "GET",
          headers: { "Authorization": `Bearer ${data.token}` },
        });

        let roleData = await roleResponse.json();
        await AsyncStorage.setItem(`userToken_${roleData.id}`, data.token);
        await AsyncStorage.setItem("currentUser", roleData.id.toString());

        if (roleResponse.ok && roleData.role) {
          await AsyncStorage.setItem("roleData", JSON.stringify(roleData));
          if (roleData.role === "Student") {
            await AsyncStorage.setItem("studentId", JSON.stringify(roleData.id));
          }

          if (roleData.role === "Teacher") {
            router.replace(`/(auth)/TeacherMainPage`);
          } else if (roleData.role === "Student") {
            router.replace(`/(auth)/StudentMainPage`);
          } else {
            showToast("Hiba", "Ismeretlen szerep.");
          }
        } else {
          showToast("Hiba", "A szerep lekérdezése nem sikerült.");
        }

      } else {
        showToast("Hiba", "Hibás bejelentkezési adatok!");
      }

    } catch (error) {
      showToast("Hiba", "Nem sikerült csatlakozni a szerverhez.");
    } finally {
      setBBetolt(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.Text entering={FadeIn.duration(1000)} style={styles.heading}>
            BrainBoost{"\n"}Boost your skills{"\n"}Bejelentkezés
          </Animated.Text>

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
            <View style={{ marginBottom: 20 }}>
              <Button onPress={checkLogin} title="Bejelentkezés" color="#6200EE" />
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 BrainBoost Co.</Text>
          <Text style={styles.footerLink}>Minden jog fenntartva.</Text>
        </View>

        <Toast position="top"/>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flexGrow: 0.3,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 30,
    textAlign: "center" as const,
    marginTop: 40,
    fontFamily: "DancingScript_700Bold",
    color: "#6200EE",
  },
  label: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    width: 230,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fdfdfd",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: Platform.OS === "android" ? 3 : 0,
  },
  passwordContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    width: 230,
    borderColor: "#ccc",
    borderWidth: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#fdfdfd",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: Platform.OS === "android" ? 3 : 0,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  eyeIcon: {
    marginRight: 8,
  },
  footer: {
    padding: 15,
    backgroundColor: "#6200EE",
    alignItems: "center" as const,
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
