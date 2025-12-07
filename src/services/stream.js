import ApiService from './api';
import { API_CONFIG } from '../constants/config';

class StreamService extends ApiService {
    constructor() {
        super(API_CONFIG.GIFTED_BASE);
    }

    async getSources(id, season = null, episode = null) {
        const endpoint = `/sources/${id}`;
        const params = season && episode ? { season, episode } : {};
        return this.get(endpoint, params);
    }

    async search(query) {
        return this.get(`/search/${encodeURIComponent(query)}`);
    }

    async getInfo(id) {
        return this.get(`/info/${id}`);
    }
}

export const streamService = new StreamService();
