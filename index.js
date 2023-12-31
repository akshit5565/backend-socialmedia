const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const useRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postsRoute = require("./routes/posts")
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const router = express.Router();

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => {
  console.log("Mongo connected!");
})
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

const storage = multer.diskStorage({
  destination: (req,file, cb) => {
    cb(null, "public/images");
  },
  filename: (req,file,cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer(storage);
app.post("/api/upload", upload.single("file"), (req,res) => {
  try{
    return res.status(200).json("File uploaded successfully");
  } catch(err){
    console.log(err);
  }
})

app.use("/api/users", useRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts" , postsRoute);


app.listen(4000, () => {
  console.log("Backend server is running");
});
