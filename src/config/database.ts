import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    const { NAME_USER, NAME_PASSWORD, DB_NAME } = process.env;

    // Validate environment variables exist
    if (!NAME_USER || !NAME_PASSWORD || !DB_NAME) {
      throw new Error(
        "Missing required environment variables: NAME_USER, NAME_PASSWORD, or DB_NAME",
      );
    }

    const mongoUrl = `mongodb://${NAME_USER}:${NAME_PASSWORD}@ac-392jh9b-shard-00-00.jwfrose.mongodb.net:27017,ac-392jh9b-shard-00-01.jwfrose.mongodb.net:27017,ac-392jh9b-shard-00-02.jwfrose.mongodb.net:27017/${DB_NAME}?replicaSet=atlas-cs71q5-shard-0&ssl=true&authSource=admin`;

    await connect(mongoUrl);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process with an error code
  }
};
