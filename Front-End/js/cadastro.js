// js/cadastro.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastroPessoal");

 //  Adiciona máscaras aos campos
  const cpfInput = document.getElementById("cpf");
  const telefoneInput = document.getElementById("telefone");
  const cepInput = document.getElementById("cep");

  if (cpfInput) {
    cpfInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
      }
    });
  }

  if (telefoneInput) {
    telefoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
      }
    });
  }

  if (cepInput) {
    cepInput.addEventListener("input", async (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 8) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
      }

      //  Buscar CEP automaticamente quando completo
      if (value.replace(/\D/g, '').length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${value.replace(/\D/g, '')}/json/`);
          const data = await response.json();

          if (!data.erro) {
            document.getElementById("endereco").value = data.logradouro || '';
            document.getElementById("bairro").value = data.bairro || '';
            document.getElementById("cidade").value = data.localidade || '';
            document.getElementById("uf").value = data.uf || '';
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
        }
      }
    });
  }
  //  Fim das máscaras

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
