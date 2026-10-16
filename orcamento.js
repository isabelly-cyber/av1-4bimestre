const formulario = document.querySelector("#formulario");
const inputNome = document.querySelector("#nome");
const inputServico = document.querySelector("#servico");
const inputQuantidade = document.querySelector("#quantidade");
const inputResultado = document.querySelector("#resultado");

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = inputNome.value.trim();
    const preco = Number(inputServico.value);
    const quantidadeString = inputQuantidade.value.trim();
    const quantidade = Number(quantidadeString);

    resultado.classList.remove(
        "d-none",
        "alert-info",
        "alert-danger",
        "alert-success",
        "alert-warning"
    );

    if (
        nome === "" ||
        inputServico.value === "" ||
        quantidadeString === "" ||
        !Number.isInteger(quantidade) ||
        quantidade <= 0
    ) {
        resultado.classList.add("alert-warning");
        resultado.textContent = "Preencha todos os campos corretamente!";
        return;
    }

    const total = calcularTotal(preco, quantidade);

    resultado.textContent =
        `Olá, ${nome}! O orçamento será de R$ ${total.toFixed(2)}.`;

    resultado.classList.add("alert-success");
});

function calcularTotal(preco, quantidade) {
    return preco * quantidade;
}