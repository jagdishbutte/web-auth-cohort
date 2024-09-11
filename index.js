const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = "jadukali123";
const users = [];
app.use(express.json());

function auth(req, res, next){
    const token = req.headers.token;
    const decodeData = jwt.verify(token, JWT_SECRET);

    if(decodeData.username){
        req.username = decodeData.username;
        next();
    }
    else{
        res.json({
            message:"You are not authenticates"
        })
    }
}

function logger(req, res, next){
    console.log(req.method + " request recieved!");
    next();
}

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/public/index.html");
});

app.post('/signup', logger, (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    
    users.push({
        username,
        password
    });

    res.json({
        message: "You are signed up!"
    });

    console.log(users);
});

app.post('/signin', logger, (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;

    for(let i = 0; i<users.length; i++){
        if(users[i].username === username && users[i].password === password){
            foundUser = users[i];
        }
    }

    if(!foundUser){
        res.json({
            message: "Credential are incorrect..."
        })
        return
    }

    else{
        const token = jwt.sign({
            username: foundUser.username
        }, JWT_SECRET);

        res.json({
            token: token
        });
    }
});

app.get('/me', logger, auth, (req, res) =>{

        let foundUser = null;

        for(let i = 0; i<users.length; i++){
            if(users[i].username === req.username){
                foundUser = users[i];
            }
        }

        res.json({
            username: foundUser.username,
            password: foundUser.password
        });
});

app.listen(4000);
