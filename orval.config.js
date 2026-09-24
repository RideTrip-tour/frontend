import dotenv from 'dotenv';
import { defineConfig } from 'orval';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

const API = process.env.VITE_SWAGGER_API_URL;

if (!API) {
  throw new Error('Не задан VITE_SWAGGER_API_URL');
}

export default defineConfig({
  auth: {
    input: `${API}/api/auth/openapi.json`,
    output: {
      target: './src/api/auth/auth.ts',
      client: 'axios'
    }
  },

  locations: {
    input: `${API}/api/locations/openapi.json`,
    output: {
      target: './src/api/locations/locations.ts',
      client: 'axios'
    }
  },

  profile: {
    input: `${API}/api/profile/openapi.json`,
    output: {
      target: './src/api/profile/profile.ts',
      client: 'axios'
    }
  }
});