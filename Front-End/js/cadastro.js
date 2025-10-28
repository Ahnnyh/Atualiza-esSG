// js/cadastro.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastroPessoal");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const uf = document.getElementById("uf").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const complemento = document.getElementById("complemento").value.trim();

    if (!nome || !cpf || !email) {
      alert("Preencha os campos obrigatórios: Nome, CPF e E-mail!");
      return;
    }

    const userData = {
      nome: `${nome} ${sobrenome}`.trim(),
      cpf_cnpj: cpf,
      email,
      telefone,
      cep,
      cidade,
      uf,
      endereco,
      numero,
      bairro,
      complemento
    };

    localStorage.setItem("usuarioDados", JSON.stringify(userData));

    window.location.href = "cadastro_senha.html";
  });
});
