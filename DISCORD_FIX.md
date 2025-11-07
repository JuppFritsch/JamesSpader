# 🔧 Discord Webhook Problem lösen

## ❌ Problem: "Discord Nachricht kommt nicht an"

Das liegt daran, dass die Webhook-URL noch nicht konfiguriert ist.

## ✅ Lösung - Schritt für Schritt:

### 1. Discord Server öffnen
- Gehen Sie zu: `https://discord.gg/kEapwydeBM`

### 2. Webhook erstellen
1. **Rechtsklick** auf einen Channel (z.B. #anwalts-anfragen)
2. Wählen Sie **"Channel bearbeiten"**
3. Klicken Sie links auf **"Integrationen"**
4. Klicken Sie auf **"Webhooks"** 
5. Klicken Sie **"Neuer Webhook"**

### 3. Webhook konfigurieren
- **Name**: `Kanzlei James Spader Website`
- **Profilbild**: Optional ein Anwaltsbild hochladen
- **Channel**: Den gewünschten Channel auswählen

### 4. URL kopieren und einfügen
1. Klicken Sie **"Webhook-URL kopieren"**
2. Öffnen Sie `script.js` in einem Texteditor
3. Suchen Sie nach Zeile 60:
   ```javascript
   const WEBHOOK_URL = 'HIER_WEBHOOK_URL_EINFÜGEN';
   ```
4. Ersetzen Sie `HIER_WEBHOOK_URL_EINFÜGEN` mit Ihrer URL:
   ```javascript
   const WEBHOOK_URL = 'https://discord.com/api/webhooks/1234567890/abcdef...';
   ```

### 5. Speichern und testen
- Speichern Sie `script.js`
- Aktualisieren Sie die Website (F5)
- Testen Sie das Kontaktformular

## 🎯 Nach der Konfiguration erhalten Sie:

```
📋 Neue Rechtsberatungsanfrage - Kanzlei James Spader

👤 Mandant: Max Mustermann
💬 Discord: MaxMuster#1234
⚖️ Rechtsgebiet: 📄 Verträge aufsetzen
🕐 Eingegangen: 07.11.2025, 15:30:00
🏢 Server: Los Santos Legal
📝 Anliegen: Ich brauche einen Kaufvertrag für mein neues Auto...
```

## ⚠️ Wichtige Hinweise:
- **Ohne Webhook-URL**: Nachrichten werden nur in der Browser-Konsole angezeigt
- **Mit Webhook-URL**: Nachrichten landen direkt in Discord
- **Testen Sie**: Füllen Sie das Formular aus und prüfen Sie Discord

## 🔍 Problembehandlung:
- **404 Fehler**: Webhook wurde gelöscht oder URL ist falsch
- **403 Fehler**: Keine Berechtigung für den Channel
- **CORS Fehler**: Normal bei lokaler Datei, funktioniert auf Webserver

Nach der Konfiguration funktioniert alles perfekt! 🚀