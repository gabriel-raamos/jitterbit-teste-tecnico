import 'dotenv/config';
import app from './app.js'
import db from './config/database.js'
import express from 'express';

const app = express();
app.use(express.json());

const port = process.env.PORT;
