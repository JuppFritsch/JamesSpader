# 🚀 Discord Webhook Setup für Kanzlei James Spader

## 📋 Schritt-für-Schritt Anleitung

### 1. Discord-Server öffnen
- Gehen Sie zu Ihrem Discord-Server: `https://discord.gg/kEapwydeBM`
- Stellen Sie sicher, dass Sie Admin-Rechte haben

### 2. Webhook erstellen
1. **Rechtsklick** auf den gewünschten Channel (z.B. #anwalts-anfragen)
2. Klicken Sie auf **"Channel bearbeiten"**
3. Wählen Sie **"Integrationen"** im linken Menü
4. Klicken Sie auf **"Webhooks"**
5. Klicken Sie **"Neuer Webhook"**

### 3. Webhook konfigurieren
- **Name**: `Kanzlei James Spader`
- **Profilbild**: Laden Sie ein Anwalts-Icon hoch (optional)
- **Channel**: Wählen Sie den gewünschten Channel aus

### 4. Webhook-URL kopieren
- Klicken Sie **"Webhook-URL kopieren"**
- Die URL sollte etwa so aussehen:
  ```
  https://discord.com/api/webhooks/123456789/abcdef...
  ```

### 5. URL in Website einfügen
1. Öffnen Sie `script.js` in einem Texteditor
2. Suchen Sie nach der Zeile:
   ```javascript
   const WEBHOOK_URL = 'HIER_WEBHOOK_URL_EINFÜGEN';
   ```
3. Ersetzen Sie `HIER_WEBHOOK_URL_EINFÜGEN` mit Ihrer kopierten URL:
   ```javascript
   const WEBHOOK_URL = 'https://discord.com/api/webhooks/123456789/abcdef...';
   ```

### 6. Testen
- Speichern Sie die Datei
- Aktualisieren Sie die Website
- Füllen Sie das Kontaktformular aus und senden Sie es ab
- Die Nachricht sollte jetzt in Ihrem Discord-Channel erscheinen!

## 📬 Was passiert dann?

Wenn jemand das Kontaktformular ausfüllt, erhalten Sie eine **schöne Embed-Nachricht** in Discord mit:
- 👤 Name des Mandanten
- 📞 Telefonnummer
- 💬 Discord-Username
- ⚖️ Gewähltes Rechtsgebiet
- 📝 Beschreibung des Anliegens
- 🕐 Zeitstempel

## 🔧 Fehlerbehebung

### "Webhook nicht gefunden"
- Überprüfen Sie, ob die URL korrekt kopiert wurde
- Stellen Sie sicher, dass der Webhook noch existiert

### "Keine Berechtigung"
- Überprüfen Sie Ihre Server-Berechtigungen
- Der Webhook-Channel muss für Sie zugänglich sein

### "CORS-Fehler"
- Das ist normal bei lokalen Tests
- Funktioniert normalerweise auf einem echten Webserver

## 🎉 Fertig!

Ihre Kanzlei James Spader Website ist jetzt vollständig mit Discord integriert!
Alle Mandanten-Anfragen landen direkt in Ihrem RP-Server. 🏛️⚖️