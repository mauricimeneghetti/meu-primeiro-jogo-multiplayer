export default function createLobby() {  
    console.log(`LOBBYYYYYYYYYYYY`)      
    const state = {
        jogadores: {},
        maxJogadores: 3,
        cores: ['0xF1C40F', '0x27AE60', '0x3498DB', '0x3498DB', '0x8E44AD'],
        contJogadores: () => {
            return Object.keys(state.jogadores).length
        },
        corDisponivel: () => {
            let coresDisponiveis = state.cores
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
        if (state.contJogadores() < state.maxJogadores) {
            if (state.contJogadores() == 0) { ehHost = true }
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
        subscribe
    }
}