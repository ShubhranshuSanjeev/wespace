import React, { Component } from "react";
import { Redirect } from 'react-router-dom';

const containerStyle = {
    height : '100vh',
    position: 'relative'
};

const centered = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
};

const cardStyle = {
    width: '500px'
}

class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            action: null,
            roomid: '',
            redirect: false,
        };
    }

    handleSubmit = (event) => {
        if(event)
            event.preventDefault();

        this.setState({...this.state, redirect: true});
    }

    handleInputChange = (event) => {
        this.setState({...this.state, [event.target.name]: event.target.value});
    }

    render(){
        const {username, action, roomid, redirect} = this.state;
        if(redirect)
            return <Redirect to={{ pathname: "/room", state: { username, action, roomid } }}></Redirect>

        return (
            <div className="container-fluid" style={containerStyle}>
                <div className="card" style={{...cardStyle, ...centered}}>
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="Username">Username</label>
                                <input type="text" className="form-control" placeholder="Enter Username" name="username" onChange={this.handleInputChange} value={username} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Username">Room Id</label>
                                <input type="text" className="form-control" placeholder="Enter Room Id" name="roomid" onChange={this.handleInputChange} disabled={action === 'create'} value={roomid} />
                            </div>
                            <p>Choose Action: </p>
                            <div className="form-group">
                                <div className="form-check form-check-inline">
                                    <input type="radio" className="form-check-input" name="action" value="create" onChange={this.handleInputChange} />
                                    <label className="form-check-label" htmlFor="Action">Create</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input type="radio" className="form-check-input" name="action" value="join" onChange={this.handleInputChange} />
                                    <label className="form-check-label" htmlFor="Action">Join</label>
                                </div>
                            </div>
                            <button className="btn btn-success btn-sm btn-block" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;