import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack>
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }}/>
        <Stack.Screen name="LoggedIn" options={{ headerShown: false }}/>
        </Stack>
    )
}