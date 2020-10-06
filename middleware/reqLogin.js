const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    //authorization === root  jsonwebtoken
    if (!authorization) {
        return res.status(401).json({ error: "you must be logged in " })
    }
    const token = authorization.replace("root ", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "you must be logged in " })
        }
        const { _id } = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
            next()
        })
    })
}

// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjcyNTlmY2E4MDBiNzI4ZjhiMjE5MTIiLCJpYXQiOjE2MDEzMzMyNDZ9.2ysfs58aHWDcsxairFxheJZN0QJhH0rtOUFT5ME1OnI"
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjcyZWMwOTg0ODJkNzFhNDhmOWQyM2EiLCJpYXQiOjE2MDEzNjcwNTh9.6prdANtDwtiyZsU11FQkhAKnDQI1fUFrqi8IUO5_FEE