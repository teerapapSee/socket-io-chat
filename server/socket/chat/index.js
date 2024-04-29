const { Server } = require('socket.io');
var client = []
module.exports = (server)=>{
    const io = new Server(server);
    io.of("/chat").on('connection', (socket) => {

        const rooms = ()=>{
            return [...new Set([...socket.adapter.sids.entries()]
            .map(([k,v]) => {
                return [...v].filter((vf)=>k!=vf)
            }).reduce((accumulator, current) =>accumulator.concat(current),[]))]
        }
        const userInRoom = (roomName) => {
            if(roomName){
                let user = [...socket.adapter.rooms.entries()]
                .filter(([k,v])=>{
                    return k==roomName
                })
                .map(([k,v]) => {
                    return v
                })
                user = user.length ? [...user[0]] : []
                client = client.filter((c)=>{
                    return c.room == roomName && user.find((u)=>c.id == u)
                })
            }else{
                let user = [...socket.adapter.rooms.entries()]
                .filter(([k,v])=>{
                    return client.find((c)=>c.room != k)
                })
                .map(([k,v]) => {
                    return k
                })

                client = client.filter((c)=>{
                    return user.find((u)=>c.id == u)
                })
                
            }
            const dataReturn = [...client].map((c)=>{
                return {
                    room:c.room,
                    name:c.name
                }
            })

            return dataReturn
        }

        io.of("/chat").emit('listRooms', rooms());
        
        socket.on('disconnect', () => {
            io.of("/chat").emit('listRooms', rooms());
            io.of("/chat").emit('userInRoom', userInRoom());
        });

        socket.on('joinRoom', function (room) {
            socket.join(room.split('-')[0])
            client.push({
                id:socket.id,
                room:room.split('-')[0],
                name:room.split('-')[1]
            })
           
            io.of("/chat").emit('listRooms', rooms());
            io.of("/chat").emit('userInRoom', userInRoom());

        })

        socket.on('chat', function (data) {
            io.of("/chat").to(data.room).emit('chat',{
                name:data.name,
                massage:data.massage
            })
        })
    });
}