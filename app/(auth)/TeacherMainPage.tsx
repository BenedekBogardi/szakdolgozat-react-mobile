import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';

const chats = [
    { id: '1', name: 'Tanári csevegő', lastMessage: 'Nem működik még' },
    { id: '2', name: 'Egyik diák', lastMessage: 'Nem működik még' },
    { id: '3', name: 'Másik diák', lastMessage: 'Nem működik még' },
];
const routes = [
    { id: '1', route: `/LoggedInTeacher`},
    { id: '2', route: "/auth"}
] as const;
const TeacherMainPage = () => {
    const selectedRoute = routes.find(r => r.id === '1')?.route;
    console.log(selectedRoute)
    const renderChatItem = ({ item }) => (
        <TouchableOpacity style={styles.chatItem} onPress={() => { router.replace(selectedRoute) }}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Tanár-diák chat app</Text>
                <TouchableOpacity style={styles.profileButton} onPress={() => { /* Profilra vezető link */ }}>
                    <Image
                        source={ require('./img/profile.png') }
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
            </View>

            <FlatList
                data={chats}
                renderItem={renderChatItem}
                keyExtractor={(item) => item.id}
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
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileButton: {
        padding: 2,
        backgroundColor: '#ffffff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileButtonText: {
        color: '#6200EE',
        fontSize: 16,
    },
    chatList: {
        marginTop: 10,
        paddingHorizontal: 16,
    },
    chatItem: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
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
    },
    lastMessage: {
        fontSize: 14,
        color: 'gray',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});

export default TeacherMainPage;
