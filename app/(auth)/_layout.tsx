import { Stack } from "expo-router";
import React from "react";


export default function AuthLayout() {
    return (
        <Stack>
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }}/>
        <Stack.Screen name="LoggedInStudent" options={{ headerShown: false }}/>
        <Stack.Screen name="LoggedInTeacher" options={{ headerShown: false }}/>
        <Stack.Screen name="TeacherMainPage" options={{ headerShown: false }}/>
        <Stack.Screen name="StudentMainPage" options={{ headerShown: false }}/>
        <Stack.Screen name="ProfilePage" options={{ headerShown: false }}/>
        <Stack.Screen name="ChatPageGeneral" options={{ headerShown: false }}/>
        </Stack>
    )
}