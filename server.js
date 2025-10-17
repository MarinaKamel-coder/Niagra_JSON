import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dossier public (images, CSS, JS)
app.use(express.static(path.join(__dirname, "app/publique")));

// === ROUTES HTML ===
// Chaque page HTML est servie par une route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "app/publique/index.html"));
});

app.get("/programme", (req, res) => {
  res.sendFile(path.join(__dirname, "app/publique/programme.html"));
});

app.get("/inscription", (req, res) => {
  res.sendFile(path.join(__dirname, "app/publique/inscription.html"));
});

app.get("/galerie", (req, res) => {
  res.sendFile(path.join(__dirname, "app/publique/galerie.html"));
});

app.get("/infos", (req, res) => {
  res.sendFile(path.join(__dirname, "app/publique/infos.html"));
});

// === ROUTE JSON ===
app.get("/data", async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, "app/data/data.json"), "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Impossible de charger les données" });
  }
});

// === LANCER SERVEUR ===
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
