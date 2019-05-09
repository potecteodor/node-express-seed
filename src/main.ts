import { AppSetting } from './config'
import { ExpressApi } from './express.api'

let api = new ExpressApi()

const server = api.run()
console.log(`listening on ${AppSetting.getConfig().port}`)

let app = api.app
export { app }
export { io }

var usersCollection = []
let io = require('socket.io').listen(server)

// Socket.io operations
io.on('connection', function(socket) {
  console.log('A user has connected to the server.')

  socket.on('join', function(username) {
    usersCollection.push(Object.assign({ sId: socket.id }, username))
    socket.emit('friendsListChanged', usersCollection)
    socket.broadcast.emit('friendsListChanged', usersCollection)

    console.log(username.display_name + ' has joined the chat room.')
    // This is the user's unique ID to be used on ng-chat as the connected user.
    socket.emit('generatedUserId', socket.id)

    // On disconnect remove this socket client from the users collection
    socket.on('disconnect', function() {
      console.log('User disconnected!')
      var i = usersCollection.findIndex(x => x.sid == socket.id)
      usersCollection.splice(i, 1)
      socket.emit('friendsListChanged', usersCollection)
      socket.broadcast.emit('friendsListChanged', usersCollection)
    })
  })

  socket.on('sendMessage', function(d: any) {
    console.log('Message received:')
    let to = ''
    if (d.to) {
      to = d.to.sId
    }
    // delete d['to']
    if (to.length > 0) {
      io.to(to).emit('messageReceived', d)
    } else {
      console.log('Message format incorrect')
      /* socket.broadcast.emit('messageReceived', d)
      socket.emit('messageReceived', d) */
    }
    console.log('Message dispatched.')
  })
})
