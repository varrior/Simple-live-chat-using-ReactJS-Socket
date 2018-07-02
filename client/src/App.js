import React, { Component } from 'react';
import './App.css';
import { FormGroup, ControlLabel, FormControl, Grid, FieldGroup, Col, Button } from 'react-bootstrap';
import { sendMessage, getMessages } from './app/app';
import moment from 'moment';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient();

class App extends Component {
  constructor(){
    super();
    this.postMsg = this.postMsg.bind(this);
    this.checkForm = this.checkForm.bind(this);
    this.state = {
      author: null,
      message: null,
      chat: []
    }
  }
  checkForm(e){
    let name = e.target.name;
    let valid = e.target.checkValidity();
    let length = e.target.value.length;

    if(valid && length !== 0){
        this.setState({
            [name]: 'success'
        })
    } else {
      this.setState({
        [name]: 'error'
    })
    }
  }
  
  postMsg(e){
    e.preventDefault();
    let form = Array.from(e.target.children)
    form.pop();
    if(e.target.checkValidity()){
      let data = new FormData(e.target);
      console.log(data)
      for(let i of data.entries()){
        data[i[0]] = i[1]
      }
      sendMessage(data).then(response => {        
        socket.emit('chat', response.msg)
      })
      form.forEach(element => {
        let name = element.children[1].name;
        setTimeout(()=>{
          element.children[1].value = '';
          this.setState({
            [name]: null,
          })
        },500)
      })

    } else {
      form.forEach(element => {
        let name = element.children[1].name;
        let validChild = element.children[1].checkValidity();
        let lengthVal = element.children[1].value.length;
        if(!validChild && lengthVal === 0){
            this.setState({
                [name]: 'error',
                required: true,
            })
        } else if(!validChild && lengthVal !== 0){
            this.setState({
                [name]: 'error',
                required: false,
            })
        }
    });
    }
  }
  componentDidMount(){
    getMessages().then(data => {
      console.log(data.messages)
      this.setState({
        chat: data.messages
      })
    })
  
    socket.on('chat', chat =>{
      this.setState(prevChat => ({
        chat: [...prevChat.chat, chat]
      }))
      
    })
  }

  render() {
    let messages = this.state.chat.map((item,index) => {
      return (
        <div className="messages" key={index}>
          <p className="author">{item.author}</p>
          <p className="date">{moment(item.date).format('DD-MM-YYYY, h:mm')}</p>
          <div className="messageBody">{item.body}</div>
        </div>
      )
    })

    return (
      <div className="App">
        <Grid>
          <Col xs={8} xsOffset={2}>
            <h1>React live chat</h1>
            <div className="messagesFrame">
              {messages}
            </div>
            <form onSubmit={this.postMsg} noValidate>
              <FormGroup validationState={this.state.author}>
                <ControlLabel>Author</ControlLabel>
                <FormControl
                  name="author"
                  id="authorName"
                  type="text"
                  placeholder="Author"
                  onChange={this.checkForm}
                  required
                />
                <FormControl.Feedback></FormControl.Feedback>
              </FormGroup>
              <FormGroup validationState={this.state.message}>
                <ControlLabel>Add message</ControlLabel>
                <FormControl 
                  name="message"
                  componentClass="textarea" 
                  placeholder="Write a message" 
                  onChange = {this.checkForm}
                  required>
                </FormControl>
                <FormControl.Feedback></FormControl.Feedback>
              </FormGroup>        
              <FormGroup>
                <Button type="submit">Send message</Button>
              </FormGroup>
            </form>
          </Col>
        </Grid>
      </div>
    );
  }
}

export default App;
