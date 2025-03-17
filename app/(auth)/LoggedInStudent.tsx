import { ScrollView, Text } from "react-native";
import { usePathname } from "expo-router";
import { useEffect } from "react";

export default function LoggedInScreen() {
    const path = usePathname() 
    useEffect(() => {
    console.log(path)
    }, [])
    return (
        <ScrollView>
            <Text>Sikerült</Text>
        </ScrollView>
    )
}