# Automatische Reparatur ohne Plattformänderung

„Die package.json verlangt is-number 7.0.0, aber die Lockdatei enthält 6.0.0. npm ci verweigert deshalb die Installation. Die Referenzkategorie lautet DEPENDENCY_FAILURE.“

„Unsere vorhandene deterministische Reparaturregel erkennt genau diese Diagnose. Sie synchronisiert die Lockdatei im isolierten Validierungsarbeitsverzeichnis. Danach führt die Plattform den ursprünglichen Befehl npm ci und die weiteren Pipeline-Stufen erneut aus.“

„Dieser Reparaturkandidat kommt aus einer implementierten Regel. Er ist kein Nachweis dafür, dass Qwen die Änderung erfunden hat. CodeBERT und RAG können den Fehler parallel klassifizieren.“

„Erst der erfolgreiche echte Validierungslauf belegt die Reparatur für diesen Kontext. Die Plattform erstellt dadurch keinen automatischen Git-Commit.“

Zu zeigen: ursprünglicher Commit, npm-Diagnose, beide Klassifikationen, REGENERATE_LOCK_FILE-Kandidat, Vorbereitungsbefehl, unverändertes npm ci, Test und Build, abschließender Status. Historische Wiederverwendungsfreigabe und erfolgreiche aktuelle Reparatur unterscheiden.
