import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" // server se browser ki cookie access kr pau aur set kr pau basically crud operations krne ke liye cookie par
import userRoutes from "./routes/user.routes.js"
import jwt from "jsonwebtoken";
import reportRoutes from "./routes/report.routes.js"


const app = express()

app.use(cors({      // app.use is used for middleware in express ...cors is a middleware that allows cross-origin requests
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))  // it is used to parse the incoming request body in a middleware before your handlers, available under the req.body property. It is based on body-parser. The limit option is used to specify the maximum size of the request body that can be parsed. In this case, it is set to 16kb.
app.use(express.urlencoded({extended: true, limit:"16kb"}))  // it is used to parse the incoming request body in a middleware before your handlers, available under the req.body property. It is based on body-parser. The extended option is used to specify whether to use the querystring library (when false) or the qs library (when true) for parsing the URL-encoded data. The qs library allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded.
app.use(express.static("public"))  // it is used to serve static files such as images, CSS files, and JavaScript files. The "public" argument specifies the directory from which to serve the static assets. In this case, it will serve files from the "public" directory in the root of your project.
app.use(cookieParser())  

app.get("/", (req, res) => {
    res.send("API working")
})

app.use("/api", userRoutes);


app.get("/get-token", (req, res) => {
  const token = jwt.sign(
    { _id: "123", email: "test@gmail.com" },
    process.env.ACCESS_TOKEN_SECRET || "aditi1234",
    { expiresIn: "1d" }
  );

  res.json({ token });
});

app.use("/api/reports", reportRoutes);

export { app }