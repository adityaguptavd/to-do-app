import express, { Express } from "express";
import config from "config";
import cors from "cors";
import connectToMongo from "./db/db";
import auth from "./routes/auth";
import tasks from "./routes/tasks";

// Configure the default port and hostname
const port: number = config.get("port") as number;
const host: string = config.get("host") as string;

const app: Express = express();

// Cors object for configuration setup
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus: 200
}

// Middleware to cors configuration to every request from localhost:3000
app.use(cors(corsOptions));

// Middleware for parsing body content
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Available Routes
app.use('/api/auth', auth);
app.use('/api/task', tasks);

app.listen(port, host, async () => {
    console.log(`Server is running on http://${host}:${port}`);
    // connect to databsae
    connectToMongo();
});