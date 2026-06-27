import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SessionProvider , useSession} from '@/ctx';
import { SplashScreenController } from '@/splash';
import { HeaderTitle } from 'expo-router/build/react-navigation';


export default function Root() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <SplashScreenController />
        <RootNavigator /> 
      </SessionProvider>
    </ThemeProvider>
  );
}

// Create a new component taht can access the SessionProvider context later.
function RootNavigator() {

  const context = useSession();

  // This satifies TypeScript: if context is null, we return null or a loading state
  if(!context){
    return null;
  }

  const {session, isLoading} = context;

  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name='(app)' />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name='signin' />
      </Stack.Protected>
    </Stack>
  )
}
