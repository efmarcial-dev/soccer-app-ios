import { useEffect, useState } from "react";
import { router } from "expo-router";
import {Text, View, TouchableOpacity, TextInput, Button} from 'react-native';

import { useSession } from "@/ctx";

export default function SignIn () {
    const {signIn, session} = useSession();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Navigate to the main screen when session is actually set
    useEffect(() => {
        if (session){
            router.replace("/(app)")
        }
    }, [session])

    const handleSubmit = () => {
        signIn(email, password);

    }
    
    return (

        <View style={{ padding: 20, marginTop: 50 }}>
            <TextInput placeholder="Email" onChangeText={setEmail} value={email} autoCapitalize="none" />
            <TextInput placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />
            <Button title="Sign In" onPress={handleSubmit} />
        </View>
        
    )
}