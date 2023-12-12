import mongoose from "mongoose";
import config from "config";

const dbURL : string = config.get("dbURL");

const connectToMongo = async () => {
    try {
        console.log('Connecting to database...');
        // connect to database
        await mongoose.connect(dbURL);
        console.log("Connected to database successfully.");
    } catch (error) {
        console.error(`Error connecting to the database: ${error}`);
    }
}

export default connectToMongo;
