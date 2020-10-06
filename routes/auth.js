const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../keys');
const reqLogin = require('../middleware/reqLogin')
// router.get('/', (req, res) => {
//     res.send("hello first get")
// })*


// router.get('/protected', reqLogin,(req, res) => {
//     res.send("hello user  protected")
// })

router.post('/signup', (req, res) => {
    const { name, email, password,pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "this mail already existe" })
            }
            bcrypt.hash(password, 10)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic
                    })
                    user.save()
                        .then(user => { res.json({ message: "saved successflly" }) })
                        .catch(err => { console.log(err) })
                })
        })
        .catch(err => {
            console.log(err)
        })
})


router.post('/Login', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "please add email or password" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email or password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({ message: "Successflly signed in :) " })

                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                       const {_id,name,email,pic}=savedUser
                        res.json({ token,user:{_id,name,email,pic} })
                    }
                    else {
                        return res.status(422).json({ error: "Invalid Email or password" })
                    }
                })
                .catch(err => { console.log(err) })
        })
})

module.exports = router