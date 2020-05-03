import express from 'express'
import http from 'http'
import createLobby from './public/lobby.js'
import createGame from './public/game.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app) // pega modulo http do node e cria uma instancia padrão e chama de server pra dps encaixar os WebSockets
const sockets = socketio(server)

app.use(express.static('public')) // Pasca com arquivos estaticos que ele vai deixar disponivel de forma publica expoe a porta 3000

server.listen(3000, () => { console.log('> Server listening on port: 3000') })

let etapa = 'lobby'
const lobby = createLobby()
const game = createGame()

lobby.subscribe((command) => { // Server lobby emite coisas pros sockets
    console.log(`> Emitting ${command.type}`)
    sockets.emit(command.type, command)
})
game.subscribe((command) => {
    console.log(`> Emitting ${command.type}`)
    sockets.emit(command.type, command)
})

// Event emitter
sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`> Player connected: ${playerId}`)
    if (etapa == 'lobby') {
        lobby.adicionarJogadorLobby(playerId)
        socket.emit('setup-lobby', lobby.state)
    } else if (etapa == 'game') {
        game.adicionarJogador(playerId)
        socket.emit('setup-game', game.state)
    }

    socket.on('disconnect', () => {
        if (etapa == 'lobby') {
            lobby.colocarTempLobby(playerId)
            lobby.removerJogadorLobby(playerId)
            console.log(`> Player disconnected FROM LOBBY: ${playerId}`)
        } else if (etapa == 'game') {
            game.removerJogador(playerId)
            console.log(`> Player disconnected FROM GAME: ${playerId}`)
        }
    })
})
/*
import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()
game.start()

game.subscribe((command) => {
    console.log(`> Emitting ${command.type}`)
    sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`> Player connected: ${playerId}`)

    game.addPlayer({ playerId: playerId })

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({ playerId: playerId })
        console.log(`> Player disconnected: ${playerId}`)
    })

    socket.on('move-player', (command) => {
        command.playerId = playerId
        command.type = 'move-player'
        
        game.movePlayer(command)
    })
})

server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`)
})
*/