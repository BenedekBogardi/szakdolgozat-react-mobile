import { ScrollView, Text } from "react-native";
import { usePathname } from "expo-router";
import { useEffect } from "react";
import io from 'socket.io-client'

const socket = io.connect("http://localhost:3000");

export default function LoggedInScreen() {
    const path = usePathname() 
    useEffect(() => {
    console.log(path)
    }, [])
    return (
        <ScrollView>
            <Text>Sikerült Tanár</Text>
        </ScrollView>
    )
}