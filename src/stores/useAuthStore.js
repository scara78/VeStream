import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            userProfile: null,
            setUserProfile: (profile) => set({ userProfile: profile }),
            logout: () => set({ userProfile: null }),
        }),
        {
            name: 'vestream_profile',
        }
    )
);
