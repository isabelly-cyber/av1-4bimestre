// =========================================
// BELLE CLINIC - FUNCIONALIDADES JAVASCRIPT
// =========================================


// CONFIGURAÇÃO DO EMAILJS
// Os identificadores podem ser configurados futuramente.

const EMAILJS_SERVICE_ID = "SEU_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "SEU_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "SUA_PUBLIC_KEY";


// ELEMENTOS DO FORMULÁRIO

const formAgendamento = document.querySelector("#formAgendamento");

const inputNome = document.querySelector("#nome");
const inputTelefone = document.querySelector("#telefone");
const inputEmail = document.querySelector("#email");
const inputServico = document.querySelector("#servico");
const inputData = document.querySelector("#data");
const inputObservacao = document.querySelector("#observacao");

const feedback = document.querySelector("#feedback");
const listaAgendamentos = document.querySelector("#listaAgendamentos");
const areaAgendamentos = document.querySelector("#areaAgendamentos");
const contadorAgendamentos = document.querySelector("#contadorAgendamentos");
const btnEnviar = document.querySelector("#btnEnviar");


// ARRAY DE AGENDAMENTOS

// Guarda as solicitações enquanto a página estiver aberta.

const agendamentos = [];


// DATA MÍNIMA DO FORMULÁRIO

function definirDataMinima() {

    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    inputData.min = `${ano}-${mes}-${dia}`;
}

definirDataMinima();


// MENSAGENS DE ERRO

function mostrarErro(id, mensagem) {

    const campo = document.querySelector(`#${id}`);
    const idCampo = id.replace("erro", "").toLowerCase();
    const elemento = document.querySelector(`#${idCampo}`);

    campo.textContent = mensagem;
    elemento.classList.add("is-invalid");
}


// LIMPAR ERROS

function limparErros() {

    const campos = document.querySelectorAll(
        "#formAgendamento .form-control, #formAgendamento .form-select"
    );

    campos.forEach((campo) => {
        campo.classList.remove("is-invalid");
    });

    const mensagens = document.querySelectorAll(
        "#formAgendamento .invalid-feedback"
    );

    mensagens.forEach((mensagem) => {
        mensagem.textContent = "";
    });

    feedback.textContent = "";
    feedback.className = "mt-3";
}


// VALIDAÇÃO DO FORMULÁRIO

function validarFormulario() {

    limparErros();

    const nome = inputNome.value.trim();
    const telefone = inputTelefone.value.trim();
    const email = inputEmail.value.trim();
    const servico = inputServico.value;
    const data = inputData.value;

    let formularioValido = true;


    // Validação do nome

    if (nome.length < 3) {

        mostrarErro(
            "erroNome",
            "Digite um nome com pelo menos 3 caracteres."
        );

        formularioValido = false;
    }


    // Validação do telefone

    const numerosTelefone = telefone.replace(/\D/g, "");

    if (numerosTelefone.length < 10 || numerosTelefone.length > 11) {

        mostrarErro(
            "erroTelefone",
            "Digite um telefone válido."
        );

        formularioValido = false;
    }


    // Validação do e-mail

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email)) {

        mostrarErro(
            "erroEmail",
            "Digite um e-mail válido."
        );

        formularioValido = false;
    }


    // Validação do procedimento

    if (servico === "") {

        mostrarErro(
            "erroServico",
            "Selecione um procedimento."
        );

        formularioValido = false;
    }


    // Validação da data

    if (data === "") {

        mostrarErro(
            "erroData",
            "Escolha uma data."
        );

        formularioValido = false;

    } else if (data < inputData.min) {

        mostrarErro(
            "erroData",
            "Escolha uma data a partir de hoje."
        );

        formularioValido = false;
    }

    return formularioValido;
}


// FORMATAÇÃO DA DATA PARA EXIBIÇÃO

function formatarData(data) {

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// CADASTRAR AGENDAMENTO NO ARRAY

function cadastrarAgendamento() {

    const agendamento = {

        id: Date.now(),

        nome: inputNome.value.trim(),

        telefone: inputTelefone.value.trim(),

        email: inputEmail.value.trim(),

        servico: inputServico.value,

        data: inputData.value,

        observacao: inputObservacao.value.trim(),

        emailEnviado: false,

        statusEmail: "Aguardando envio"
    };

    agendamentos.push(agendamento);

    return agendamento;
}


// EXIBIR AGENDAMENTOS NA PÁGINA

function mostrarAgendamentos() {

    listaAgendamentos.textContent = "";


    // Esconde a lista quando não existem solicitações.

    if (agendamentos.length === 0) {

        areaAgendamentos.classList.add("d-none");

        return;
    }

    areaAgendamentos.classList.remove("d-none");


    contadorAgendamentos.textContent =
        `${agendamentos.length} solicitação(ões)`;


    agendamentos.forEach((agendamento) => {

        // Coluna do Bootstrap

        const coluna = document.createElement("div");

        coluna.className = "col-md-6 col-lg-4";


        // Cartão

        const card = document.createElement("div");

        card.className = "agendamento-card";


        // Nome

        const nome = document.createElement("h4");

        nome.textContent = agendamento.nome;


        // Telefone

        const telefone = document.createElement("p");

        telefone.textContent = `Telefone: ${agendamento.telefone}`;


        // E-mail

        const email = document.createElement("p");

        email.textContent = `E-mail: ${agendamento.email}`;


        // Procedimento

        const servico = document.createElement("p");

        servico.textContent = `Procedimento: ${agendamento.servico}`;


        // Data

        const data = document.createElement("p");

        data.textContent =
            `Data desejada: ${formatarData(agendamento.data)}`;


        // Observação

        const observacao = document.createElement("p");

        observacao.textContent = agendamento.observacao
            ? `Observação: ${agendamento.observacao}`
            : "Sem observações.";


        // Situação do envio do e-mail

        const statusEmail = document.createElement("span");

        statusEmail.className = "status-email";


        if (agendamento.statusEmail === "Enviado") {

            statusEmail.textContent = "E-mail enviado com sucesso";

            statusEmail.classList.add("enviado");

        } else if (agendamento.statusEmail === "Falhou") {

            statusEmail.textContent = "Não foi possível enviar o e-mail";

            statusEmail.classList.add("falhou");

        } else if (agendamento.statusEmail === "Não configurado") {

            statusEmail.textContent = "E-mail ainda não configurado";

            statusEmail.classList.add("falhou");

        } else {

            statusEmail.textContent = "Enviando e-mail...";
        }


        // Botão de remover

        const botaoRemover = document.createElement("button");

        botaoRemover.type = "button";

        botaoRemover.className = "btn btn-remover mt-3";

        botaoRemover.textContent = "Remover solicitação";

        botaoRemover.dataset.id = agendamento.id;


        // Montagem do cartão

        card.append(
            nome,
            telefone,
            email,
            servico,
            data,
            observacao,
            statusEmail,
            document.createElement("br"),
            botaoRemover
        );

        coluna.appendChild(card);

        listaAgendamentos.appendChild(coluna);

    });
}


// ENVIAR AGENDAMENTO POR E-MAIL

async function enviarEmail(agendamento) {

    // Verifica se os identificadores foram configurados.

    const emailConfigurado =
        EMAILJS_SERVICE_ID !== "SEU_SERVICE_ID" &&
        EMAILJS_TEMPLATE_ID !== "SEU_TEMPLATE_ID" &&
        EMAILJS_PUBLIC_KEY !== "SUA_PUBLIC_KEY";


    if (!emailConfigurado || typeof emailjs === "undefined") {

        agendamento.statusEmail = "Não configurado";

        mostrarAgendamentos();

        return false;
    }


    // Dados enviados ao modelo de e-mail do EmailJS.

    const dadosEmail = {

        nome: agendamento.nome,

        telefone: agendamento.telefone,

        email_cliente: agendamento.email,

        servico: agendamento.servico,

        data: formatarData(agendamento.data),

        observacao: agendamento.observacao || "Nenhuma observação.",

        data_solicitacao: new Date().toLocaleString("pt-BR")
    };


    try {

        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            dadosEmail,
            {
                publicKey: EMAILJS_PUBLIC_KEY
            }
        );

        agendamento.emailEnviado = true;

        agendamento.statusEmail = "Enviado";

        mostrarAgendamentos();

        return true;


    } catch (erro) {

        console.error("Erro ao enviar e-mail:", erro);

        agendamento.emailEnviado = false;

        agendamento.statusEmail = "Falhou";

        mostrarAgendamentos();

        return false;
    }
}


// MENSAGEM DE FEEDBACK

function mostrarFeedback(mensagem, tipo) {

    feedback.textContent = mensagem;

    feedback.className = `alert alert-${tipo} mt-3`;
}


// ENVIO DO FORMULÁRIO

async function cadastrarSolicitacao(event) {

    event.preventDefault();


    if (!validarFormulario()) {

        mostrarFeedback(
            "Confira os campos destacados e tente novamente.",
            "danger"
        );

        return;
    }


    btnEnviar.disabled = true;

    btnEnviar.textContent = "Enviando solicitação...";


    // Cadastra a solicitação no array.

    const novoAgendamento = cadastrarAgendamento();


    // Atualiza a lista na página.

    mostrarAgendamentos();


    // Tenta enviar os dados por e-mail.

    const emailEnviado = await enviarEmail(novoAgendamento);


    if (emailEnviado) {

        mostrarFeedback(
            "Solicitação cadastrada e enviada para o e-mail da clínica!",
            "success"
        );

    } else if (novoAgendamento.statusEmail === "Não configurado") {

        mostrarFeedback(
            "Solicitação cadastrada na página. O envio por e-mail ainda precisa ser configurado.",
            "warning"
        );

    } else {

        mostrarFeedback(
            "Solicitação cadastrada na página, mas não foi possível enviar o e-mail.",
            "warning"
        );
    }


    // Limpa o formulário.

    formAgendamento.reset();

    definirDataMinima();

    btnEnviar.disabled = false;

    btnEnviar.innerHTML =
        'Enviar solicitação <i class="bi bi-arrow-right ms-2"></i>';
}


// EVENTO DE ENVIO

formAgendamento.addEventListener("submit", cadastrarSolicitacao);


// REMOVER AGENDAMENTO

listaAgendamentos.addEventListener("click", (event) => {

    if (event.target.classList.contains("btn-remover")) {

        const id = Number(event.target.dataset.id);

        const indice = agendamentos.findIndex(
            (agendamento) => agendamento.id === id
        );


        if (indice !== -1) {

            agendamentos.splice(indice, 1);
        }


        mostrarAgendamentos();

        mostrarFeedback(
            "Solicitação removida da lista.",
            "info"
        );
    }

});


// BOTÕES DOS PROCEDIMENTOS

const botoesServico = document.querySelectorAll(".btn-service");

botoesServico.forEach((botao) => {

    botao.addEventListener("click", () => {

        inputServico.value = botao.dataset.service;

        document.querySelector("#agendamento").scrollIntoView({
            behavior: "smooth"
        });

    });

});


// =========================================
// PLAYER DE MÚSICA
// =========================================

const musicaAmbiente = document.querySelector("#musicaAmbiente");

const btnMusica = document.querySelector("#btnMusica");

const estadoMusica = document.querySelector("#estadoMusica");

const volumeMusica = document.querySelector("#volumeMusica");


if (musicaAmbiente && btnMusica && estadoMusica && volumeMusica) {

    musicaAmbiente.volume = Number(volumeMusica.value);


    // Tocar e pausar música

    btnMusica.addEventListener("click", async () => {

        if (musicaAmbiente.paused) {

            try {

                await musicaAmbiente.play();

            } catch (erro) {

                estadoMusica.textContent = "Não foi possível reproduzir";

                console.error("Erro ao reproduzir música:", erro);
            }

        } else {

            musicaAmbiente.pause();
        }

    });


    // Controle de volume

    volumeMusica.addEventListener("input", () => {

        musicaAmbiente.volume = Number(volumeMusica.value);

    });


    // Atualiza o botão quando a música começa

    musicaAmbiente.addEventListener("play", () => {

        btnMusica.innerHTML = '<i class="bi bi-pause-fill"></i>';

        btnMusica.setAttribute("aria-label", "Pausar música");

        estadoMusica.textContent = "Reproduzindo";

    });


    // Atualiza o botão quando a música pausa

    musicaAmbiente.addEventListener("pause", () => {

        btnMusica.innerHTML = '<i class="bi bi-play-fill"></i>';

        btnMusica.setAttribute("aria-label", "Tocar música");

        estadoMusica.textContent = "Pausada";

    });

} 