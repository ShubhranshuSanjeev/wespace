const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const WebSocket = require('ws').Server;
const server = require('http').createServer();
const wss = new WebSocket({ server: server });
const port = process.env.PORT || 8080;

server.on("request", app);
server.listen(port, () => {
    console.log(`Listening to PORT: ${port}`);
});

let rooms = new Map();

wss.on('connection', ws => {
    ws.on('message', data => {
        console.log(JSON.parse(data));
        handleMessage(JSON.parse(data), ws);
    });
});

const handleMessage = (data, ws) => {
    const { event } = data;
    if(event === 'session') handleRoomEvent(data, ws);
};

const handleRoomEvent = (data, ws) => {
    const { action } = data;
    if(action === 'create') handleCreateRoomEvent(data, ws);
    else if(action === 'join') handleJoinRoomEvent(data, ws);
};

const findRoomByID = id => {
    return rooms[id];
};

const checkUsernameAvailbility = (room, username) => {
    const { users } = room;
    const exists = users[username];
    return typeof exists === 'undefined';
};

const notifyUser = ({ ws }, message) => {
    ws.send(JSON.stringify({
        ...message
    }));
};

const broadcast = (room, message) => {
    const { users } = room;
    console.log(users);
    for(const user in users){
        users[user].ws.send(JSON.stringify({
            ...message
        }));
    }
}

const handleJoinRoomEvent = (data, ws) => {
    const {roomid, username} = data;
    const room = findRoomByID(roomid);

    if(!room){
        notifyUser({ ws: ws }, {
            event: 'error',
            message: 'Room doesn\'t exists',
        });
    }
    else{
        const available = checkUsernameAvailbility(room, username);

        if(!available) {
            notifyUser({ ws: ws }, {
                event: 'error',
                message: 'Username already taken',
            });
        }
        else{
            room.users[username] = {
                username: username,
                ws: ws,
                haveControl: false
            };

            broadcast(room, {
                event: 'online',
                message: `${username} joined the room.`
            });
        }
    }
    console.log(rooms);
};

const handleCreateRoomEvent = (data, ws) => {
    const { roomid, username } = data;
    rooms[roomid] = { roomid: roomid, users: { [username] : { username: username, ws: ws, haveControl: true} } };
    ws.send(JSON.stringify({
        event: 'control',
        action: 'haveControl',
        haveControl: true
    }));
    console.log(rooms);
};