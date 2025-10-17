// === Mode clair / sombre ===
const toggle = document.createElement("button");
toggle.className = "mode-toggle";
toggle.textContent = "🌙"; // icône lune pour le mode clair
document.body.appendChild(toggle);

// Charger le mode depuis le stockage local
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggle.textContent = "☀️";
}

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  toggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

