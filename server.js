const express = require('express');
const app = express();
const router = express.Router();
const http = require('http').Server(app);
const port = process.env.PORT || 80;
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path');
const routes = require('./server/app/api')(router);
const io = require('socket.io')(http);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/api', routes);

app.get('*', (req, res)=> res.sendFile(path.join(__dirname + '/client/public/index.html')));

io.on('connection', (socket)=>{
    console.log('User connected');
    socket.on('chat', (data)=>{
        io.emit('chat', data)
    })
    socket.on('disconnect', ()=>{
        console.log('User disconnected')
    })
})

mongoose.connect('mongodb://localhost:27017/react-chat', err => err?console.log(err):console.log('Successfully connected to MongoDB'))

http.listen(port, (err)=> err?console.log(err):console.log(`Server running on ${port}`));