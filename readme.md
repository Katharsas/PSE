## Nachrichten-Suchmaschinek

#### Für das Nachrichtenarchiv soll eine Suchmaschine entwickelt werden, mit deren Hilfe die folgenden Suchkriterien unterstützt werden:

- Volltextsuche
- Zeitraum
- Thema (Politik, Sport, etc.)

> Habe hier mal die Aufgabe grob zusammengestellt und als Quotes, meine Bemerkungen dazu reingeschrieben

```Task 1 - Indexing```

Dazu alle neuen Nachrichten über den Subscription-Mechanismus des Nachrichtenarchivs in den Index der Suchmaschine übernehmen

> Sollen wir selber nen Crawler betreiben ?

```Task 2 - Filtering```

Da häufig Quellen gleiche Nachrichten anbieten, sollen ähnliche Nachrichten nicht in den Index eingefügt werden. 
Hierzu soll ein effizienter Ansatz implementiert werden, der den Suchindex nutzt.

> TODO: Finde Methode um "Ähnlichkeit" von Artikeln festzustellen (Häufigkeit von Wörtern, ... nutze unsere Suchmaschine dazu?)

```Task 3 - Results - Basic```

Als Ergebnis einer Anfrage soll eine Liste mit den zehn besten gefundenen Artikeln angezeigt werden. 
Für jeden Artikel wird hier die Datenquelle (e.g. Spiegel), das Publikationsdatum sowie der Titel angezeigt. 

> Ergebnis-Anzeige - wie Google ?

```Task 3 - Results - Advanced```

Pro Suchergebnis hat der Anwender 4 Möglichkeiten:

- Weitere Ergebnisse abfragen
> = "Next" Button

- Artikel (über original Link) im Internet aufrufen
> = Link zur Orignal-Quelle 

- Cache anzeigen (zeigt nur extrahierte Text des Artikels)
> = Link zu einer HTML-Page, die unseren gecrawlten Text darstellt

- Sehe ähnliche Artikel - weitere, ähnliche Texte wie das Ergebnis liefern
> = wie [Task 2] - ähnliche Artikel finden, und anzeigen

