export default function createLobby() {  
    console.log(`LOBBYYYYYYYYYYYY`)      
    const state = {
        jogadores: {},
        temp: {},
        maxJogadores: 3,
        cores: ['0xF1C40F', '0x27AE60', '0x3498DB', '0x3498DB', '0x8E44AD'],
        contJogadores: () => {
            return Object.keys(state.jogadores).length
        },
        contTemp: () => {
            return Object.keys(state.temp).length
        },
        corDisponivel: () => {
            const coresDisponiveis = ['0xF1C40F', '0x27AE60', '0x3498DB', '0x3498DB', '0x8E44AD']
            let index
            let corIndisponivel
            for (const jId in state.jogadores) {
                corIndisponivel = state.jogadores[jId].cor
                index = coresDisponiveis.indexOf(corIndisponivel);
                if (index !== -1) {
                    coresDisponiveis.splice(index, 1)
                };
            }
            let corEscolhida
            let numAleatorio = Math.floor(coresDisponiveis.length * Math.random())
            corEscolhida = coresDisponiveis[numAleatorio]
            return corEscolhida
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function adicionarJogadorLobby(jogadorId, novaCor=state.corDisponivel(), ehHost=false) {
        if (state.contTemp() > 0 && state.contJogadores() != 0) {
            let jReconectado = pegarTempLobby()
            state.jogadores[jogadorId] = {
                codigo: jogadorId,
                cor: jReconectado.cor,
                ehHost: false
            }
            console.log('Reconectado ' + jReconectado.codigo + ' como ' + jogadorId) 

            notifyAll({
                type: 'adicionar-jogador-lobby',
                playerId: jogadorId,
                playerColor: jReconectado.cor
            })
        } else if (state.contJogadores() < state.maxJogadores) {
            if (state.contJogadores() == 0) {
                state.temp = {}
                ehHost = true 
            }
            state.jogadores[jogadorId] = {
                codigo: jogadorId,
                cor: novaCor,
                ehHost: ehHost
            }
            console.log("Adicionado " + jogadorId)

            notifyAll({
                type: 'adicionar-jogador-lobby',
                playerId: jogadorId,
                playerColor: novaCor
            })
        } else {
            console.log("Jogo lotado. Não foi adicionado " + jogadorId)
        }
    }

    function removerJogadorLobby(jogadorId) {
        let eraHost
        if (state.jogadores[jogadorId].ehHost) {
            eraHost = '(era HOST)'
        } else {
            eraHost = '(era GUEST)'
        }
        delete state.jogadores[jogadorId]
        for (const novoHostId in state.jogadores) {
            state.jogadores[novoHostId].ehHost = true
            break;
        }
        console.log("Removido " + jogadorId + ' ' + eraHost)

        notifyAll({
            type: 'remover-jogador-lobby',
            playerId: jogadorId
        })
    }

    function colocarTempLobby(jogadorId) {
        state.temp[jogadorId] = {
                codigo: jogadorId,
                cor: state.jogadores[jogadorId].cor,
                ehHost: false
            }
        console.log("Adicionado ao temp " + jogadorId)
    }
    
    function pegarTempLobby() {
        let primeiroTempId = Object.keys(state.temp)[0]
        let primeiroTemp = state.temp[primeiroTempId]
        delete state.temp[primeiroTempId]
        console.log("Extraido do temp " + primeiroTempId)
        return primeiroTemp
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
        createLobby,
        setState,
        state,
        adicionarJogadorLobby,
        removerJogadorLobby,
        colocarTempLobby,
        subscribe
    }
}