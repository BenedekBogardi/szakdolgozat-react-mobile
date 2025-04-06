import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Animated, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [scaleAnim] = useState(new Animated.Value(1));

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

                fetchUserProfile(sToken);
            } catch (error) {
                console.error("Error fetching stored token:", error);
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
                setUserData(data);
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

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("currentUser");
        router.replace("/(auth)/LoginScreen");
    };

    const handleBackPress = () => {
        if (userData?.role === "Teacher") {
            router.replace("/(auth)/TeacherMainPage");
        } else if (userData?.role === "Student") {
            router.replace("/(auth)/StudentMainPage");
        }
    };

    const handleLogoutAnimation = () => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1.1,
                friction: 3,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress}>
                        <AntDesign name="leftcircleo" style={styles.iconStyle} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Tanár-diák chat app</Text>
                </View>

                <View style={styles.profileSection}>
                    <Text style={styles.profileText}>
                        {userData?.firstName} {userData?.lastName}
                    </Text>
                    <Text style={[styles.profileDetail, { color: userData?.role === 'Teacher' ? '#6200EE' : '#FF6347' }]}>
                        Tanár / Diák: {userData?.role === 'Teacher' ? 'Tanár' : 'Diák'}
                    </Text>
                    <Text style={styles.profileDetail}>E-mail cím:{"\n"}</Text>
                    <Text style={styles.profileDetail}>{userData?.email}</Text>
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPressIn={handleLogoutAnimation}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </Animated.View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2025 Tanár-diák chat app</Text>
                    <Text style={styles.footerLink}>Minden jog fenntartva.</Text>
                </View>
                
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    header: {
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        width: "100%",
        height: 60,
    },
    headerText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "right",
        flex: 1
    },
    iconStyle: {
        color: '#ffffff',
        fontSize: 25,
    },
    profileSection: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flex: 1,
        marginBottom: 10
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: "#6200EE",
    },
    profileText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#6200EE",
        marginBottom: 10,
    },
    profileDetail: {
        fontSize: 18,
        color: "#333",
        marginBottom: 10,
        textAlign: "justify"
    },
    errorText: {
        color: "red",
        fontSize: 18,
        textAlign: "center",
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: "#FF6347",
        padding: 10,
        borderRadius: 8,
        width: "80%",
        alignItems: "center",
    },
    logoutText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        backgroundColor: '#6200EE',
        alignItems: 'center',
    },
    footerText: {
        color: '#fff',
        fontSize: 12,
    },
    footerLink: {
        color: '#FFDD57',
        fontSize: 12,
        marginTop: 5,
    },
});
