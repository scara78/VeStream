import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../stores/useAuthStore';

describe('useAuthStore', () => {
    beforeEach(() => {
        const { result } = renderHook(() => useAuthStore());
        act(() => {
            result.current.logout();
        });
    });

    it('should set user profile', () => {
        const { result } = renderHook(() => useAuthStore());
        const profile = { name: 'Test User', avatar: 'test.jpg' };

        act(() => {
            result.current.setUserProfile(profile);
        });

        expect(result.current.userProfile).toEqual(profile);
    });

    it('should logout', () => {
        const { result } = renderHook(() => useAuthStore());
        const profile = { name: 'Test User', avatar: 'test.jpg' };

        act(() => {
            result.current.setUserProfile(profile);
            result.current.logout();
        });

        expect(result.current.userProfile).toBeNull();
    });
});
