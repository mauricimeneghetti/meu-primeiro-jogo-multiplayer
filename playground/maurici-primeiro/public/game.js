export default function createGame() {    
    const state = {
        jogadores: {},
        baralho: {
            'carta1': {nome: 'Nigiri 1', pontos: 1, cor: 'red'},
            'carta2': {nome: 'Nigiri 2', pontos: 2, cor: 'blue'},
            'carta3': {nome: 'Nigiri 1', pontos: 1, cor: 'red'},
            'carta4': {nome: 'Nigiri 3', pontos: 3, cor: 'green'},
            'carta5': {nome: 'Nigiri 1', pontos: 1, cor: 'red'},
            'carta6': {nome: 'Nigiri 1', pontos: 1, cor: 'red'},
            'carta7': {nome: 'Nigiri 3', pontos: 3, cor: 'green'},
            'carta8': {nome: 'Nigiri 1', pontos: 1, cor: 'red'},
            'carta9': {nome: 'Nigiri 3', pontos: 3, cor: 'green'},
            'carta10': {nome: 'Nigiri 3', pontos: 3, cor: 'green'},
            'carta11': {nome: 'Nigiri 3', pontos: 3, cor: 'green'},
            'carta12': {nome: 'Nigiri 3', pontos: 3, cor: 'green'},
        },
        rodada: 0,
        turno: 0,
        maxJogadores: 2,
        numJogadores: () => {
            return Object.keys(state.jogadores).length
        },
        numCartasBaralho: () => {
            return Object.keys(state.baralho).length
        },
        numCartasMao: () => {
            const idPrimeiroJogador = Object.keys(state.jogadores)[0]
            return Object.keys(state.jogadores[idPrimeiroJogador].mao).length
        }
    }
    function maxCartasPorRodada() {
        return 4 - state.numJogadores()
    }

    function adicionarJogador(jogadorId) {
        if (state.numJogadores() < state.maxJogadores) {
            state.jogadores[jogadorId] = {
                mao: {},
                mesa: {},
                somaPontos: 0,
                escolheu: '',
            }
            console.log("Adicionado " + jogadorId)
        } else {
            console.log("Jogo lotado. Não foi adicionado " + jogadorId)
        }
    }

    function removerJogador(jogadorId) {
        delete state.jogadores[jogadorId]
        console.log("Removido " + jogadorId)
    }
    
    function distribuirCartas() {
        // Da uma pra cada um até um máximo de 10 ou acabarem as cartas
        for (var entreguesParaCada = 1;
            state.numCartasBaralho() >= state.numJogadores() && entreguesParaCada <= maxCartasPorRodada();
            entreguesParaCada++) {

            for(const jogadorId in state.jogadores) {
                // Tira do baralho
                var primeiroId = Object.keys(state.baralho)[0]
                var novaCarta = state.baralho[primeiroId]
                delete state.baralho[primeiroId]
                // Da pro jogador
                state.jogadores[jogadorId].mao[primeiroId] = novaCarta
                console.log(jogadorId + " comprou: " + novaCarta.nome)
            }
            console.log("Entregues para cada jogador: "+entreguesParaCada)
            console.log("Baralho: "+state.numCartasBaralho())
        }
        console.log("Fim da distribuição. Cartas restantes: " + state.numCartasBaralho())
    }

    function trocarMaos() {
        console.log("ANTES DA TROCA")
        console.log(state.jogadores)
        const idJogadores = Object.keys(state.jogadores)
        const maoPrimeiroJogador = state.jogadores[idJogadores[0]].mao
        for(var i = 0; i < (idJogadores.length-1); i++) {
            console.log(state.jogadores[idJogadores[i+1]].mao)
            console.log("SUBSTITUIU")
            console.log(state.jogadores[idJogadores[i]].mao)
            state.jogadores[idJogadores[i]].mao = state.jogadores[idJogadores[i+1]].mao
            console.log("DPS DA TROCA")
            console.log(state.jogadores)
        }
        console.log(maoPrimeiroJogador)
        console.log("SUBSTITUIU")
        console.log(state.jogadores[idJogadores[idJogadores.length - 1]].mao)

        state.jogadores[idJogadores[idJogadores.length - 1]].mao = maoPrimeiroJogador
        console.log("DPS DA TROCA FIM")
        console.log(state.jogadores)
    }

    function escolherCarta(jogadorId, cartaId) {
        if (state.jogadores[jogadorId].mao[cartaId]) { // Se essa carta tiver na mão dele, define como escolhida
            state.jogadores[jogadorId].escolheu = cartaId
            console.log(jogadorId + " escolheu " + cartaId)

            if(todosEscolheram()) {
                proximoTurno()
            }
            //Na função de passar o turno ve se tem carta ainda se não passa a rodada
            //Na função passar rodada ve se ainda tem rodada pra ir se não acaba o jogo ali mesmo
        } else {
            console.log(cartaId + " não ta na mão de " + jogadorId)
        }
    }

    function todosEscolheram() {
        for (const jogadorId in state.jogadores) {
            if (state.jogadores[jogadorId].escolheu == "") {
                console.log(jogadorId + " é um exemplo de jogador q ta empedindo fim do turno")
                return false
            }
        }
        console.log("TODOS ESCOLHERAM")
        return true
    }

    function proximoTurno() {
        baixarCartas()
        console.log(state.numCartasMao() )
        if (state.numCartasMao() == 0) {
            console.log("VAI PRA PROXIMA RODADA")
            proximaRodada()
        } else {
            trocarMaos()
            console.log("Turno "+state.turno+" -> "+(state.turno + 1))
            state.turno++
        }
    }

    function baixarCartas() {
        for(const jogadorId in state.jogadores) {
            const escolhidaId = state.jogadores[jogadorId].escolheu
            const carta = state.jogadores[jogadorId].mao[escolhidaId] 
            if (carta) {
                console.log(jogadorId + " baixou: " + carta.nome + " (" + escolhidaId + ")")
                state.jogadores[jogadorId].mesa[escolhidaId] = carta
                delete state.jogadores[jogadorId].mao[escolhidaId]
                state.jogadores[jogadorId].somaPontos += carta.pontos
                state.jogadores[jogadorId].escolheu = ""
            } else {
                console.log(jogadorId + " não pode baixar, carta não está na mão")
            }
        }
    }

    function proximaRodada() {
        if (state.rodada >= 3) {
            fimDeJogo()
        } else {
            console.log("Rodada "+state.rodada+" -> "+(state.rodada + 1))
            state.rodada++
            state.turno = 1
            distribuirCartas()
        }
    }

    function fimDeJogo() {
        var vencedorId = Object.keys(state.jogadores)[0]
        for(const jogadorId in state.jogadores) {
            if (state.jogadores[jogadorId].somaPontos > state.jogadores[vencedorId].somaPontos) {
                vencedorId = jogadorId
            }
        }
        console.log("VENCEDOR SUPREMO: "+vencedorId)
    }

    const observers = []
    
    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    return {
        createGame,
        state,
        adicionarJogador,
        removerJogador,
        escolherCarta,
        proximaRodada
    }
}



/*
export default function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    const observers = []

    function start() {
        const frequency = 2000

        setInterval(addFruit, frequency)
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }

    function removePlayer(command) {
        const playerId = command.playerId

        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }

        notifyAll({
            type: 'add-fruit',
            fruitId: fruitId,
            fruitX: fruitX,
            fruitY: fruitY
        })
    }

    function removeFruit(command) {
        const fruitId = command.fruitId

        delete state.fruits[fruitId]

        notifyAll({
            type: 'remove-fruit',
            fruitId: fruitId,
        })
    }

    function movePlayer(command) {
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y - 1 >= 0) {
                    player.y = player.y - 1
                }
            },
            ArrowRight(player) {
                if (player.x + 1 < state.screen.width) {
                    player.x = player.x + 1
                }
            },
            ArrowDown(player) {
                if (player.y + 1 < state.screen.height) {
                    player.y = player.y + 1
                }
            },
            ArrowLeft(player) {
                if (player.x - 1 >= 0) {
                    player.x = player.x - 1
                }
            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[playerId]
        const moveFunction = acceptedMoves[keyPressed]

        if (player && moveFunction) {
            moveFunction(player)
            checkForFruitCollision(playerId)
        }

    }

    function checkForFruitCollision(playerId) {
        const player = state.players[playerId]

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            console.log(`Checking ${playerId} and ${fruitId}`)

            if (player.x === fruit.x && player.y === fruit.y) {
                console.log(`COLLISION between ${playerId} and ${fruitId}`)
                removeFruit({ fruitId: fruitId })
            }
        }
    }

    return {
        addPlayer,
        removePlayer,
        movePlayer,
        addFruit,
        removeFruit,
        state,
        setState,
        subscribe,
        start
    }
}
*/