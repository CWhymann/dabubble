# DABubble – Figma-Spezifikation (Flows, Notizen, Frames)

Figma-Seite: "Prototype". Stand: 09.10.2026.
Desktop-Frames 1920x1080, Mobile-Frames 430x932.

## 1. Notizen aus Figma (Wortlaut)

- Note 1 (Registrierung): Button ist nur aktiv, wenn das Formular komplett ausgefüllt ist.
- Note 2 (E-Mail senden): Nur aktiv, wenn eine E-Mail-Adresse eingegeben wurde.
- Note 3 (Passwort zurücksetzen): Der Nutzer erhält zuerst eine E-Mail mit einem Link. Der Link leitet auf die Seite weiter, auf der er sein neues Passwort festlegt. Dieser Schritt ist im Prototyp nicht berücksichtigt.
- Note 1M (mobil): Das Zurücksetzen darf nicht verlinkt sein. Die Seite öffnet sich nur über den Link in der E-Mail. Im Prototyp ist sie nur zur Ansicht verbunden.
- Note 4 und 2M (Passwort zurücksetzen): Der Button wird erst aktiv, wenn die Passwörter identisch sind.
- Note 5 (Suchleiste): Die Suchleiste filtert und liefert Ergebnisse aus Kanälen, Benutzerprofilen und Nachrichten im Workspace.
- Note 6 (Mitglieder hinzufügen): Der Button ist nur aktiv und klickbar, wenn eine Auswahl getroffen wurde.
- Note 7 (Channel erstellen): Nach Klick auf "Erstellen" erscheint der neue Channel unten in der Channel-Sektion.
- Note 8 (Mitglieder): Ein Klick auf ein Mitglied zeigt dessen Benutzerprofil an.
- Note 9 (Neue Nachricht): Die Suchfunktion mit Autocomplete bestimmt den Adressaten. Mit "#" wird nach Channels, mit "@" nach Mitgliedern gefiltert.
- Note 2M (Suche mobil, Frames "Searching bar person/channels"): Das sind die beiden Ansichten bei Eingabe von @ oder # in die Suchleiste. Das Schließen-Symbol oben rechts führt zur vorherigen Ansicht zurück.
- Note 10 (Threads): Threads öffnen auf zwei Arten. 1. Beim Überfahren einer Nachricht erscheint ein Menü mit dem Icon "Thread starten". 2. Bei Nachrichten mit Antworten öffnet der Textlink mit der Anzahl (hier "2 Antworten") den Thread. Das Design der Thread-Komponente steht im Components-Tab, Rahmen "04 Chat".
- Note 11 (Reaktionen): Desktop zeigt maximal 20 Reaktionen pro Nachricht. In Threads und mobil maximal 7 Reaktionen in zwei Zeilen. Bei mehr als 7 erscheint ein Rahmen mit "+X weitere". Beim Klick werden alle Reaktionen und die Option "Weniger anzeigen" eingeblendet.
- Note 3M: Der Frame "Channel Edition (not functional but a preview)" ist nur eine Voransicht. Die Funktion steht im Prototyp.

## 2. Frame-IDs (Figma)

Auth Desktop: 00-Intro 128:765, 01-Log In 125:2, 02-Sign In 171:66, 03-Choose avatar 6179:15943, 04-Send email 182:319, 05-Reset password 182:372, Overlay One 182:281, Overlay Two 182:544, Overlay Three 182:546, 17 Gmail-E-Mail 1898:19353, 18 Impressum 5538:15876, 19 Datenschutz 5538:16655.
Auth Mobil: 00-Intro 609:17310, 01-Log In 609:17202, 02-Sign In 609:17276, 03-Choose avatar 6194:22230, 04-Send email 609:17234, 05-Reset password 609:17257, Overlay One 609:17301, Overlay Two 609:17303, Overlay Three 609:17308, Impressum 156062:17209, Datenschutz 156062:17306.

Workspace Desktop: 06 general view 210:750, 07 hidden menu 516:7084, 08 hidden aux chat (Thread) 516:7949, 09 hidden menu and chat 516:9116, 10 Office Team 849:13065, 11 new message 723:10986, 12 DM Sofia 757:12479, 12 A Noah 890:13086, 12 B Elise 890:13446, 12 C Elias 890:13806, 12 D Steffen 890:13831, 12 E Frederik (Du) 890:14526, 13 edit message 1823:16615, 14 hidden menu edit 1823:16556, 15 hidden aux chat edit 1823:16496, 16 hidden menu and chat edit 1823:16439.
Workspace Mobil: 06 Main menu 678:15601, 06 B Main menu 849:14773, 07 Main Chat 609:17393, 08 Secondary Chat (Thread) 742:12168, 09 New message 754:12776, 10 New channel 849:14440, 11 DM Sofia 116336:22036, 11 A Noah 894:15100, 11 B Elise 894:15220, 11 C Elias 894:15340, 11 D Steffen 894:15350, 11 E Frederik (Du) 894:15580, Tagging person 116336:22744, Searching bar person 116184:22571, Searching bar channels 116184:23002.
Overlays/Dialoge: Profile view main 163:188 (Desktop), 609:17312 (mobil); Channel Edition 364:2288 (Desktop), 719:15164 und 1823:21307 (mobil); Add Channel (mobil) 696:13540. Weitere Dialoge (37 Add channel, 38 Add Members, 41 Add members R corner, 43 Members, 64/64b Edit user and Log out, 65 Profile view other users, 31 Workspaces menú) liegen als eigene Komponenten und werden bei Bedarf einzeln ausgelesen.

## 3. Flows

### Auth (Desktop und mobil gleich)
- 00-Intro: automatischer Wechsel (Timeout) zu 01-Log In.
- 01-Log In: "Passwort vergessen?" führt zu 04-Send email. Primär-Button (Anmelden) und Sekundär-Button (Gäste-Login) führen zu 06 Workspace. "Registrieren" führt zu 02-Sign In. Footer: Impressum (18) und Datenschutz (19).
- 02-Sign In: Weiter führt zu 03-Choose avatar. Zurück (13. Go back) führt zu 01.
- 03-Choose avatar: Weiter zeigt Overlay One, danach automatisch 01-Log In. Zurück führt zu 02.
- 04-Send email: Senden zeigt Overlay Two, danach automatisch 05-Reset password (nur im Prototyp, siehe Note 1M). Zurück führt zu 01.
- 05-Reset password: Button zeigt Overlay Three, danach automatisch 01-Log In. Zurück führt zu 04.
- 18 Impressum und 19 Datenschutz: Zurück führt zu 01-Log In.

### Workspace Desktop
- 77 Hide/show navigation button: wechselt zwischen sichtbarem und verstecktem Workspace-Menü (06 und 07, 08 und 09, 13 und 14, 15 und 16).
- 15 Channel name (Workspaces menú 31): Channels-Liste ein- und ausklappen. 21 Channels submenu: Direktnachrichten-Liste ein- und ausklappen.
- 19 add und "News": öffnen 37 Add channel. Danach 38 Add Members after add channel. Danach erscheint der neue Channel (10 Office Team), siehe Note 7.
- 16 edit_square: öffnet 11 new message.
- Klick auf einen Channel (Entwicklerteam, Office team) öffnet den Channel-Chat (06, 10). Klick auf eine Person (Frederik Beck, Sofia Müller, Noah Braun, Elise Roth, Elias Neumann, Steffen Hoffmann) öffnet die DM (12, 12 A bis E).
- 50 button Antworten oder "2 Antworten": öffnet den Thread (06 zu 08). 45 Close im Thread führt zurück zu 06.
- 47 Text User to profil (Name im Chat): öffnet 65 Profile view other users, beim eigenen Namen Profile view main. 40 Bearbeiten (Profil bearbeiten) ist im Prototyp mit 65 verknüpft, beim Umsetzen im Frame prüfen.
- 65 Profile menu (Avatar oben rechts): öffnet 64 Edit user and Log out. Dort führt "Profil" zu Profile view main und "Log out" zu 01-Log In.
- 65 Profile view other users: Button primary + icon (Nachricht senden) öffnet die DM mit dieser Person. Close schließt den Dialog.
- 39 Entwicklerteam (Channel-Header): öffnet Channel Edition. 46 Members Miniatures: öffnet 43 Members. 44 Add members button: öffnet 41 Add members R corner.
- 43 Members: Klick auf Mitglied öffnet das Profil (eigenes: Profile view main, andere: 65). 42 "Mitglieder hinzufügen" öffnet 41.
- Channel Edition: 70 und 75 edit schalten Name und Beschreibung zwischen Default und Edit um. Button primary (Speichern) und Close schließen den Dialog.
- 13 bis 16 sind die Varianten der Ansichten im Modus "Nachricht bearbeiten".

### Workspace Mobil
- 06 Main menu: Entwicklerteam öffnet 07 Main Chat. Personen öffnen 11 A bis E bzw. Sofia. 16B edit_square öffnet 09 New message. 00c Characters (Avatar) öffnet 64b Edit user and Log out.
- 07 Main Chat: 68 Arrow und 15B Channel name führen zum Main menu. 39 Entwicklerteam öffnet Channel edition. 44 Add members öffnet 43 Members. 50 button Antworten öffnet 08 Secondary Chat (Thread). 47 Text User to profil öffnet das Profil.
- 08 Secondary Chat: 45 Close führt zurück zum Main menu. 68 Arrow und 15B führen zum Main menu.
- 10 New channel und Add Channel (Dialog): Close führt zum Main menu. Button primary (Erstellen) führt zu 38b Add Members after add channel, danach zu 10 New channel.
- 11 A bis E: Klick auf Person im Chat-Header öffnet 65 Profile view other users. Frame 205 öffnet das Profil. "Diese Unterhaltung findet..." öffnet ebenfalls das Profil.
- Searching bar person (@) und Searching bar channels (#): Close führt zu 07 Main Chat. Klick auf Treffer öffnet die DM bzw. den Channel.
- 64b Edit user and Log out: "Profil" öffnet Profile view main, "Log out" öffnet 01-Log In.

## 4. Zustände (Prototyp-Hover/Press)

Hover- und Pressed-Zustände sind als Komponentenvarianten vorhanden: 45 Close, 35 Basic Text box, 33 Text box + ICON, 34 Text box Without sample, 10 Button primary, 11 Button secondary, 58 Button primary + icon, radio_button_unchecked, Mitglieder-Zeilen (24 bis 29, 42), 25 Frederik Beck, 63 Write text box aux, add reaction (emoji, @, person search), Send icon (Send Hover).

## 5. Noch offen (nächster Schritt)

- Komponenten und Icons aus der Seite "Components" (Namen, Node-IDs, Maße).
- Overlay-Texte (Overlay One, Two, Three) und Texte der einzelnen Dialoge.
- Maße, Abstände und Farben pro Frame, werden beim jeweiligen Umsetzungsschritt aus Figma gelesen.