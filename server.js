require('dotenv').config()

const express = require('express')
const routers = require('./routers/rotas.js')

const app = express()
const PORT = process.env.PORT


app.use(express.json())

app.use(routers)

app.listen(PORT, () =>{
    console.log('Server subiu!')
})