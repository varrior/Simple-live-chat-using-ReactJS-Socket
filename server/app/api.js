const Chat = require('../models/chatSchema');

module.exports = router => {

    router.post('/chat', (req, res)=>{
        const {author, message} = req.body;
        let chat = new Chat();
        chat.author = author;
        chat.body = message;
        chat.date = new Date();
        chat.save((err, msg)=>{
            if(err){
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, message: 'Your message has been added', msg:msg })
            }
        })
    })
    router.get('/chat/messages', (req, res)=>{
        Chat.find({}, (err, messages)=>{
            if(err){
                res.json({ success: false, message: err })
            } else {
                res.json({ success: true, messages: messages })
            }
        })
    })
    return router
}