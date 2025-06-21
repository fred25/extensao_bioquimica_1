let vida = 100;
let atp = 3;
let metabolitos = 3;
let glicose = 1;
let turno = 0;
let respiracaoEtapa = 0;

const descricoes = {
    atp: {
        texto: "ATP (Adenosina Tri Fosfato) é a principal molécula energética da célula, utilizada para vários processos celulares. É comumente chamada de moeda energética da célula.",
        imagem: "images/atp.png"
    },
    metabolito: {
        texto: "Metabólitos são produtos residuais do metabolismo. Se acumulados, podem ser tóxicos e prejudicar a célula. No caso da fermentação lática é o ácido lático e na respiração celular é o gás carbônico (CO2)",
        imagem: "images/metabolito.png"
    },
    glicose: {
        texto: "Glicose é a principal fonte de energia para a célula. Ela é utilizada nos processos de fermentação e respiração celular.",
        imagem: "images/glicose.png"
    },
    nucleo: {
        texto: "Núcleo: Centro de comando da célula. Contém o DNA e controla todas as funções celulares, incluindo a síntese proteica.",
        imagem: "images/nucleo.jpg"
    },
    mitocondria: [
        {
            texto: "Mitocôndria: Repouso. A mitocôndria está pronta para iniciar a respiração celular.",
            imagem: "images/mitocondria.png"
        },
        {
            texto: "Mitocôndria: Glicólise - Primeira etapa da respiração. Quebra da glicose em piruvato no citoplasma.",
            imagem: "images/glicolise.png"
        },
        {
            texto: "Mitocôndria: Ciclo de Krebs - Segunda etapa. O piruvato é processado gerando elétrons de alta energia.",
            imagem: "images/krebs.png"
        },
        {
            texto: "Mitocôndria: Fosforilação Oxidativa - Terceira etapa. Onde a maior parte do ATP é produzido.",
            imagem: "images/fosforilacao.png"
        }
    ]
};

function atualizarInterface() {
    document.getElementById("atp").innerText = atp;
    document.getElementById("metabolitos").innerText = metabolitos;
    document.getElementById("glicose").innerText = glicose;
    document.getElementById("turno").innerText = turno;

    if (turno < 10) {
        document.getElementById("btn_resp").hidden = true;
        document.getElementById("nucleo").hidden = true;
        document.getElementById("imagemMitocondria").hidden = true;
        document.getElementById("nomeCelula").innerText = "Procarionte";
    } else{
        document.getElementById("btn_resp").hidden = false;
        document.getElementById("nucleo").hidden = false;
        document.getElementById("imagemMitocondria").hidden = false;
        document.getElementById("nomeCelula").innerText = "Eucarionte";
    }

    const vidaPercent = Math.max(vida, 0);
    const barraVida = document.getElementById("vidaBar");
    barraVida.style.width = vidaPercent + "%";

    // Atualizar cor da barra de vida com gradiente verde → amarelo → vermelho
    const percent = vidaPercent / 100;
    let r, g, b;

    if (percent > 0.5) {
        // De verde até amarelo
        const factor = (1 - percent) * 2;
        r = Math.floor(255 * factor);
        g = 255;
        b = 0;
    } else {
        // De amarelo até vermelho
        const factor = percent * 2;
        r = 255;
        g = Math.floor(255 * factor);
        b = 0;
    }

    barraVida.style.backgroundColor = `rgb(${r},${g},${b})`;

    const area = document.getElementById("conteudoCelula");
    area.innerHTML = "";

    for (let i = 0; i < atp; i++) criarBolinha("atp");
    for (let i = 0; i < metabolitos; i++) criarBolinha("metabolito");
    for (let i = 0; i < glicose; i++) criarBolinha("glicose");

    const mitocondria = document.getElementById("imagemMitocondria");
    const coresEtapa = ["gray", "orange", "red", "green"];
    mitocondria.style.backgroundColor = coresEtapa[respiracaoEtapa];

    mitocondria.onmousemove = (e) => mostrarTooltip(e, "mitocondria");
    mitocondria.onmouseleave = esconderTooltip;

    const nucleo = document.getElementById("nucleo");
    nucleo.onmousemove = (e) => mostrarTooltip(e, "nucleo");
    nucleo.onmouseleave = esconderTooltip;

    gerarFormaCelularAleatoria();
}

function criarBolinha(tipo) {
    const area = document.getElementById("conteudoCelula");
    const bolinha = document.createElement("div");
    bolinha.classList.add("objetoDentroCelula");

    if (tipo === "atp") bolinha.classList.add("atp");
    if (tipo === "metabolito") bolinha.classList.add("metabolito");
    if (tipo === "glicose") bolinha.classList.add("glicose");

    const maxPosX = 285;
    const maxPosY = 235;
    bolinha.style.left = Math.random() * maxPosX + "px";
    bolinha.style.top = Math.random() * maxPosY + "px";

    bolinha.addEventListener("mousemove", (event) => mostrarTooltip(event, tipo));
    bolinha.addEventListener("mouseleave", esconderTooltip);

    area.appendChild(bolinha);
}

function mostrarTooltip(event, tipo) {
    const tooltip = document.getElementById("tooltip");
    const texto = document.getElementById("tooltipText");
    const imagem = document.getElementById("tooltipImage");

    if (tipo === "mitocondria") {
        texto.innerText = descricoes.mitocondria[respiracaoEtapa].texto;
        imagem.src = descricoes.mitocondria[respiracaoEtapa].imagem;
    } else {
        texto.innerText = descricoes[tipo].texto;
        imagem.src = descricoes[tipo].imagem;
    }

    tooltip.style.opacity = "0";
    tooltip.style.display = "block";

    const tooltipRect = tooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let left = event.pageX + 10;
    let top = event.pageY + 10;

    if (left + tooltipRect.width > windowWidth) {
        left = windowWidth - tooltipRect.width - 10;
    }
    if (top + tooltipRect.height > windowHeight) {
        top = windowHeight - tooltipRect.height - 10;
    }
    if (left < 10) left = 10;
    if (top < 10) top = 10;

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
    tooltip.style.opacity = "1";
}

function esconderTooltip() {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.opacity = "0";
    tooltip.style.left = "-9999px";
    tooltip.style.top = "-9999px";
    tooltip.style.display = "none";
}

function proximoTurno() {
    turno++;
    vida -= (10 / 4) * metabolitos + 1;
    verificarGameOver();
    if (respiracaoEtapa > 0) {
        respiracaoEtapa++;
        if (respiracaoEtapa === 4) {
            atp += 30;
            metabolitos += 4;
            respiracaoEtapa = 0;
        }
    }

    if (turno === 10) {
        alertar("Evolução para Eucarionte", "A célula evoluiu para um eucarionte! Agora você pode realizar respiração celular");
        document.getElementById("btn_resp").hidden = false;
        document.getElementById("nucleo").hidden = false;
        document.getElementById("imagemMitocondria").hidden = false;
    }

    if (atp === 0) {
        metabolitos += 1;
    }

    const celula = document.getElementById("imagemCelula");
    celula.classList.add("tremer");
    setTimeout(() => {
        celula.classList.remove("tremer");
    }, 300);

    atualizarInterface();
}

function fermentacao() {
    if (glicose >= 1) {
        glicose--;
        atp += 2;
        metabolitos += 2;
        proximoTurno();
    } else{
        alertar("Cuidado!", "Não há glicose suficiente para a fermentação!");
    }
}

function respiracao() {
    if (glicose >= 1 && respiracaoEtapa === 0) {
        glicose--;
        respiracaoEtapa = 1;
        proximoTurno();
    } else if (respiracaoEtapa != 0) {
        alertar("Cuidado!", "A respiração celular já está em andamento!");
    } else{
        alertar("Cuidado!", "Não há glicose suficiente para a respiração celular!");
    }
}

function sinteseProteica() {
    if (atp >= 2) {
        atp -= 2;
        vida += 20;
        if (vida > 100) vida = 100;
        proximoTurno();
    }else{
        alertar("Cuidado", "ATP insuficiente para síntese proteica!");
    }
}

function lisossomo() {
    if (atp >= 2 && metabolitos > 0) {
        atp -= 2;
        metabolitos = Math.max(0, metabolitos - 3);
        proximoTurno();
    } else{
        alertar("Cuidado!", "ATP insuficiente ou nenhum metabolito para o o transporte ativo!");
    }
}

function canalGlicose() {
    glicose++;
    proximoTurno();
}

function verificarGameOver() {
    if (vida <= 0) {
        const gameOver = document.getElementById("gameOverScreen");
        gameOver.classList.add("visible");
        gameOver.classList.remove("hidden");
    }
}

function reiniciarJogo() {
    vida = 100;
    atp = 3;
    metabolitos = 3;
    glicose = 1;
    turno = 0;
    respiracaoEtapa = 0;
    atualizarInterface();
    const gameOver = document.getElementById("gameOverScreen");
    gameOver.classList.remove("visible");
    gameOver.classList.add("hidden");
}

function gerarFormaCelularAleatoria() {
    // Função para criar 8 valores entre 35% e 65%, garantindo formas naturais
    const valores = [];
    for (let i = 0; i < 8; i++) {
        valores.push((35 + Math.random() * 30).toFixed(0) + "%");
    }

    // Formatar: primeiros 4 para horizontal, últimos 4 para vertical
    const borderRadiusValue = `${valores.slice(0, 4).join(" ")} / ${valores.slice(4, 8).join(" ")}`;

    const celula = document.getElementById("imagemCelula");
    celula.style.borderRadius = borderRadiusValue;
}

function alertar(titulo, message) {
    document.getElementById('alertMessage').textContent = message;
    document.getElementById("alertTitle").textContent = titulo;
    document.getElementById('customAlert').style.display = 'flex';
  }
  function fecharAlerta() {
    document.getElementById('customAlert').style.display = 'none';
  }

atualizarInterface();
