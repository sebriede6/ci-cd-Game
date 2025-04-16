// client/src/App.jsx
import React, { useState, useEffect } from 'react';

// Importiere die neu erstellten Komponenten
import ScoreDisplay from './components/scoreDisplay';
import ScoreControls from './components/ScoreControls';
import ErrorDisplay from './components/ErrorDisplay';
import LoadingIndicator from './components/LoadingIndicator';

// Importiere die CSS-Datei für das Styling
import './App.css';

// Definiere die URL des Backend-Servers
const API_URL = 'http://localhost:3001/api/score';

function App() {
    // === State Hooks ===
    // Speichert den aktuellen Spielstand. null bedeutet "noch nicht geladen".
    const [score, setScore] = useState(null);
    // Speichert eventuelle Fehlermeldungen für die Anzeige.
    const [error, setError] = useState(null);
    // Zeigt an, ob gerade eine Update-Anfrage (Speichern) läuft (true) oder nicht (false).
    // Wird verwendet, um Buttons zu deaktivieren und "Speichere..." anzuzeigen.
    const [isLoading, setIsLoading] = useState(false);
    // Zeigt an, ob der *initiale* Ladevorgang noch läuft.
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // === Effect Hook für initiales Laden ===
    // Dieser Hook wird genau einmal ausgeführt, nachdem die Komponente zum ersten Mal gerendert wurde.
    useEffect(() => {
        // Asynchrone Funktion, um den initialen Score vom Backend zu holen.
        const fetchInitialScore = async () => {
            // Setze vor dem Fetch den Fehler zurück (falls vorher einer aufgetreten ist).
            setError(null);
            try {
                // Sende eine GET-Anfrage an die API.
                const response = await fetch(API_URL);
                // Überprüfe, ob die Antwort erfolgreich war (Status-Code 2xx).
                if (!response.ok) {
                    // Wirf einen Fehler, wenn die Antwort nicht OK ist.
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Parse die JSON-Antwort vom Server.
                const data = await response.json();
                // Aktualisiere den 'score'-State mit dem Wert aus der API.
                setScore(data.score);
            } catch (e) {
                // Fange Fehler beim Fetch oder Parsen ab.
                console.error("Failed to fetch initial score:", e);
                // Setze eine Fehlermeldung für den Benutzer.
                setError("Konnte den Spielstand nicht laden.");
            } finally {
                // Dieser Block wird *immer* ausgeführt, egal ob Erfolg oder Fehler.
                // Setze den initialen Ladezustand auf false.
                setIsInitialLoading(false);
            }
        };

        // Rufe die Funktion zum Laden des initialen Scores auf.
        fetchInitialScore();
    }, []); // Das leere Array [] als zweites Argument sorgt dafür, dass der Effekt nur einmalig ausgeführt wird.

    // === Funktion zum Aktualisieren des Scores ===
    // Diese Funktion wird aufgerufen, wenn einer der Buttons geklickt wird.
    const updateScore = async (change) => {
        // Verhindere Updates, wenn bereits ein Update läuft oder der Score noch nicht initial geladen wurde.
        if (isLoading || score === null) return;

        // Berechne den potenziellen neuen Score.
        const newScore = score + change;

        // Setze den Ladezustand für das Update auf true (deaktiviert Buttons, zeigt "Speichere...").
        setIsLoading(true);
        // Setze eventuelle alte Fehler zurück.
        setError(null);

        try {
            // Sende eine PUT-Anfrage an die API, um den Score zu aktualisieren.
            const response = await fetch(API_URL, {
                method: 'PUT', // HTTP-Methode für Updates
                headers: {
                    'Content-Type': 'application/json', // Signalisiert, dass wir JSON-Daten senden
                },
                // Wandle das JavaScript-Objekt mit dem neuen Score in einen JSON-String um und sende es im Body.
                body: JSON.stringify({ newScore: newScore }),
            });

            // Überprüfe, ob die Antwort vom Server erfolgreich war.
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse die JSON-Antwort (sollte den bestätigten neuen Score enthalten).
            const data = await response.json();
            // Aktualisiere den lokalen 'score'-State mit dem vom Server bestätigten Wert.
            setScore(data.score);

        } catch (e) {
            // Fange Fehler beim Senden oder Verarbeiten der Antwort ab.
            console.error("Failed to update score:", e);
            // Setze eine Fehlermeldung für den Benutzer.
            setError("Konnte den Spielstand nicht speichern.");
            // Hinweis: Hier könnte man überlegen, den alten Score wiederherzustellen,
            // falls das Update fehlschlägt, um UI und DB synchron zu halten.
        } finally {
            // Dieser Block wird immer ausgeführt.
            // Setze den Ladezustand für das Update zurück auf false.
            setIsLoading(false);
        }
    };

    // === JSX - Die Struktur der Benutzeroberfläche ===
    // Hier werden die importierten Komponenten verwendet und mit Daten (Props) versorgt.
    return (
        <div className="App"> {/* Hauptcontainer mit der Klasse "App" für CSS */}
            <h1>Score Game</h1>

            {/* Fehleranzeige: Wird nur gerendert, wenn 'error' einen Wert hat. */}
            {/* Die Logik, ob etwas angezeigt wird, steckt in der ErrorDisplay Komponente selbst. */}
            <ErrorDisplay message={error} />

            {/* Anzeige während des initialen Ladens */}
            {isInitialLoading ? (
                <LoadingIndicator text="Lade Spielstand..." />
            ) : // Anzeige des Scores, wenn initiales Laden beendet und Score vorhanden
              score !== null ? (
                // Übergibt den aktuellen 'score' als Prop an die ScoreDisplay Komponente
                <ScoreDisplay score={score} />
            ) : // Falls weder geladen wird noch ein Score da ist (z.B. nach Fehler beim Laden)
            null}

            {/* Anzeige der Buttons: Nur wenn nicht initial geladen wird UND ein Score vorhanden ist */}
            {!isInitialLoading && score !== null && (
                 // Übergibt Funktionen als Props, die 'updateScore' aufrufen
                 // und den 'isLoading' Status für die Button-Deaktivierung.
                <ScoreControls
                    onIncrement={() => updateScore(1)} // Pfeilfunktion sorgt dafür, dass updateScore(1) erst bei Klick ausgeführt wird
                    onDecrement={() => updateScore(-1)}
                    isLoading={isLoading} // Wird an die 'disabled' Eigenschaft der Buttons weitergegeben
                />
            )}

             {/* Anzeige während des Speicherns (wenn 'isLoading' true ist) */}
             {isLoading && <LoadingIndicator text="Speichere..." />}
        </div>
    );
}

// Exportiere die App-Komponente, damit sie in main.jsx verwendet werden kann.
export default App;