export default function renderGame(screen, game, jogadorAtual) {

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
    function cliqueNaCarta() {
        
        console.log("Notificado clique na carta "+this.carta.codigo)
        const command = {
            type: 'clique-carta',
            carta: this.carta,
        }
        notifyAll(command)
    }



    // let _w = window.innerWidth - 40
    // let _h = screen.height
    // console.log(screen.height)
    // //Referência para formataação
    const iw = screen.width //window.innerWidth - 40
    const ih = screen.height //window.innerHeight
    const app = new PIXI.Application({
        view: screen,
        width: screen.width,
        height: screen.height,
	    //autoResize: true,
        //resolution: window.devicePixelRatio, //mult o tamanho do renderer pela resolução
        //autoDensity: true, //garantir que o CSS vai escalar para que encaixe com o width and height que ta setado
        transparent: true,
    });
    let texturaCartas = {};

    //Container com resize
    var containerResize = app.stage.addChild(new PIXI.Container());

    //Container sem resize
    var containerComum = app.stage.addChild(new PIXI.Container());

    //var ratio = Math.min(window.innerWidth - 40 / iw, window.innerHeight / ih); //Acha o que mais diminuiu em relação ao valor original
    //containerResize.scale.x = containerResize.scale.y = ratio;
    //app.renderer.resize(Math.ceil(iw * ratio), Math.ceil(ih * ratio));
    containerResize.scale.x = containerResize.scale.y = 0.6;
    
    // Pra fazer responsivo
    //window.addEventListener('resize', resize);
    // Minha função de resize handler
    function resize() {
        // Atualiza as variaveis
        //_w = window.innerWidth - 40;
        //_h = 3*window.innerHeight;
        // Chama resize do renderer com esses novos valores
        //app.renderer.resize(_w, _h);
        
        //Reescala com base na sua própria dimensão
        //app.stage.scale.x = (_w / iw);
        //app.stage.scale.y = (_h / ih);
        //Reescala com base no valor das 2 dimensões
        //var ratio = Math.min(_w / iw, _h / ih); //Acha o que mais diminuiu em relação ao valor original
        //containerResize.scale.x = containerResize.scale.y = ratio;
        
        //app.renderer.resize(Math.ceil(iw * ratio), Math.ceil(ih * ratio));
    };

    const cabecalho = new PIXI.Text();
        
    app.loader.add("carta", "imgs/cartas.png");
    app.loader.load(doneLoading);

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
    const graphics = new PIXI.Graphics();
    const matrizObjetos = []

    function doneLoading(e) {
        console.log("Terminou load")
        createCardSheet()
        app.ticker.add(animate);
        // Tem outros metodos como Stop ou Add once se quer algo q seja feito uma vez e não todo RequestAnimationFrame

        cabecalho.position.set(auxRender.x.valor, auxRender.y.valor);
        containerResize.addChild(cabecalho)
        auxRender.y.valor += 30
        containerResize.addChild(graphics);
        let objetosDesseJogador = []

        //Desenha grid com a quantidade de jogadores do inicio do jogo
        for (let j = 0; j < game.state.numJogadores; j++) {
            
            objetosDesseJogador = []
            auxRender.x.valor = auxRender.x.inicial
            auxRender.y.valor += auxRender.y.margemAntesJogador
            

            graphics.lineStyle(5, '0x858586', 1);
            graphics.beginFill('0x858586', 0.5);
            graphics.drawRoundedRect(auxRender.x.valor, auxRender.y.valor, 900, 50, 15);
            graphics.endFill();
            let nomeJogador = new PIXI.Text(); //'Jogador: '+cod.codigo
            nomeJogador.position.set(auxRender.x.valor + 20, auxRender.y.valor + 10);
            containerResize.addChild(nomeJogador);
            objetosDesseJogador.push(nomeJogador);
            auxRender.y.valor += 50

            //Desenha grid de até 10 cartas pra mão
            auxRender.y.valor += auxRender.y.margemInterna
            let imgCarta;
            let cartasMao = []
            for (let i = 0; i < game.state.maxCartasPorRodada(); i++) {
                imgCarta = new PIXI.Sprite(texturaCartas['default']);
                imgCarta.x = auxRender.x.valor
                imgCarta.y = auxRender.y.valor
                imgCarta.scale = new PIXI.Point(auxRender.escalaMao, auxRender.escalaMao)
                
                containerResize.addChild(imgCarta);
                cartasMao.push(imgCarta);
                
                auxRender.x.valor += auxRender.x.larguraCarta*auxRender.escalaMao + auxRender.x.margemCartasMao
            }
            objetosDesseJogador.push(cartasMao)
            auxRender.y.valor += auxRender.y.alturaCarta*auxRender.escalaMao + auxRender.y.margemInterna

            //Desenha grid de 11 cartas pra mesa
            auxRender.x.valor = auxRender.x.inicial
            auxRender.y.valor += auxRender.y.margemInterna

            let cartasMesa = []
            for (let i = 0; i < 11; i++) {
                imgCarta = new PIXI.Sprite(texturaCartas['default']);
                imgCarta.x = auxRender.x.valor
                imgCarta.y = auxRender.y.valor
                imgCarta.scale = new PIXI.Point(auxRender.escalaMesa, auxRender.escalaMesa)
                
                containerResize.addChild(imgCarta);
                cartasMesa.push(imgCarta);
                
                auxRender.x.valor += auxRender.x.larguraCarta*auxRender.escalaMesa+ auxRender.x.margemCartasMesa
            }
            objetosDesseJogador.push(cartasMesa)
            auxRender.y.valor += auxRender.y.alturaCarta*auxRender.escalaMesa

            //Desenha grid de 11 textos pra mesa
            auxRender.x.valor = auxRender.x.inicial + 15
            auxRender.y.valor += auxRender.y.margemInterna

            let textosMesa = []
            let textoCarta;
            for (let i = 0; i < 11; i++) {
                textoCarta = new PIXI.Text('default');
                textoCarta.x = auxRender.x.valor
                textoCarta.y = auxRender.y.valor

                containerResize.addChild(textoCarta);
                textosMesa.push(textoCarta);
                
                auxRender.x.valor += auxRender.x.larguraCarta*auxRender.escalaMesa+ auxRender.x.margemCartasMesa
            }
            objetosDesseJogador.push(textosMesa)
            auxRender.y.valor += auxRender.y.margemInterna

            matrizObjetos.push(objetosDesseJogador)
        }
    }
    function montaMesa(cartas) {
        
    }

    function createCardSheet() {
        let sheetUrl = new PIXI.BaseTexture.from(app.loader.resources["carta"].url);
        //2710x800 10x2 =: 271 x 400
        let larguraCarta = 271
        let alturaCarta = 400
        texturaCartas["nigiri1"] = new PIXI.Texture(sheetUrl, new PIXI.Rectangle(0*larguraCarta, 0*alturaCarta, larguraCarta, alturaCarta))
        texturaCartas["nigiri2"] = new PIXI.Texture(sheetUrl, new PIXI.Rectangle(1*larguraCarta, 0*alturaCarta, larguraCarta, alturaCarta))
        texturaCartas["nigiri3"] = new PIXI.Texture(sheetUrl, new PIXI.Rectangle(2*larguraCarta, 0*alturaCarta, larguraCarta, alturaCarta))
        texturaCartas["wasabi"] = new PIXI.Texture(sheetUrl, new PIXI.Rectangle(3*larguraCarta, 0*alturaCarta, larguraCarta, alturaCarta))
        
        texturaCartas["default"] = new PIXI.Texture(sheetUrl, new PIXI.Rectangle(4*larguraCarta, 1*alturaCarta, larguraCarta, alturaCarta))
    }
    let once = true;
    let i = 0;
    function animate() {
        auxRender.x.valor = auxRender.x.inicial
        auxRender.y.valor = auxRender.y.inicial
        //app.stage.scale = new PIXI.Point(0.3, 0.3)
        cabecalho.text = 'SUXI GO!          | Baralho: '+game.state.numCartasBaralho()+'             | Turno: '+game.state.rodada+"."+game.state.turno;

        if (once) { console.log("JOGADORES"); console.log(game.state.jogadores) }

        let nomeJogadores = []
        for (const jogadorId in game.state.jogadores) {
            nomeJogadores.push(jogadorId)
        }
        for (let i = nomeJogadores.length; i < game.state.numJogadores; i++) {
            nomeJogadores.push('-')
        }
        if (once) { console.log('nomeJogadores'); console.log(nomeJogadores); }

        matrizObjetos.forEach((dadosJogador, index) => {
            let textoCabecalho = dadosJogador[0]
            if (once) { console.log('textoCabecalho'); console.log(textoCabecalho); }
            if (once) { console.log('nomeJogadores[index]'); console.log(nomeJogadores[index]); }
            // let j = game.state.jogadores[jogadorId]
            // 'Jogador: ' + jogadorId + " | Pontos: " + j.somaPontos + " | Escolheu -> " + j.escolheu

            //Atualiza mão
            let spritesMao = dadosJogador[1]
            let cartasMao = []
            if (once) { console.log('index'); console.log(index); }
            if (once) { console.log('nomeJogadores[index]'); console.log(nomeJogadores[index]); }
            
            if (once) { console.log('game.state.jogadores'); console.log(game.state.jogadores); }
            if (nomeJogadores[index] != '-') {
                if (once) { console.log('game.state.jogadores[nomeJogadores[index]].mao'); console.log(game.state.jogadores[nomeJogadores[index]].mao); }
                for (const cartaId in game.state.jogadores[nomeJogadores[index]].mao) {
                    cartasMao.push(game.state.jogadores[nomeJogadores[index]].mao[cartaId])
                }
            }
            if (once) { console.log('cartasMao'); console.log(cartasMao); }
            // Atualiza as informações das cartas nos sprites
            for (let i = 0; i < cartasMao.length; i++) {
                spritesMao[i]['carta'] = cartasMao[i]
                spritesMao[i].texture = texturaCartas[cartasMao[i].nome]
                spritesMao[i].interactive = true
                spritesMao[i].buttonMode = true
                if (!spritesMao[i]._events.pointertap) {
                    spritesMao[i].on('pointertap', cliqueNaCarta)
                }
            }
            // Atualiza o resto como default
            for (let i = cartasMao.length; i < spritesMao.length; i++) {
                spritesMao[i]['carta'] = null
                spritesMao[i].texture = texturaCartas['default']
                spritesMao[i].interactive = false
                spritesMao[i].buttonMode = false
                if (spritesMao[i]._events.pointertap) {
                    spritesMao[i].off('pointertap', cliqueNaCarta)
                }
            }

            //Atualiza mesa
            let spritesMesa = dadosJogador[2]
            let textosMesa = dadosJogador[3]
            let cartasMesa = []
            if (nomeJogadores[index] != '-') {
                for (const cartaId in game.state.jogadores[nomeJogadores[index]].mesa) {
                    cartasMesa.push(game.state.jogadores[nomeJogadores[index]].mesa[cartaId])
                }
            }
            // Atualiza as informações das cartas da mesa nos sprites
            for (let i = 0; i < cartasMesa.length; i++) {
                spritesMesa[i].texture = texturaCartas[cartasMesa[i].nome]
                textosMesa[i].text = cartasMesa[i].nome
            }
            // Atualiza o resto da mesa como default
            for (let i = cartasMesa.length; i < spritesMesa.length; i++) {
                spritesMesa[i].texture = texturaCartas['default']
                textosMesa[i].text = 'default'
            }
        })

        once = false;
    }
    /*
    requestAnimationFrame(() => {
                renderGame(screen, game)
            })
            */
    return {
        subscribe
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