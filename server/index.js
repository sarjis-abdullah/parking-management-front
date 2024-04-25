import { Nitro } from "nitropack";
import mongoose from "mongoose";

export default async () => {
  console.log("Nitro is connected");
  mongoose
    .connect("mongodb://localhost:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "test-db",
    })
    .then((result) => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log("Database error", err);
    });
};
