const express = require('express');
const app = express();
const mongoose = require('mongoose')
const PORT = 5000
const { MONGOURI } = require('./keys')


// mongoose.model("User")


// const customMiddleware = (req, res, next) => {
//     console.log('middelware executted !!')
//     next()
// }

//conection DB
mongoose.connect(MONGOURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection.on("connected", () => {


    console.log('connected to database...')
})
mongoose.connection.on("error", (err) => {
    console.log('error to connected to database...', err)
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

// mongoose.connection.on('connected',()=>{
//     console.log("conneted to mongo yeahh")
// })
// mongoose.connection.on('error',(err)=>{
//     console.log("err connecting",err)
// })



// app.use(customMiddleware)

app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/about', (req, res) => {
    console.log("about")
    res.send('about page')
})

app.listen(PORT, () => {
    console.log(`Server Suning in PORT ${PORT}`)
})