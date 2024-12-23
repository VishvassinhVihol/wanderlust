const express = require('express')
const app = express()
 
const session = require('express-session')

 
app.use(session({
    secret:'mysupersecretstring',
    resave:false,
    saveUninitialized:true
}));

app.listen(3000,() => {
   
    
})

app.get('/',(req,res) => {
    res.send('i am root')
})

app.get('/session',(req,res) => {
    req.session.name = 'vishu'
    res.send('session build')
})

app.get('/greet',(req,res) => {
    let name = req.session.name
    res.send(`hello ${name}`)
})