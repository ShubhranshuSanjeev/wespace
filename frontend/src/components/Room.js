import React, { Component } from 'react';
import { v4 as uuidV4  } from "uuid";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';

class Room extends Component{
    constructor(props) {
        super(props);

        let {
            location : {
                state : {
                    username,
                    roomid,
                    action
                }
            }
        } = this.props;

        roomid = action === 'create' ? uuidV4() : roomid;

        this.state = {
            url: 'ws://localhost:8080',
            haveControl: false,
            username,
            roomid
        };

        this.websocket = new WebSocket(this.state.url);
    }

    componentDidMount() {
        const { username, roomid } = this.state;
        this.websocket.onopen = () => {
            console.log('Connected!');

            this.websocket.send(JSON.stringify({
                event: 'session',
                action : this.props.location.state.action,
                username,
                roomid,
            }));

            this.websocket.addEventListener('message', message => {
                let { data } = message;
                data = JSON.parse(data);
                console.log(data);
                if(data.event === 'control') this.handleControlEvents(data);
                else if(data.event === 'online') toast(data.message);
            });
        }
    }

    setControls = bool => {
        this.setState({ ...this.state, haveControl: bool });
    }

    handleControlEvents = data => {
        if(data.action === 'haveControl')
            this.setControls(data.haveControl);
    }

    render(){
        return (
            <div className="container-fluid">
                <ToastContainer />
                <div>Room: {this.state.roomid}</div>
            </div>
        );
    }
}

export default Room;