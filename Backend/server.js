import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import postsRoute from "./routes/posts.routes.js";
import usersRoute from "./routes/users.routes.js";
import messageRoute from "./routes/messages.route.js"
import { app, server, io } from "./socket/socket.js"




app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(express.static("uploads"));



const DB_URL = process.env.ATLASDB_URL;



async function main() {

    await mongoose.connect(DB_URL)

}
main().then(() => {
    console.log("DB Conneted successfully");
})
    .catch(err => {
        console.log(err);
    })



app.use(usersRoute);
app.use("/posts", postsRoute);
app.use(messageRoute);

app.get("/home", (req, res) => {
    res.send("This is home page")
})


app.use((err, req, res, next) => {
    if (err) {
        res.status(500).send(err.message);

    }
    next();
})



server.listen(8000, () => {
    console.log("app is listening on port 8000");
})