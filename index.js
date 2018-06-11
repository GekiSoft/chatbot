'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({
    extended : false
}))

app.use(bodyParser.json())


app.get('/', function(req, res) {
    res.send("Hi, I am a chatbot")
})

app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === "gekimon") {
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong token")
})

let PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN


app.post('/webhook/', (req, res) => {
    let body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);
        })
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
})

function sendText(sender, text) {
    let messageData = {text : text}
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs : {access_token : PAGE_ACCESS_TOKEN},
        method : "POST",
        json : {
            recipient : {id : sender},
            message : messageData
        }
    }, function(error, response, body) {
        if (error) {
            console.log("sending error")
        } else if (response.body.error) {
            console.log("response body error")
        }
    })
}


app.listen(app.get('port'), function() {
    console.log("running : port")
})