import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";

const TeacherMainPage = () => {
    const [vStudents, vSetStudents] = useState<{ id: string; firstName: string; lastName: string; lastMessage?: string }[]>([]);
    const [sTeacherId, sSetTeacherId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [sStudentId, setSStudentId] = useState<string | null>(null);

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
            const sToken = await AsyncStorage.getItem(`userToken_${sUserId}`);
            if (!sUserId || !sToken || !sTeacherId) return;

            const oResponse = await fetch("http://192.168.100.4:3000/users/students", {
                headers: { "Authorization": `Bearer ${sToken}` },
            });

            if (!oResponse.ok) throw new Error(`HTTP error! Status: ${oResponse.status}`);

            const aStudents = await oResponse.json();

            const aStudentsWithLastMessages = await Promise.all(
                aStudents.map(async (oStudent) => {
                    const sRoomName = `teacher_${sTeacherId}_student_${oStudent.id}`;
                    try {
                        const oMsgRes = await fetch(`http://192.168.100.4:3000/chat/rooms/${sRoomName}`, {
                            headers: { "Authorization": `Bearer ${sToken}` },
                        });

                        console.log(`Fetching messages for room: ${sRoomName}`);
                        const oMsgData = await oMsgRes.json();
                        //console.log(`Message data for ${sRoomName}:`, oMsgData);
                        return {
                            ...oStudent,
                            lastMessage: oMsgData?.lastMessage || "A diákod",
                        };
                    } catch {
                        return {
                            ...oStudent,
                            lastMessage: "A diákod",
                        };
                    }
                })
            );

            vSetStudents(aStudentsWithLastMessages);
        } catch (oError) {
            console.error("Error fetching students or messages:", oError);
        }
    };

    useEffect(() => {
        if (sTeacherId) {
            fFetchUsers();
        }
    }, [sTeacherId]);

    const vChats = [
        { id: 'broadcast', name: 'Tanári csevegő', lastMessage: 'Csoportos csevegés' },
        ...vStudents.map(oStudent => ({
            id: oStudent.id,
            name: `${oStudent.firstName} ${oStudent.lastName}`,
            lastMessage: oStudent.lastMessage || "Nincs üzenet",
        }))
    ];

    useEffect(() => {
        const loadStudentId = async () => {
            try {
                const id = await AsyncStorage.getItem("studentId");
                if (id !== null) {
                    setSStudentId(id);
                }
            } catch (error) {
                console.log("Hiba a studentId beolvasásakor:", error);
            }
        };

        loadStudentId();
    }, []);

    const fRenderChatItem = ({ item }) => {
        const isBroadcast = item.id === 'broadcast';

        if (!sTeacherId) return null;

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() =>
                    isBroadcast
                        ? router.replace(`/(auth)/LoggedInTeacher?room=${item.id}`)
                        : router.replace(`/(auth)/ChatPageGeneral?teacherId=${sTeacherId}&studentId=${item.id}`)
                }
            >
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>BrainBoost - Tanár csevegő</Text>
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
            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2025 Tanár-diák chat app</Text>
                <Text style={styles.footerLink}>Minden jog fenntartva.</Text>
            </View>
        </SafeAreaView>
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
});

export default TeacherMainPage;
