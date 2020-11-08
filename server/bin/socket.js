const socketIO = require("socket.io");
const jwt = require('jsonwebtoken');
const R = require('ramda');
const game = require('./game');
const players = require('./accounts');
const cmd = require('./commands');
const register = require('./register');
//const admins = require('./admins');
const io = socketIO.listen(4000);


 const login = R.pipe(
     ({login, pass, isAdmin})=>({ user: R.find((player)=>player.name===login, isAdmin?game.admins:game.players), login, pass, isAdmin}),
     (o)=>({...o, succeed: o.pass === cmd.use({ type: 'root' }, 'getPasses', [o.user?.id])[0] }),
     ({succeed, user, isAdmin})=>succeed?jwt.sign({ id: user.id, isAdmin }, game.env.jwtSalt):null
 )
io.on("connection", function(socket) {
    console.log("user connected");
    socket.on('login', (payload)=>{
        const token = login(payload);
        if(token) socket.emit('authToken', login(payload));
    });
    socket.on('authToken', (token)=>{
        //send error
        if(!token || token === 'null') return;
        try {
            const decoded = jwt.verify(token, game.env.jwtSalt);
            // const user = R.find((user=>user.id===decoded.id), decoded.isAdmin?game.admins:game.players);
            const user = (decoded.isAdmin?game.admins:game.players).find(user=>user.id===decoded.id);
            if(user){
                socket.user = user;
                user.socket = socket.id;
                socket.emit('userInfo', user);
            }
        }
        catch($e){
            console.error($e);
        }

    })
    socket.on('command', (command)=>{
        let token = command.token;
        try {
            const res = { result: cmd.use(socket.user, command.type, command.payload), token }
            socket.emit('commandResult', res);
        }
        catch ($e){
            // console.log($e);
            socket.emit("$error", { msg: $e.message, token});
        }
    });
    socket.on('disconnect', ()=>{ if(socket.user) { socket.user.socket = null; socket.user = null; } console.log('user disconnected!'); });
});

register.add('accountUpdate', R.tap(({socket, account})=>io.to(socket).emit('accountUpdate', account)));

module.exports = io