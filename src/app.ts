import cookieParser from 'cookie-parser';
import express from 'express';

export const app = express();

app.use(cookieParser());
app.use(express.static('public'));
