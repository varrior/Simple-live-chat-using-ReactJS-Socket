
function sendMessage(data){
    return fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
};
function getMessages(){
    return fetch('/api/chat/messages',{
        method: 'GET',
    }).then(data => data.json())
}

export { sendMessage, getMessages }