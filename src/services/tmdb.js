import ApiService from './api';
import { API_CONFIG } from '../constants/config';

class TmdbService extends ApiService {
    constructor() {
        super(API_CONFIG.TMDB_BASE);
        this.apiKey = API_CONFIG.TMDB_KEY;
    }

    async getTrending(timeWindow = 'day') {
        return this.get(`/trending/all/${timeWindow}`, { api_key: this.apiKey });
    }

    async getTopRated() {
        return this.get('/movie/top_rated', { api_key: this.apiKey });
    }

    async getDiscover(params = {}) {
        return this.get('/discover/movie', { api_key: this.apiKey, ...params });
    }

    async getVideos(mediaType, id) {
        return this.get(`/${mediaType}/${id}/videos`, { api_key: this.apiKey });
    }
}

export const tmdbService = new TmdbService();
