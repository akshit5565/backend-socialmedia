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


dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => {
  console.log("Mongo connected!");
})

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

app.use("/api/users", useRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts" , postsRoute);


app.listen(4000, () => {
  console.log("Backend server is running");
});
