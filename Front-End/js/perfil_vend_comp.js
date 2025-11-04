// js/perfil_vend_comp.js
document.addEventListener("DOMContentLoaded", () => {
  const vendedorBtn = document.querySelector(".option.vendedor");
  const compradorBtn = document.querySelector(".option.comprador");

  function selecionarTipo(tipo) {
    console.log("Selecionado:", tipo);
    localStorage.setItem("tipoUsuario", tipo);

    // ⏳ aguarda 100ms antes de redirecionar
    setTimeout(() => {
      window.location.href = "cadastro_pessoal.html";
    }, 100);
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
