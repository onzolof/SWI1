# SWI1

## codestyle
- const instead of var/let
    - semikolon
    - auf vererbung wird bewusst verzichtet
    - schoener stil meiner meinung nach -> keine seiteneffekte
    - keine hoisting-probleme: https://medium.com/javascript-in-plain-english/how-to-use-let-var-and-const-in-javascript-cdf42b48d70
- bewusst wenig kommentare
- kleine methoden
- code muss lesbar sein, deshalb oft das builder pattern verwendet

## konzept
- mockups

## design
- uml diagramm

## entwicklung
- problem mit dem lokalen file
    - problem beim routing
        - schlechtere user experience
        - schlechetere kapselung
        - back-button im browser funktioniert nicht
    - problem listener
        - dom-tree muss stehen wenn listener gesetzt werden
    - module koennen nicht benutzt werden, wegen CORS, deshalb klassen verwendet
- karten sind nicht so langweilig
    - grid-layout waere noch besser, aber wird von safari nicht unterstuetzt
- bootstrap lokal
    - da anderes theme verwendet
- popper.js & jquery via URL eingebunden
    - brauchts fuer bootstrap
-> funktioniert also nicht korrekt ohne internet

- was koennte man noch einbauen?
    - quick-book-button auf raeumen die verfuegbar sind
    - room-filter

## staerken meiner loesung

## schwachen meiner loesung
- man kann nirgends den kalender mit allen räumen einsehen, immer nur mit einem raum
- page-titel vs. breadcrum -> breadcrumb im zentrum oder redundanter titel?

## Reflexion
- gute planung wichtig, deshalb genaue mockups
- javascript war ein bisschen ein pain, habe mich aber gut eingelebt