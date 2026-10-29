# Vier Beispiele für die Vorführung

## 01: Quellcodefehler

„Ich definiere dieselbe const-Variable zweimal. Node meldet einen SyntaxError im Anwendungscode. Die Referenzkategorie ist COMPILATION_FAILURE, auch wenn der Testschritt den Fehler entdeckt. Unser gewünschtes Verhalten ist eine Benachrichtigung an den Entwickler, ohne automatische Änderung des Quellcodes.“

## 02: Paketfehler

„Die package.json enthält einen absichtlich ungültigen Abhängigkeitsnamen mit Leerzeichen. npm ci scheitert mit EINVALIDPACKAGENAME. Die Referenzkategorie ist DEPENDENCY_FAILURE. Das System soll eine passende Konfigurationsreparatur vorschlagen. Hier ist der künstliche Eintrag unnötig und kann entfernt werden. In einem realen Projekt muss die beabsichtigte Abhängigkeit ermittelt werden.“

## 03: Fehlerhafte Testkonfiguration

„Der Testbefehl lädt einen Reporter, dessen Datei nicht existiert. Daher scheitert die Einrichtung des Testläufers. Die Referenzkategorie ist TEST_CONFIGURATION_FAILURE. Eine geeignete Reparatur entfernt die falsche Reporter-Option und verwendet den Standardreporter.“

## 04: Normaler fehlgeschlagener Test

„Der Test läuft, aber erwartet 99 statt der tatsächlichen 5. Es liegt kein Nachweis einer falschen Testläuferkonfiguration vor. Unsere taxonomy-v1 hat keine eigene Klasse für gewöhnliche Assertion-Fehler. Deshalb ist UNKNOWN die Referenz. Das System soll den Entwickler informieren und die Assertion nicht automatisch verändern.“

## Wichtige Trennung

Die Kategorien beschreiben Ursachen. Die Benachrichtigung oder automatische Reparatur ist eine separate Plattformentscheidung. Dieses Testrepository implementiert diese Plattformentscheidung nicht. Vor der Vorführung überprüfen, ob die aktuelle Plattform das gewünschte Verhalten unterstützt.

Ein Vorschlag ist noch keine erfolgreiche Reparatur. Nur ein tatsächlicher Validierungslauf kann zeigen, ob alle erforderlichen Stufen funktionieren. Eine manuelle Wiederherstellung mit publish repair bleibt eine manuelle Kontrollreparatur.

## Für jeden Fall dokumentieren

- Commit und ausgecheckter SHA
- Run und Incident-ID
- Originaldiagnose
- CodeBERT-Kategorie, Version und Latenz
- RAG-Kategorie, Version, Latenz und abgerufene Referenzen
- Unabhängige Ursachenprüfung und Referenzkategorie
- Tatsächliche Benachrichtigung oder Empfehlung
- Automatische Validierung versus manuelle Kontrolle
- Ergebnis aller erforderlichen Stufen

Die Generalprobe kann den Fall dem System bekannt machen. Spätere Wiederholungen sind dann keine unabhängigen Testfälle. Vier verwandte Szenarien erlauben keine allgemeine Aussage zur Modellüberlegenheit.
