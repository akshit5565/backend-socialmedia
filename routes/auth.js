const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    //generating new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //craete new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });


    //save new user and return response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // !user && res.status(404).json("user not found");
    if(!user){
      return res.status(404).json("user not found");
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    // !validPassword && res.status(400).json("wrong password") 
    if(!validPassword){
      return res.status(400).json("wrong password")
    }
    
    return res.status(200).json(user)
  } catch (err) {
    res.status(400).json(err)
    // return res.status(500).send({ error: [{ msg: error }] });
  }
});

module.exports = router;
