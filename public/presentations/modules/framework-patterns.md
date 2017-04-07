
## Framework Patterns

---

## Pattern #1: Convention

Hapi, LoopBack, Sails

* No questions about "how to do it"
* Advanced features fit in easier
* Weaknesses
  * Opinionated
  * High learning curve

---

## Pattern #2: Configuration

Express, Restify, Kraken

* Lower learning curve
* Better documentation
* Weaknesses
  * Manual CRUD
  * Advanced features can require more effort

---

## Pattern #3: Isomorphic

Meteor, LoopBack

* Sharing of Code (Client & Server)
* Automatic endpoint generation & routing
* Weaknesses
  * High learning curve
  * Code sharing doesn't cover all cases

---

## Pattern #4: ORM & MBaaS

LoopBack, Sails

* Model Driven Development
  * Multiple data sources
* Possible to have Isomorphic JS
* Automatic REST endpoint generation
  * Includes routing & CRUD
* Weaknesses
  * Non-data-backed APIs require effort
  * Opinionated
