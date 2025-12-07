/* eslint-disable no-undef */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ApiService from './api';

describe('ApiService', () => {
    let api;

    beforeEach(() => {
        vi.resetAllMocks();
        global.fetch = vi.fn();
        api = new ApiService('https://api.example.com');
    });

    it('should fetch data successfully', async () => {
        const mockData = { results: [] };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const data = await api.get('/test');
        expect(data).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('https://api.example.com/test'), expect.any(Object));
    });

    it('should handle errors gracefully', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error'
        });

        await expect(api.get('/test')).rejects.toThrow('API Error: 500 Internal Server Error');
    });
});
