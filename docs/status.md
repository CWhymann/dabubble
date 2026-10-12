## 6. Stand und offene Punkte (Stand 11.10.2026, Nachtrag)

Diese Liste ist ehrlich gemeint: Vieles ist im Code vorhanden, aber nicht im Browser geprüft. Geprüft heißt hier nur: der Build läuft.

### Arbeitsregeln (verbindlich)

- Vor jeder Änderung Repo-Stand und Figma-Frame prüfen.
- Lösung zuerst in Worten beschreiben, auf ein klares Ja warten, dann nur geänderte Dateien vollständig liefern (HTML vor TS).
- Vor dem Senden bauen (`ng build`) und klar sagen, was nicht im Browser geprüft ist.
- Schrift nie kleiner als 14px. Breiten von 320px bis 1440px vorab planen, Figma-Maße nicht blind übernehmen.
- Tailwind-Hinweise der Erweiterung direkt umsetzen.

### Erledigt (im Code, nicht im Browser geprüft)

- Channels anlegen, umbenennen, Mitglieder hinzufügen
- Direktnachrichten, Channel-Wechsel, Profilkarten (eigene und fremde)
- Thread am Desktop und mobil, Antworten werden gespeichert
- Emojis, @-Erwähnungen, Reaktionen mit Zähler, Grenze 7/20 mit „+X weitere"
- Suche mobil und am Desktop (@ Personen, # Channels), Dialog „Neue Nachricht"
- Bestätigungen für „Channel verlassen" und „Abmelden"
- Bearbeiten von eigenen Nachrichten in der Blase (Abbrechen, Speichern)
- Overlays „Konto erstellt", „E-Mail gesendet", „Passwort geändert"
- Button-Zustände nach Figma (Primär und Sekundär)
- Scrollen: Channels und Direktnachrichten getrennt im Menü (Prüfung offen)
- Anmeldung über Supabase: E-Mail, Registrierung, Passwort zurücksetzen, Gast, Abmelden

### Fehler, die korrigiert werden müssen

1. **Absender:** Alle Nachrichten laufen als fester Name „Frederik Beck“, auch Antworten in Direktnachrichten. Die App nutzt den angemeldeten Nutzer noch nicht.
2. **Channel verlassen:** Entfernt aktuell den ganzen Channel. Soll nur die eigene Mitgliedschaft entfernen, der Channel bleibt bestehen.
3. **Antworten in Direktnachrichten:** Im Code abgeschaltet (`canReply`). Die Spezifikation (Note 10) verlangt das nicht.
4. **Antworten-Symbol im Thread:** Fehlt bei Thread-Nachrichten, weil `canReply` dort auf „aus" steht.
5. **Daten nach Neustart:** Alles ist nur im Speicher. Nach einem Neustart ist alles weg (Channels, Nachrichten, Reaktionen, Antworten).
6. **Scrollen der Channel-Liste:** Änderung vorhanden, Wirkung bei vielen Channels nicht bestätigt.
7. **Reaktionsleiste:** Beim Umbau mehrfach verschwunden, zuletzt behoben. Im Browser prüfen.
8. **Auswahl der Emojis:** Öffnet sich unter der Leiste, Breite = Leiste. Im Browser prüfen, besonders oben im Thread.
9. **Bearbeiten-Kasten:** Desktop nach Figma (18px), mobil 14px. Im Browser prüfen.
10. **Overlay nach Anmeldung:** Fehlt. Offen, welcher Text gelten soll (Vorschlag: „Anmelden“ oder „Willkommen zurück!“).
11. **Mobil, Dialog „Abmelden“:** Buttons passen bei 320px nicht nebeneinander. Vorschlag: untereinander, rechtsbündig.
12. **Mitglieder-Dialog (43) am Desktop:** Der Header-Button öffnet nur „Leute hinzufügen“, nicht die Mitgliederliste.

### Offene Entscheidungen

- Absender: Nachrichten sollen den angemeldeten Nutzer verwenden. Ein Testschalter ist dafür nicht nötig.
- Antworten in Direktnachrichten: einschalten (Spezifikation erlaubt es).
- Overlay nach Anmeldung: Text festlegen.

### Nächste große Schritte (eigene Runden)

- **Supabase-Daten:** Tabellen für Channels, Mitgliedschaften, Nachrichten, Reaktionen, Antworten, dazu Zugriffsregeln (RLS). Die Anmeldung über Supabase ist bereits verbunden (E-Mail, Registrierung, Passwort zurücksetzen, Gast, Abmelden). Der Gast-Zugang über anonyme Anmeldung muss sauber abgesichert werden.
- **Google-Anmeldung:** Der Button „Anmelden mit Google“ hat noch keine Funktion, im Code gibt es keinen Aufruf für den Google-Login. Einrichtung im Google-Cloud-Projekt und in der Supabase-Konsole, die Schritte muss der Projektinhaber selbst durchführen.
- **Startseite schützen:** Die Startseite ist ohne Anmeldung erreichbar. Es fehlt eine Routen-Sperre.
- **Test und Feinschliff:** Alle Breiten von 320px bis 1440px im Browser, Ansichten Chat, DM, Thread, Menü, Dialoge.

## 7. Rechte bei Mitgliedern (festgelegt)

- **Admin:** Der Admin ist für die gesamte App zuständig, unabhängig vom Ersteller eines Channels. Aktuell ist das der Nutzer, der die App betreibt.
- **Ersteller eines Channels:** Darf Mitglieder hinzufügen, die er dafür vorsieht. Darf keine Mitglieder entfernen.
- **Mitglieder entfernen:** Nur der Admin, und nur nach Absprache. Der Admin wählt die Mitglieder aus, wie bei der @-Funktion: Mehrere Personen markieren, dann entfernen.
- **Sich selbst entfernen:** Jedes Mitglied darf sich selbst aus einem Channel entfernen. Der Channel bleibt bestehen, nur die eigene Mitgliedschaft endet. Der Channel bleibt in der Seitenleiste.
- **Demo-Hinweis:** Die App kennt bisher nur einen Nutzer (Frederik Beck). Die Admin-Rechte wirken erst mit echten Nutzern aus Supabase (Punkt 1).