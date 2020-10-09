const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    craft: {
        type: String,
    },
    PhoneNumber: {
        type: String,
    },

    pic: {
        type: String,
        default:"https://res.cloudinary.com/daardfpre/image/upload/v1601670355/triken160800029_siudkr.jpg"
    },

})
mongoose.model('User', userSchema);