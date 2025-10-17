// app/publique/requetes/requete.js
fetch("/api/data")
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector("#contenu");
    container.innerHTML = `<h1>${data.title}</h1>`;

    data.sections.forEach(section => {
      const sec = document.createElement("section");
      sec.innerHTML = `<h2>${section.name}</h2>`;
      section.items.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        `;
        sec.appendChild(div);
      });
      container.appendChild(sec);
    });
  });
