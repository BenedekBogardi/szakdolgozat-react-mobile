import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, View } from "react-native";

function checkLogin() {

}

export default function Index() {
  const [text, onChangeText] = React.useState('');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 25,
            textAlign: "center"
          }}
        >Insert Webpage Name{"\n"} Bejelentkezés{"\n"}{"\n"}</Text>
        <Text
          style={{
            fontSize: 15
          }}
        >E-mail cím:</Text>
        <TextInput
          /*accessible={true}
          accessibilityActions={[
            {name: 'cut', label: 'cut'},
            {name: 'copy', label: 'copy'},
            {name: 'paste', label: 'paste'}
          ]}
          onAccessibilityAction={event => {
            switch (event.nativeEvent.actionName) {
              case 'cut':
                Alert.alert('Alert', 'cut action success');
                break;
              case 'copy':
                Alert.alert('Alert', 'copy action success');
                break;
              case 'paste':
                Alert.alert('Alert', 'paste action success');
                break;
            }
          }}*/
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 2,
            width: 200
          }}
          onChangeText={onChangeText}
          placeholder='Adja meg az e-mail címét!'
          autoComplete='email'
        />
        <Text
          style={{
            fontSize: 15
          }}
        >Jelszó:</Text>
        <TextInput
          secureTextEntry={!showPassword}
          value={password}
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 2,
            width: 200
          }}
          onChangeText={setPassword}
          placeholder='Adja meg a jelszavát!'
          placeholderTextColor="#aaa"
        />
        <MaterialCommunityIcons
          name={showPassword ? 'eye-off' : 'eye'}
          size={24}
          color="#aaa"
          onPress={toggleShowPassword}
        />
        <Text>{"\n"}</Text>
        <Button
          onPress={checkLogin}
          title="Bejelentkezés"
          accessibilityLabel="Nyomja meg a bejelentkezéshez"
          color="#0ead16"
        >
        </Button>
      </View>
    </ScrollView>
  );
}