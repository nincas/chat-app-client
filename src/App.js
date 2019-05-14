import React, { Component } from 'react';
import Layout from './components/Layout';
import ChatContainer from './components/ChatComponent';
import io from 'socket.io-client';
import './App.css';

const socketServer = "http://localhost:8888";
class App extends Component {
	constructor() {
		super();
		this.state = {
			socket: null,
			user: null,
			users: null,
			messages: [],
			sent_status: 'Send'
		}
	}

	componentWillMount() {
		this.initSocket();
    }

    initSocket = () => {
        const socket = io(socketServer);
        this.setState({socket})

        socket.on('connect', () => {
            console.log('connected!');
		})
		
	}
	
	getUser = (user, users) => {
		this.setState({user, users});
	}

	getMessages = (arr) => {
		this.setState({messages: arr});
	}

	getMessageStatus = (status) => {
		this.setState({sent_status: status});
	}


	render() {
		const { socket, user } = this.state
		const title = "Chat Application"
		return (
		<div className="App">
			{
				!user ? 
				<Layout title={title} socket={socket} user={this.getUser} messages={this.getMessages} status={this.getMessageStatus}/>
				:
				<ChatContainer title={title} user={user} socket={socket} users={this.state.users} messageData={this.state.messages} messageStatus={this.state.sent_status}/>
			}
		</div>
		);
	}
}

export default App;
