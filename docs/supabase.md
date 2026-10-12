# Supabase: Ablauf und Festlegungen (DABubble)

## Ablauf Registrierung

1. Nutzer gibt Name, E-Mail und Passwort ein (Seite Registrieren).
2. Nutzer wählt einen Avatar (Seite Avatar).
3. Die App legt das Konto an: E-Mail, Passwort und in den Metadaten `name` und `avatar`. Der Bestätigungslink führt zurück zu `/login`.
4. Nutzer klickt den Link in der Bestätigungs-Mail. Erst danach ist die Anmeldung möglich.
5. Anmeldung mit E-Mail und Passwort. Erfolg: Meldung „Willkommen zurück!", dann Startseite.

## Ablauf Passwort vergessen

1. „Passwort vergessen" führt zu „E-Mail senden". Die App verschickt den Link (Ziel: `/reset-password`).
2. Nutzer öffnet den Link. Die Seite prüft, ob eine gültige Sitzung da ist.
3. Ungültig oder abgelaufen: Meldung „Der Link ist ungültig oder abgelaufen", Nutzer fordert eine neue E-Mail an.
4. Gültig: neues Passwort speichern, Meldung „Passwort geändert", dann Anmeldung.

## Ablauf Gast

- Gast-Zugang legt ein anonymes Konto an, ohne E-Mail und Passwort.
- Meldung „Willkommen Gast", dann Startseite.
- Beim Abmelden oder Schließen des Browsers ist der Gast weg. Ein neuer Gast-Login ist ein neues Konto.
- Spätere Umwandlung des Gastes in ein Konto mit E-Mail: offen, Thema für später.

## Ablauf Google (noch nicht umgesetzt)

- Button „Anmelden mit Google" ist vorhanden, aber ohne Funktion.
- Supabase legt bei der ersten Anmeldung ein Konto an. Name und Bild kommen aus Google (`full_name`, `avatar_url`).
- Einrichtung im Google-Cloud-Projekt und in der Supabase-Konsole muss der Projektinhaber selbst machen.

## Festlegungen in Supabase (Einstellungen)

- Authentication → Providers → Email: „Confirm email" an (Standard).
- Authentication → Providers: „Anonymous sign-ins" an (für den Gast).
- Authentication → URL Configuration: Site URL und Redirect-URLs für `/login` und `/reset-password` eintragen (lokal und online).

## Datenmodell (Vorschlag, noch nicht umgesetzt)

- `profiles`: id (= Konto-ID), name, avatar. Wird bei der Registrierung angelegt.
- `channels`: id, name, description, created_by, created_at.
- `channel_members`: channel_id, user_id, role (admin oder member).
- `messages`: id, channel_id oder dm_key, author_id, text, created_at, reply_to.
- `reactions`: message_id, user_id, emoji.
- Rechte (RLS) pro Tabelle: werden gemeinsam festgelegt, bevor die Tabellen angelegt werden.

## Offene Punkte

- Rechte pro Rolle (Admin, Ersteller, Mitglied, Gast): gemeinsam festlegen.
- Verhalten nach Bestätigung der E-Mail (direkt anmelden oder Hinweis auf der Anmeldeseite).
- Gast in Konto umwandeln.
- Google-Anmeldung einrichten und anbinden.
- Daten nach Neustart: Umstellung der App von lokalem Speicher auf Supabase.
