export default function renderLobby(screen, lobby, jogadorAtual) {

    // Click listener de dados
    const state = {
        observers: [],
        jogadorAtual: jogadorAtual
    }
    function registerPlayerId(jogadorId) { //pro futuro setup
        state.jogadorAtual = jogadorId
    }
    function subscribe(observerFunction) { //Cadastra funções observadoras
        state.observers.push(observerFunction)
    }
    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    const iw = screen.width
    const ih = screen.height
    const app = new PIXI.Application({
        view: screen,
        width: screen.width,
        height: screen.height,
        transparent: true,
    });

    //Container com resize
    var containerResize = app.stage.addChild(new PIXI.Container());

    //Container sem resize
    var containerComum = app.stage.addChild(new PIXI.Container());

    containerResize.scale.x = containerResize.scale.y = 0.6;
    
    function resize() {
    };

    const cabecalho = new PIXI.Text();

    const auxRender = {
            x: {
                valor: 10,
                inicial: 10,
                margemCartasMao: 20,
                margemCartasMesa: 10,
                margemSetores: 100,
                larguraCarta: 271,
            },
            y: {
                valor: 10,
                inicial: 10,
                margemAntesJogador: 30,
                margemInterna: 20,
                alturaCarta: 400,
            },
            escalaMao: 0.5,
            escalaMesa: 0.4
        }
    const matrizObjetos = []

    app.ticker.add(animate);

    cabecalho.position.set(auxRender.x.valor, auxRender.y.valor);
    containerResize.addChild(cabecalho)
    auxRender.y.valor += 30
    //containerResize.addChild(graphics);

    //Desenha grid com a quantidade maxima de jogadores do inicio do jogo
    for (let j = 0; j < lobby.state.maxJogadores; j++) {
        auxRender.x.valor = auxRender.x.inicial
        auxRender.y.valor += auxRender.y.margemAntesJogador
        
        let graphics = new PIXI.Graphics();
        // graphics.lineStyle(5, '0x858586', 0);
        graphics.beginFill('0x858586', 0.2);
        graphics.drawRoundedRect(auxRender.x.valor, auxRender.y.valor, 900, 50, 15);
        graphics.endFill();
        containerResize.addChild(graphics);

        const styleDefault = new PIXI.TextStyle({
            fill: "0x858586",
            fontWeight: "bold",
        });
        let nomeJogador = new PIXI.Text('', styleDefault);
        nomeJogador.position.set(auxRender.x.valor + 20, auxRender.y.valor + 10);
        containerResize.addChild(nomeJogador);

        matrizObjetos.push(nomeJogador);
        auxRender.y.valor += 50
        auxRender.y.valor += auxRender.y.margemInterna
    }

    let once = true;
    function mudaOnce() {
        console.log("Reativou once")
        once = true
    }
    let i = 0;
    function animate() {
        auxRender.x.valor = auxRender.x.inicial
        auxRender.y.valor = auxRender.y.inicial

        cabecalho.text = 'LOBBY SUXI GO!             | Jogadores: '+lobby.state.contJogadores()+"/"+lobby.state.maxJogadores;

        let nomeJogadores = []
        let coresJogadores = []
        for (const jogadorId in lobby.state.jogadores) {
            if (lobby.state.jogadores[jogadorId].ehHost) {
                nomeJogadores.push(jogadorId + ' [HOST]')
            } else {
                nomeJogadores.push(jogadorId + ' [GUEST]')
            }
            coresJogadores.push(lobby.state.jogadores[jogadorId].cor)
        }
        for (let i = nomeJogadores.length; i < lobby.state.maxJogadores; i++) {
            nomeJogadores.push('')
            coresJogadores.push('0x858586')
        }

        matrizObjetos.forEach((dadosJogador, index) => {
            let texto = dadosJogador
            texto.style.fill = coresJogadores[index]
            texto.text = 'Jogador: '+nomeJogadores[index]
        })

        once = false;
    }
    /*
    requestAnimationFrame(() => {
                renderGame(screen, game)
            })
            */
    return {
        subscribe,
        mudaOnce
    }
}

/*
MINHA CANVAS VERSAO
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
}
*/

/*
VERSÃO FELIPE
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