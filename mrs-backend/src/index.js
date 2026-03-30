//require('dotenv').config({path: './.env'}); purana tarika h dotenv ko import karne ka
import dotenv from "dotenv";
import connectDB from "./db/indexdb.js";
import { app } from "./app.js"


dotenv.config({path: './.env'});



connectDB()
.then(() => {                                                                                                      // .then is use to handle the eventual results of promise  ...so agar db connection successful hota h to ye code execute hoga
    app.listen(process.env.PORT || 8000, () =>{
        console.log(` server is running at port: ${process.env.PORT}`);
    })
    app.on("error", (error) =>{
            console.log("ERRR:", error);
            throw error
        })
})
.catch((err) => {
    console.log("Mongo db connection failed !!!", err);
})










/*
import express from "express";
const app = express();

( async  () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (error) =>{
            console.log("ERRR:", error);
            throw error
        })

        app.listen(process.env.PORT,() => {
            console.log(`App is listening on port $
                {process.env.PORT}`);
        })
    } catch (err){
        console.log("ERROR: ", err);
        throw err;
    }  
}) ()  */          