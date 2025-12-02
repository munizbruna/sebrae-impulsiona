import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://localhost:7186/api', // Ajustar porta do launchSettings.json
    headers: {
        'Content-Type': 'application/json'
    }
});