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
        texto: "Metabólitos são produtos residuais do metabolismo. Se acumulados, podem ser tóxicos e prejudicar a célula.",
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
    const vidaPercent = Math.max(vida, 0);
    document.getElementById("vidaBar").style.width = vidaPercent + "%";

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
    tooltip.style.display = "block";  // mostra para medir
  
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
    // deixa fora da tela para não atrapalhar interações
    tooltip.style.left = "-9999px";
    tooltip.style.top = "-9999px";
    tooltip.style.display = "none";
  }

  function proximoTurno() {
    turno++;
    vida -= (10 / 3) * metabolitos + 1;
    verificarGameOver();
    if (respiracaoEtapa > 0) {
        respiracaoEtapa++;
        if (respiracaoEtapa === 4) {
            atp += 30;
            metabolitos += 4;
            respiracaoEtapa = 0;
        }
    }

    // Faz a célula tremer no início do turno
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
    }
}

function respiracao() {
    if (glicose >= 1 && respiracaoEtapa === 0) {
        glicose--;
        respiracaoEtapa = 1;
        proximoTurno();
    }
}

function sinteseProteica() {
    if (atp >= 5) {
        atp -= 5;
        vida += 20;
        if (vida > 100) vida = 100;
        proximoTurno();
    }
}

function lisossomo() {
    if (atp >= 3 && metabolitos > 0) {
        atp -= 3;
        metabolitos = Math.max(0, metabolitos - 3);
        proximoTurno();
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

    

atualizarInterface();
