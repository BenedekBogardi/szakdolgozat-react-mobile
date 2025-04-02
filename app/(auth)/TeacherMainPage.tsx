import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TeacherMainPage = () => {
    const [vStudents, vSetStudents] = useState<{ id: string; firstName: string; lastName: string; lastMessage?: string }[]>([]);
    const [sTeacherId, sSetTeacherId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fFetchTeacherId = async () => {
            try {
                const sUserId = await AsyncStorage.getItem("currentUser");
                if (!sUserId) {
                    console.error("No logged-in user found");
                    setLoading(false);
                    return;
                }

                const sToken = await AsyncStorage.getItem(`userToken_${sUserId}`);
                if (!sToken) {
                    console.error("No token found for the logged-in user");
                    setLoading(false);
                    return;
                }

                const oResponse = await fetch("http://192.168.100.4:3000/auth/self", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${sToken}`,
                    },
                });

                if (!oResponse.ok) {
                    throw new Error(`HTTP error! Status: ${oResponse.status}`);
                }

                const oData = await oResponse.json();
                sSetTeacherId(oData.id);
            } catch (oError) {
                console.error("Error fetching teacher ID:", oError);
            } finally {
                setLoading(false);
            }
        };

        fFetchTeacherId();
    }, []);

    const fFetchUsers = async () => {
        try {
            const sUserId = await AsyncStorage.getItem("currentUser");
            if (!sUserId) {
                console.error("No logged-in user found");
                return;
            }

            const sToken = await AsyncStorage.getItem(`userToken_${sUserId}`);
            if (!sToken) {
                console.error("No token found for the logged-in user");
                return;
            }

            const oResponse = await fetch("http://192.168.100.4:3000/users/students", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${sToken}`,
                },
            });

            if (!oResponse.ok) {
                throw new Error(`HTTP error! Status: ${oResponse.status}`);
            }

            const aUsers = await oResponse.json();
            vSetStudents(aUsers);
        } catch (oError) {
            console.error("Error fetching users:", oError);
        }
    };

    useEffect(() => {
        if (sTeacherId) {
            fFetchUsers();
        }
    }, [sTeacherId]);

    const vChats = [
        { id: 'broadcast', name: 'Tanári csevegő', lastMessage: 'Nem működik még' }, 
        ...vStudents.map(oStudent => ({
            id: oStudent.id,
            name: `${oStudent.firstName} ${oStudent.lastName}`,
            lastMessage: oStudent.lastMessage || "Nincs üzenet",
        }))
    ];

    const fRenderChatItem = ({ item }) => (
        <TouchableOpacity style={styles.chatItem} onPress={() => router.replace(`/(auth)/LoggedInTeacher`)}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Tanár csevegő</Text>
                <TouchableOpacity style={styles.profileButton} onPress={() => router.replace('/(auth)/ProfilePage')}>
                    <Image source={require('./img/profile.png')} style={styles.profileImage} />
                </TouchableOpacity>
            </View>
            <FlatList 
                data={vChats} 
                renderItem={fRenderChatItem} 
                keyExtractor={(item) => item.id.toString() || item.name} 
                style={styles.chatList} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        height: 60,
        backgroundColor: '#6200EE',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    profileButton: {
        backgroundColor: '#ffffff',
        borderRadius: 25,
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    chatList: {
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 16,
    },
    chatItem: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3.5,
        elevation: 3,
    },
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    lastMessage: {
        fontSize: 14,
        color: 'gray',
        marginTop: 4,
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default TeacherMainPage;
