export default function renderGame(screen, game) {
    const context = screen.getContext('2d')
    context.fillStyle = 'white'
    context.clearRect(0, 0, 900, 900)

    var posicaoX = 30
    var posicaoY = 50
    
    context.font = "30px Arial"
    context.fillStyle = 'black'
    context.fillText("Como sushi melhor que você! (Até "+game.state.maxJogadores+" jogadores)", posicaoX, posicaoY)
    context.fillText("Turno: "+game.state.rodada+"."+game.state.turno, posicaoX+700, posicaoY)
    posicaoY+= 30
    context.moveTo(posicaoX,posicaoY);
    context.lineTo(posicaoX+600,posicaoY);
    context.stroke();

    for (const jogadorId in game.state.jogadores) {
        posicaoY+= 50

        context.fillStyle = 'black'
        context.fillText("Jogador: " + jogadorId, posicaoX, posicaoY)

        posicaoY+= 50
        for (const cartaId in game.state.jogadores[jogadorId].mao) {
            const carta = game.state.jogadores[jogadorId].mao[cartaId]
            context.fillStyle = carta.cor
            context.fillRect(posicaoX, posicaoY, 30, 30)
            context.fillText(cartaId, posicaoX, posicaoY+60)
            posicaoX += 80
        }
        
        posicaoX = 30
        posicaoY+= 100
        for (const cartaId in game.state.jogadores[jogadorId].mesa) {
            const carta = game.state.jogadores[jogadorId].mesa[cartaId]
            context.fillStyle = carta.cor
            context.fillRect(posicaoX, posicaoY, 30, 30)
            context.fillText(cartaId, posicaoX, posicaoY+60)
            posicaoX += 80
        }

        posicaoX = 30
        posicaoY+= 100
        context.fillStyle = 'black'
        const seusPontos = game.state.jogadores[jogadorId].somaPontos
        context.fillText("Seus pontos: " + seusPontos, posicaoX, posicaoY)
        
        posicaoY+= 30
        context.moveTo(posicaoX,posicaoY);
        context.lineTo(posicaoX+600,posicaoY);
        context.stroke();
    }
    posicaoY+= 100
    context.fillText("Baralho: " + game.state.numCartasBaralho(), 30, posicaoY)
    
    requestAnimationFrame(() => {
                renderGame(screen, game)
            })
    /*
    requestAnimationFrame(() => {
                renderGame(screen, game)
            })
            */
}

/*
export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
    const context = screen.getContext('2d')
    context.fillStyle = 'white'
    context.clearRect(0, 0, 10, 10)

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId]
        context.fillStyle = 'black'
        context.fillRect(player.x, player.y, 1, 1)
    }

    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId]
        context.fillStyle = 'green'
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }

    const currentPlayer = game.state.players[currentPlayerId]

    if(currentPlayer) {
        context.fillStyle = '#F0DB4F'
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
    }

    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
    })
}
*/