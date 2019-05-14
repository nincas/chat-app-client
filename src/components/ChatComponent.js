import React, { Component } from 'react';
import './ChatComponent.css';
import { TYPING, SENDING, RECIEVED, SENT } from './Events';


class ChatComponent extends Component {
    constructor() {
        super();
        this.state = {
            socket: null,
            user: null,
            typing_status: [],
            sent_status: 'Send',
            messages: []
        }
    }


    componentWillMount() {
        const { socket, user } = this.props
        this.setState({ socket, user })
    }

    componentDidMount() {
        const { socket, user } = this.state
        window.addEventListener('beforeunload', (e) => {
            e.preventDefault();
            return e.returnValue = '';
        });

        socket.on('disconnect', () => {
            
        });

        this.scrollToBottom();
        
        setTimeout(this.setState({typing_status:  null}), 1000);
    }
    
    componentDidUpdate() {
        this.scrollToBottom()
    }

    scrollToBottom() {
        this.el.scrollIntoView(false);
    }

   
    handleTyping = (e) => {
        // e.target.value
        const { socket, user } = this.state
        socket.emit(TYPING, { user }, (user) => {
            this.setState({typing_status:  `${user.user} is typing..`})
        });

        socket.on(TYPING, (userT) => {
            let userTyping = (user === userT.user) ? 'You are' : userT.user;
            this.setState({typing_status:  `${userTyping} is typing..`})
            setTimeout(
                function() {
                    this.setState({typing_status: null});
                }
                .bind(this),
                2000
            );
        })
    }

    handleSubmit = (e) => {
        const { socket, user } = this.state 
        let message = this.refs.message.value;
        socket.emit(SENDING, {user, message }, (status) => {
            this.setState({sent_status: 'Sending..'});
            console.log('Sending..');
        })

        this.refs.message.value = "";
    }

    render() {
        const { title, users, messageData, messageStatus } = this.props
        const { typing_status, sent_status, user } = this.state
        
        return (
            <div className="mainContainer">
                <p>{ title.toUpperCase() }</p>
                <i>Powered by: Web Socket (socket.io), ReactJS, NodeJS (ExpressJS)</i>
                <br/><br/>
                <i style={{float: "left", fontSize: 11 }}>ONLINE USERS: {users.length}</i><br/>
                {/* <span>{ users.map(user => {
                    return <i key={user}>{user}, </i>
                }) }</span> */}
                
                <div className="chat_container" ref={(element) => {this.el = element}}>
                   <i>{ typing_status }</i>
                   { messageData.map(message => {
                       let rightFloat = message.user === user ? 'right' : 'left'
                       let showSender = message.user !== user ? message.user + ': ' : ''
                       return <div className="user_message" style={
                           {float: rightFloat}
                       } key={message.user}><b style={{float: rightFloat}}>{showSender.toUpperCase()}</b>{message.message}</div>
                   })}
                </div>
                <div className="actionPane">
                    <textarea ref="message" type="text" placeholder="Enter message" maxLength="255" onChange={this.handleTyping.bind(this)}/>
                    <br/>
                    <button onClick={this.handleSubmit.bind(this)}>{messageStatus}</button>
                </div>
            </div>
        );
    }
}

export default ChatComponent;