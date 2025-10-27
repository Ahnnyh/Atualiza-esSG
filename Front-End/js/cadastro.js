document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastroPessoal");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nome || !email) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const userData = { nome, email };
    localStorage.setItem("usuarioDados", JSON.stringify(userData));

    // Redireciona para a tela de senha
    window.location.href = "cadastro_senha.html";
  });
});
