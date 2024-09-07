import express from "express"
import cors from "cors"
import connectToMongo from "./db.js"
import user from './routes/user.js'
import post from './routes/post.js'
import message from './routes/message.js'
import cookieParser from 'cookie-parser'
import { app, server } from './Socket/Socket.js'
import dotenv from 'dotenv'
import path from 'path'
const port = 8000;

dotenv.config();
const corsOptions = {
    origin: [
        '*',
        'http://localhost:5173',
        // 'https://vgc1848d-5173.inc1.devtunnels.ms'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
const __dirname = path.resolve();
app.use(cors(corsOptions));

connectToMongo();
app.use(express.json());
app.use(cookieParser());

app.use('/api', user);
app.use('/api', post);
app.use('/api', message);
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
