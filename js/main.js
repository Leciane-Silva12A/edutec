document.addEventListener("DOMContentLoaded", function() {
    const btn = document.querySelector(".btn"); 
    const target = document.querySelector("#relacoes"); 

    btn.addEventListener("click", function(event) {
      event.preventDefault(); 
      target.scrollIntoView({ behavior: "smooth" }); 
    });
  });