"use client"

import { AuthProvider } from "@/contexts/AuthContext"
import { UserDataProvider } from "@/contexts/UserDataContext"

/**
 * App Providers
 * 
 * This component wraps all client-side providers in the correct order.
 * Order matters - AuthProvider must be outside UserDataProvider since
 * UserDataProvider depends on the auth state.
 */

interface ProvidersProps {
    children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <AuthProvider>
            <UserDataProvider>
                {children}
            </UserDataProvider>
        </AuthProvider>
    )
}
