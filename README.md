# SWI1

## codestyle
- const instead of var/let
    - semikolon
    - auf vererbung wird bewusst verzichtet
    - schoener stil meiner meinung nach -> keine seiteneffekte
    - keine hoisting-probleme: https://medium.com/javascript-in-plain-english/how-to-use-let-var-and-const-in-javascript-cdf42b48d70
- bewusst wenig kommentare

## konzept
- mockups

## design
- uml diagramm

## entwicklung
- karten sind nicht so langweilig
    - grid-layout waere noch besser, aber wird von safari nicht unterstuetzt
- kann keine module benutzen, da lokal und ohne webserver CORS-problem
    - deshalb wurden klassen erstellt (fuer die lesbarkeit)
- routing klappt nicht wegen lokalem oeffnen / webserver fehlt
    - waere gut fuer ux und kapselung der pages
- bootstrap lokal
    - da anderes theme verwendet
- vanilla lokal
    - fuer schnelleres und einfacheres zugreifen auf dom-elemente
- popper.js & jquery via URL eingebunden
    - brauchts fuer bootstrap
-> funktioniert also nicht korrekt ohne internet

- was koennte man noch einbauen?
    - breadcrumb
    - room-filter