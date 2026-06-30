import * as Device from 'expo-device';
import { useEffect, useState } from "react";
import { useSession } from "@/ctx";
import { Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {  router } from "expo-router";

import { AnimatedIcon } from '@/components/animated-icon';
import {Text, ActivityIndicator, TextInput, Pressable} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import {MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Ionicons } from '@expo/vector-icons';


// ------ Validation Helpers --------------------
function validateEmail(value: string): string | null {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Enter a valid email address";
    return null;
}

function validatePassword(value: string): string | null {
    if (!value) return "Password is required.";
    if(value.length < 6) return "Password must be at least 6 characters";
    return null;
}

// ------ Labled Input -----------------
type LabeledInputProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    keyboardType?: "default" | "email-address";
    error?: string | null;
    onBlur?: () => void;
    rightElement?: React.ReactNode;
    inputStyle: object;
    theme: ReturnType<typeof useTheme>;
}

function LabeledInput({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    autoCapitalize = "none",
    keyboardType = "default",
    error,
    onBlur,
    rightElement,
    inputStyle,
    theme,
}: LabeledInputProps) {
    return (
        <ThemedView style={{ marginBottom: Spacing.two, width: 320 }}>
            <ThemedText
                type="smallBold"
                style={{ marginBottom: 4, color: theme.text }}
            >
                {label}
            </ThemedText>
 
            <ThemedView
                style={[
                    inputStyle,
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: error ? "#E53E3E" : theme.borderColorPrimary,
                    },
                ]}
            >
                <TextInput
                    style={{ flex: 1, color: theme.text, fontSize: 15 }}
                    placeholder={placeholder}
                    placeholderTextColor={theme.textSecondary}
                    onChangeText={onChangeText}
                    value={value}
                    autoCapitalize={autoCapitalize}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    onBlur={onBlur}
                    autoCorrect={false}
                />
                {rightElement}
            </ThemedView>
 
            {error ? (
                <ThemedText
                    type="small"
                    style={{ color: "#E53E3E", marginTop: 4 }}
                >
                    {error}
                </ThemedText>
            ) : null}
        </ThemedView>
    );
}

export default function SignIn () {

    const theme = useTheme();
    
    const {signIn, session} = useSession();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    // Navigate to the main screen when session is actually set
    useEffect(() => {
        if (!isLoading && session){
            router.replace("/(app)")
        }
    }, [session, isLoading])

    const handleSubmit = () => {

        // Validate both fields before submitting
        const eErr = validateEmail(email);
        const pErr = validatePassword(password);
        setEmailError(eErr);
        setPasswordError(pErr);

        if (eErr || pErr) return;

        setIsLoading(true)
        setAuthError(null);


        try {
            signIn(email, password);
        }catch(err: any){
            // Firebase error codes → friendly messages
            const code = err?.code ?? "";
            if (
                code === "auth/user-not-found" ||
                code === "auth/wrong-password" ||
                code === "auth/invalid-credential"
            ) {
                setAuthError("Incorrect email or password. Try again.");
            } else if (code === "auth/too-many-requests") {
                setAuthError("Too many attempts. Wait a moment and try again.");
            } else if (code === "auth/network-request-failed") {
                setAuthError("No connection. Check your network and try again.");
            } else {
                setAuthError("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
        

    }

    const inputFieldBase = {
        borderWidth: 2,
        borderRadius: 10,
        paddingVertical: Platform.OS === "ios" ? Spacing.one  : Spacing.one,
        paddingHorizontal: Spacing.two,
        borderColor: theme.borderColorPrimary,
        backgroundColor: '#ffffff',
    };

    
    const dynamicStyles = {
        button: {
            borderRadius: 10,
            width: 320,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            flexDirection: "row" as const,
            backgroundColor: isLoading
                ? theme.buttonBackground + "99" // dim while loading
                : theme.buttonBackground,
            paddingVertical: Spacing.two + 4,
            marginTop: Spacing.two,
            opacity: isLoading ? 0.85 : 1,
        },
        buttonLabel: {
            color: theme.buttonText,
            fontSize: 16,
            fontWeight: "600" as const,
        },
    };
    
    return (

        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.SafeArea}>
                <ThemedView style={styles.heroSection}>
                    <AnimatedIcon />
                    <ThemedText type="subtitle" style={styles.title}>
                        Welcome Back
                    </ThemedText>
                    <ThemedText type="small" style={[{color: theme.textSecondary}]}>
                        Enter coordinates to log in to your soccer profile.
                    </ThemedText>


                    {/** Global auth error */}
                    {authError ? (
                        <ThemedView
                            style={{
                                backgroundColor: "#FFF5F5",
                                borderColor: "#FC8181",
                                borderWidth: 1,
                                borderRadius: 8,
                                padding: Spacing.two,
                                width: 320,
                                marginBottom: Spacing.two
                            }}
                        >

                        </ThemedView>
                    ): null}

                    <ThemedView style={styles.inputSection}>
                        {/* Email */}
                        <LabeledInput
                            label="Email"
                            value={email}
                            onChangeText={(t) => {
                                setEmail(t);
                                if (emailError) setEmailError(validateEmail(t));
                            }}
                            placeholder="you@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={emailError}
                            onBlur={() => setEmailError(validateEmail(email))}
                            inputStyle={inputFieldBase}
                            theme={theme}
                        />
 
                        {/* Password */}
                        <LabeledInput
                            label="Password"
                            value={password}
                            onChangeText={(t) => {
                                setPassword(t);
                                if (passwordError) setPasswordError(validatePassword(t));
                            }}
                            placeholder="••••••••"
                            secureTextEntry={!showPassword}
                            error={passwordError}
                            onBlur={() => setPasswordError(validatePassword(password))}
                            inputStyle={inputFieldBase}
                            theme={theme}
                            rightElement={
                                <Pressable
                                    onPress={() => setShowPassword((v) => !v)}
                                    hitSlop={8}
                                    accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                                >
                                     <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color={theme.textSecondary}
                                    />
                                </Pressable>
                            }
                        />
 
                        {/* Forgot password */}
                        <Pressable
                            onPress={() => console.log("Forgot Password clicked")}
                            hitSlop={8}
                            style={{ alignSelf: "flex-end", marginBottom: Spacing.two }}
                        >
                            <ThemedText
                                type="small"
                                style={{ color: theme.textLink }}
                            >
                                Forgot password?
                            </ThemedText>
                        </Pressable>
                        
                                
                        {/* Sign In button */}
                        <Pressable
                            style={dynamicStyles.button}
                            onPress={handleSubmit}
                            disabled={isLoading}
                            accessibilityRole="button"
                            accessibilityLabel="Sign in"
                            accessibilityState={{ busy: isLoading }}
                        >
                            {isLoading ? (
                                <ActivityIndicator
                                    size="small"
                                    color={theme.buttonText}
                                />
                            ) : (
                                <Text style={dynamicStyles.buttonLabel}>Sign In</Text>
                            )}
                        </Pressable>
                    </ThemedView>
                    
                </ThemedView>

                
            </SafeAreaView>
        </ThemedView>
        
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row"
    },
    SafeArea: {
        flex: 1,
        paddingHorizontal: Spacing.half,
        gap: Spacing.half,
        paddingBottom: Spacing.half,
        maxWidth: MaxContentWidth + 100
    },
    heroSection: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: Spacing.two,
        gap: Spacing.one
    },
    title: {
        textAlign: 'center'
    },
    inputSection: {
        marginTop: Spacing.one,
        
    },
    
})