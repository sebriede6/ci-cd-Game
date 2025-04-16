// server/server.js
import express from 'express'; // Modernes ES-Modul importieren
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { open } from 'sqlite'; // Hilfsfunktion zum Öffnen der DB mit Promises

// --- Konfiguration ---
const app = express();
const PORT = 3001; // Port, auf dem der Backend-Server läuft
const DB_FILE = './game_database.db'; // Name der Datenbankdatei

// --- Datenbank-Setup (Asynchron) ---
let db; // Variable für die Datenbankverbindung

async function initializeDatabase() {
    try {
        // Datenbank öffnen (oder erstellen, wenn sie nicht existiert)
        db = await open({
            filename: DB_FILE,
            driver: sqlite3.Database // Den SQLite3-Treiber verwenden
        });
        console.log('Connected to the SQLite database.');

        // Tabelle erstellen, wenn sie nicht existiert (mit nur einer Zeile für den Spielstand)
        await db.exec(`
            CREATE TABLE IF NOT EXISTS game_state (
                id INTEGER PRIMARY KEY CHECK (id = 1), -- Stellt sicher, dass es nur ID 1 gibt
                score INTEGER NOT NULL DEFAULT 0     -- Der Spielstand, Standardwert 0
            );
        `);

        // Sicherstellen, dass die Zeile mit id=1 existiert (nur beim ersten Mal einfügen)
        await db.run('INSERT OR IGNORE INTO game_state (id, score) VALUES (1, 0)');
        console.log('Database table initialized.');

    } catch (err) {
        console.error('Error initializing database:', err.message);
        process.exit(1); // Beenden, wenn DB-Setup fehlschlägt
    }
}

// --- Middleware ---
app.use(cors()); // CORS für alle Anfragen erlauben (für Entwicklung ok)
app.use(express.json()); // Eingehende JSON-Requests parsen (wichtig für PUT)

// --- API Endpunkte ---

// GET /api/score - Den aktuellen Spielstand holen
app.get('/api/score', async (req, res) => {
    try {
        // Den Score aus der Datenbank lesen (es gibt nur die Zeile mit id=1)
        const result = await db.get('SELECT score FROM game_state WHERE id = 1');
        if (result) {
            res.json({ score: result.score }); // Ergebnis als JSON senden
        } else {
            // Sollte dank Initialisierung nicht passieren, aber sicher ist sicher
            res.status(404).json({ message: 'Score not found' });
        }
    } catch (err) {
        console.error('Error fetching score:', err.message);
        res.status(500).json({ message: 'Failed to fetch score' });
    }
});

// PUT /api/score - Den Spielstand aktualisieren
app.put('/api/score', async (req, res) => {
    const { newScore } = req.body; // Den neuen Score aus dem Request Body holen

    // Einfache Validierung
    if (typeof newScore !== 'number') {
        return res.status(400).json({ message: 'Invalid score value provided.' });
    }

    try {
        // Den Score in der Datenbank aktualisieren
        const result = await db.run('UPDATE game_state SET score = ? WHERE id = 1', [newScore]);

        if (result.changes === 0) {
             // Sollte nicht passieren, wenn die ID 1 existiert
             return res.status(404).json({ message: 'Score record not found to update.' });
        }

        console.log(`Score updated to ${newScore}`);
        // Den gerade aktualisierten Score zurücksenden
        res.json({ score: newScore });

    } catch (err) {
        console.error('Error updating score:', err.message);
        res.status(500).json({ message: 'Failed to update score' });
    }
});

// --- Server starten ---
async function startServer() {
    await initializeDatabase(); // Erst DB initialisieren...
    app.listen(PORT, () => {   // ...dann Server starten
        console.log(`Backend server running at http://localhost:${PORT}`);
    });
}

startServer(); // Die Startfunktion aufrufen