// js/perfil_vendedor_comprador.js
document.addEventListener("DOMContentLoaded", () => {
  const vendedorBtn = document.querySelector(".option.vendedor");
  const compradorBtn = document.querySelector(".option.comprador");

  function selecionarTipo(tipo) {
    localStorage.setItem("tipoUsuario", tipo);
    window.location.href = "cadastro_pessoal.html"; // vai pro formulário
  }

  vendedorBtn.addEventListener("click", (e) => {
    e.preventDefault();
    selecionarTipo("vendedor");
  });

  compradorBtn.addEventListener("click", (e) => {
    e.preventDefault();
    selecionarTipo("comprador");
  });
});
