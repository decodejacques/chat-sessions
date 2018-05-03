const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.raw({ type: "*/*" }))

let serverState = {
    msgs: []
}

let sessionInfo = {}

function generateRandomID() {
    return '' + Math.floor(Math.random() * 10000000)
}

app.post('/sendMsg', (req, res) => {
    let parsed = JSON.parse(req.body.toString());
    let sessionID = parsed.sessionID;
    let info = sessionInfo[sessionID];
    let usr = info.username;
    if (usr) {
        let newMsg = { username: usr, contents: parsed.contents }
        serverState.msgs = serverState.msgs.concat(newMsg);
        res.send("success")
    } else {
        res.send("failure");
    }
})

app.get('/messages', (req, res) => {
    res.send(JSON.stringify(serverState.msgs))
})
app.post('/login', (req, res) => {
    let body = req.body.toString();
    let parsed = JSON.parse(body);
    let usr = parsed.username;
    let pwd = parsed.password;
    if ((usr == 'bob' && pwd == 'pwd123')
        || (usr == 'sue' && pwd == 'pwd456')) {
        let sessionID = generateRandomID();
        sessionInfo[sessionID] = { username: usr };
        res.send(JSON.stringify({ sessionID: sessionID }));
    } else {
        res.send(JSON.stringify("failure"));
    }
})

app.listen(4000);