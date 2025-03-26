import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { IoIosArrowDropleftCircle } from "react-icons/io";

export default function ProfilePage() {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    
    useEffect(() => {
        const fetchTokenAndProfile = async () => {
            const token = await AsyncStorage.getItem("userToken");
            if (token) {
                fetchUserProfile(token);
            } else { 
                setError("Token not found, please log in again.");
                setLoading(false);
            }
        };

        fetchTokenAndProfile();
    }, []);

    const fetchUserProfile = async (authToken: string) => {
        try {
            setLoading(true);
            let response = await fetch("http://192.168.56.1:3000/auth/self", {
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
            console.log("Fetchelési hiba:", error);
            setError("Unable to fetch user data.");
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userToken");
        router.replace("/(auth)/LoginScreen");
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
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => { router.replace('/(auth)/TeacherMainPage') }}>
                    <IoIosArrowDropleftCircle style={styles.iconStyle} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Tanár-diák chat app</Text>
            </View>
            <View style={styles.profileSection}>
                <Text style={styles.profileText}>
                    {userData?.firstName} {userData?.lastName}
                </Text>
                <Text style={styles.profileDetail}>Role: {userData?.role}</Text>
                <Text style={styles.profileDetail}>Email: {userData?.email}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
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
    backButton: {
        backgroundColor: "#6200EE",
        borderRadius: 8,
    },
    backText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center"
    },
    profileSection: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
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
        marginBottom: 5,
    },
    errorText: {
        color: "red",
        fontSize: 18,
        textAlign: "center",
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: "#FF0000",
        padding: 10,
        borderRadius: 8,
    },
    logoutText: {
        color: "#fff",
        fontWeight: "bold",
    },
    iconStyle: {
        color: '#ffffff',
        width: 30,
        height: 30,
        marginRight: 20
    }
});
