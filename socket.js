let io;

module.exports = {
    init: (httpServer) => {
        io = require('socket.io')(httpServer,{
            cors:{
                origin:'http://localhost:3000',
                method: ["GET","POST"]
            }
        });
        return io
    },
    getIO:() => {
        if(!io){
            throw new Error('socket is not intialized')
        }
        return io
    }
}