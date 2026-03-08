import route from './routes/auth.js'
import express from "express"
import connectToMongo from './db.js'
import dotenv from 'dotenv'
import path from 'path';  

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly point to backend .env
dotenv.config({ path: path.join(__dirname, '.env') });
connectToMongo();

const app = express()
const port = process.env.port;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/auth', route )

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})