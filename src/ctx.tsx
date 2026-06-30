
import {useEffect, createContext, type PropsWithChildren, useState, useContext} from 'react'


import { onAuthStateChanged, signOut as FirebaseSignOut, signInWithEmailAndPassword, User } from 'firebase/auth';
import {auth} from './config/firebaseConfig';

const AuthContext = createContext<{
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    session: User | null; // Changed from string | null to User | null
    isLoading: boolean;
} | null>(null);


// Usee this hook to access the user info

export function useSession() {
    const value = useContext(AuthContext);
    if (value === null){
        throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
    return value;
}

export function SessionProvider({children}: PropsWithChildren){
    const [user, setUser] = useState<User | null>(null) ;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This listener automatically fires when the app loads
        // and checks if a user is already signed in (persistence)
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setIsLoading(false);
        });
        return unsubscribe;
    }, []);


    
    
    return (
        <AuthContext.Provider
            value={{
                signIn : async (email: string, password: string)=> {
                    {/** Perform sign-in logic here */}

                    await signInWithEmailAndPassword(auth, email, password);


                },

                signOut: () => {
                    // Perform sign-out logic here
                    FirebaseSignOut(auth);
                },
                session: user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
