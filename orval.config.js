import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const API = process.env.VITE_SWAGGER_API_URL;

module.exports = {
  auth: {
    input: `${API}/api/auth/openapi.json`,
    output: {
      target: './src/api/auth/auth.ts',
      client: 'axios'
    }
  },

  users: {
    input: `${API}/api/users/openapi.json`,
    output: {
      target: './src/api/users/users.ts',
      client: 'axios'
    }
  }
};
