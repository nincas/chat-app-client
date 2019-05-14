import React, { Component } from 'react';
import './Layout.css';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null,
            user: null
        }
    }
    componentWillMount() {
        const { socket } = this.props
        this.setState({socket});
    }

    handleSubmit = (e) => {
        
        let user = this.refs.nickname.value
        let  messageArray = [];
        const { socket } = this.state
        
        // update users if new user is connected to the sockets server
		socket.on('newuser_connected', (users) => {
			this.props.user(user, users);
        })

        socket.on('SENT', (obj) => {
            messageArray.push(obj.messages);
            this.setState({ messages: messageArray[0], sent_status: 'Send' });
            this.props.messages(obj.messages);
            this.props.status('Send');
            console.log('Sent!');
        })
        
        if (user !== "") {
            socket.emit('new user', { user }, (status, users) => {
                if (status) {
                    this.setState({user})
                    this.props.user(user, users);
                }
            });
            
        } else {
            alert('Please provide a nickname!');
        }
    }

    render() {
        const { title } = this.props;
        return (
            <div className="container">
                 <h4>{title}</h4>
                 <br/>
                 <div className="Login">
                    <input ref="nickname" type="text" placeholder="Enter nickname"/>
                    <br/>
                    <button onClick={this.handleSubmit.bind(this)}>Let Me In!</button>
                 </div>
            </div>
        );
    }
}

export default Layout;