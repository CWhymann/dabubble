# DABubble: Stand

Stand: 13.10.2026

## Umgesetzt und geprüft

- Anmeldung über E-Mail, Registrierung, Passwort zurücksetzen, Google und Gast.
- Channels, Direktnachrichten, Threads, Reaktionen, Mitglieder, Profile.
- Live-Aktualisierung über Supabase Realtime für Nachrichten, Antworten und Reaktionen.
- Online-Status über Supabase Presence (grün/grau).
- Ungelesene Chats sind fett mit Punkt markiert, Direktnachrichten sortieren sich nach letzter Aktivität.
- Gäste lesen Channels und Channel-Nachrichten, können aber nichts schreiben. Stattdessen erscheint der Hinweis, ein Konto zu erstellen.
- Direktnachrichten sind für Gäste gesperrt.
- Veröffentlichung über GitHub Pages mit Workflow, Build geprüft mit Node 24.
- Typprüfung und Tests (31 Tests) laufen durch.
- Sicherheits-Check in Supabase durchgeführt, Hilfsfunktionen nur für angemeldete Nutzer aufrufbar.

## Offen

- Avatare im Kopfbereich nutzen teilweise noch feste Bilder statt des Profil-Avatars.
- `home.ts` liegt bei genau 400 Zeilen. Bei weiteren Ergänzungen die Profil-Dialoge in eigene Komponenten auslagern.
- Figma: Abgleich der Oberfläche mit der Vorlage im Browser noch nicht vollständig.
- Captcha für Anmeldungen ist aus (würde sonst die App blockieren).
- Schutz vor geleakten Passwörtern gibt es nur im Pro-Plan von Supabase.
- Die Anmeldebestätigung per E-Mail ist eingeschaltet, Google-Anmeldung funktioniert nur für eingetragene Testnutzer, solange die App nicht von Google geprüft ist.

## Datenbank

Projekt `own-join`, das DABubble und OWN-JOIN gemeinsam nutzen. Die Tabellen `contacts` und `tasks` gehören zu OWN-JOIN. Migrationen liegen unter `supabase/migrations/`. Einige Änderungen (Gast-Regeln, Sicherheits-Korrekturen) sind direkt in der Datenbank angelegt, nicht alle sind als Migration im Repo dokumentiert.
