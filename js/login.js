document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();
  
    if (!email || !password) {
      alert("Preencha todos os campos!");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:3333/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
  
      if (res.ok && data.userId) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("email", email);
  
        alert("Login realizado com sucesso!");
        window.location.href = "jogar.html"; 
      } else {
        alert(data.message || "Email ou senha inválidos.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Erro ao tentar logar.");
    }
  });