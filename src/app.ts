import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import env from './env';

export const app = express();

// TODO Origin policy
app.use(cors({ credentials: true, origin }));

// app.use(cors({ credentials: true }));
app.use(express.json());
app.use(cookieParser());
