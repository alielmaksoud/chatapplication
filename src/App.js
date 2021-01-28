
import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

class App extends Component {

  state = {
    isConnected:false,
    id:null,
    peeps:[],
    text: "",
    msg:"",
    chat:[]
  }
  socket = null

  componentWillMount(){

    this.socket = io('https://codi-server.herokuapp.com');

    this.socket.on('connect', () => {
      this.setState({isConnected:true})
    })
    
    this.socket.on('pong!',()=>{
      console.log('the server answered!')
    })

    this.socket.on('pong!',(additionalStuff)=>{
      console.log('server answered!', additionalStuff)
    })

    this.socket.on('youare',(answer)=>{
      this.setState({id:answer.id})
    })

    this.socket.on('peeps', (data) => {
      this.setState({peeps: data});
      console.log(this.state.peeps);
    })


    this.socket.on("new disconnection", (test) => {
      let newPeeps = this.state.peeps.filter((peep) => peep !== test);
      this.setState({ peeps: newPeeps });
    });

    this.socket.on("new connection", (test) => {
      this.setState({ peeps: [...this.state.peeps, test] });
    });



    


    this.socket.on('next',(message_from_server)=>console.log(message_from_server))


    this.socket.on('disconnect', () => {
      this.setState({isConnected:false})
    })
   
    this.socket.on('peeps', (data) => {
      this.setState({peeps: data});
      console.log(this.state.peeps);
    })


    this.socket.on('room', (old_messages) => {
    this.setState({chat: old_messages});
    console.log(old_messages);
    })

   
  }
  
  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }

  

  render() {
    return (
      <div className="App">
      <div className=" containor"  >
          
               <div className="header">
                 Status
              <div className="head"> {this.state.isConnected ? 'connected' : 'disconnected'}</div>
              </div>
          
      <div className="scroll" >
        {this.state.chat.map((msg) => (
          <div clasName="chat">
            <img
           source={{ uri: './images/avatar.jpg' }}
             style={{ width: 40, height: 40 }}
             alt=""
              />
            <div className="name">{msg.name}</div>
            <div className="text">{typeof msg.text==="string" ? msg.text:""}</div>
            <div className="date">{msg.date}</div>
          
          </div>
        ))}

      </div>
      
        <div classNam="box">
          <div>
        <textarea className="input"
          name="msg"
          placeholder="Type your message..."
          value={this.state.text}
          onChange={(e) =>
           this.setState(
             { input: e.target.value },
                 this.setState({ text: e.target.value }),
                 e.preventDefault())}>

          </textarea>
        </div>
        <div>
        <button className="button"
            onClick={() =>
             this.socket.emit("message", {
             id: this.state.id,
             name: "Ali Maksoud",
             text: this.state.input,})}>Send
         </button>
         <button className="button" onClick={()=>this.socket.emit('ping!')}>ping</button>
        <button className="button" onClick={()=>this.socket.emit('whoami')}>Who am I?</button>
        <button className="button" onClick={()=>this.socket.emit("give me next")}> Give me next</button>
        <button className="button" onClick={() => this.socket.emit("addition")}> add </button>
         </div>
       </div>
         
      </div>
    </div>
         

    );
  }
}

export default App;