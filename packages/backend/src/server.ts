import './env.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';

import authRouter from './auth/auth.routes.js';

const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:4200').split(',');
const app = express();
const httpServer = http.createServer(app);

const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/api', authRouter);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', server: 'running' });
});

async function startServer() {
    httpServer.listen(PORT, () => {
        console.log(`📡 Server listening on port ${PORT}`);
    });
}

await startServer();