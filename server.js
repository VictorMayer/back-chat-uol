import express from 'express'
import cors from 'cors'
import dayjs from 'dayjs';

const server = express();
server.use(express.json());
server.use(cors());

const messages = []

const participants = []

console.log("server started on local port 4000");

server.post("/participants", (req, res)=>{
    const newParticipant = req.body;
    if(newParticipant.name.length===0){
        res.status(400).send({
            error: 'You must enter an valid username'
        });
        return;
    }
    participants.forEach(p => {
        if(p.name === newParticipant.name){
            res.status(400).send({
                error: 'Username already in use'
            });
        }
    });
    newParticipant.lastStatus = Date.now();
    
    participants.push(newParticipant);

    const time = dayjs().format('HH:mm:ss');    
    const welcomeMsg = {from: newParticipant.name, to: 'Todos', text: 'entra na sala...', type:'status', time:time}
    messages.push(welcomeMsg);

    res.status(200).send();
    console.log("gravando novo participante!")
})

server.get("/participants", (req, res) =>{
    res.status(200).send(participants);
})

server.post("/messages", (req, res) => {
    const newMsg = req.body;
    const from = req.headers.user;
    newMsg.from = from;
    newMsg.time = dayjs().format('HH:mm:ss');
    res.status(200).send();
})

server.get("/messages", (req, res) => {
    const queryObj = req.query;
    if(messages.length >= queryObj.limit){
        const showMsg = messages.splice(messages.length-queryObj.limit , queryObj.limit);
        res.status(200).send(showMsg);
    }
    res.status(200).send(messages);
})

server.listen(4000);