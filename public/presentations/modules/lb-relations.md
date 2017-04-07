
## Adding Model Relations

---

## Relationship Types

1. `hasOne` relations
1. `hasMany` relations
1. `hasManyThrough` relations
1. `belongsTo` relations
1. `hasAndBelongsToMany` relations
1. Embedded relations (`embedsOne` and `embedsMany`)
1. Polymorphic relations

---

### Adding a Relationship

Two options:

* Command Line
* JSON config file editing

---

### Adding a Relationship

<pre><code class='lang-no-highlight'>~/coffee-reviews$ <strong>slc loopback:relation</strong>
? Select the model to create the relationship from: <strong>CoffeeShop</strong>
? Relation type: <strong>has many</strong>
? Choose a model to create a relationship with: <strong>Review</strong>
? Enter the property name for the relation: <strong>reviews</strong>
? Optionally enter a custom foreign key:
? Require a through model? No</code></pre>

---

### Review the Relation Config

`/common/models/coffee-shop.json`

```js
{
  "name": "CoffeeShop",
  // ...,
  "relations": {
    "reviews": {
      "type": "hasMany",
      "model": "Review",
      "foreignKey": ""
    }
  }
}
```

---

### Including Relations in API Calls

`/api/CoffeeShops?filter={"include": [ "reviews" ] )`
<!-- .element: class="fragment" -->

```js
[
  {
    "id": 13,
    "name": "Awesome Shop",
    ...,
    "reviews": [
      { "id": 27, "rating": 4, "comments": "..." },
      { "id": 31, "rating": 5, "comments": "..." },
      ...
    ]
  },
  ...
]
```
<!-- .element: class="fragment" -->

---

## A `belongsTo` Relation == Ownership

---

### Adding a Relationship

<pre><code class='lang-no-highlight'>~/coffee-reviews$ <strong>slc loopback:relation</strong>
? Select the model to create the relationship from: <strong>Review</strong>
? Relation type: <strong>belongsTo</strong>
? Choose a model to create a relationship with: <strong>User</strong>
? Enter the property name for the relation: <strong>reviewer</strong>
? Optionally enter a custom foreign key: <strong>reviewerId</strong>
? Require a through model? No</code></pre>

---

### Review the Relation Config

`/common/models/review.json`

```js
{
  "name": "Review",
  // ...,
  "relations": {
    "reviewer": {
      "type": "belongsTo",
      "model": "User",
      "foreignKey": "reviewerId"
    }
  }
}
```

---

### Many to Many Relations

<img src='/images/has-many-through.png' style='width:85%'>

---

### Many to Many Config

```js
{  
  "name": "Physician",
  // ...,
  "relations": {
    "patients": {
      "type": "hasMany",
      "model": "Patient",
      "through": "Appointment"
    }
  }
}
```

```js
{  
  "name": "Patient",
  // ...,
  "relations": {
    "physicians": {
      "type": "hasMany",
      "model": "Physician",
      "through": "Appointment"
    }
  }
}
```

---

### Many to Many Config

```js
{  
  "name": "Appointment",
  // ...,
  "properties": {
    "appointmentDate": {
      "type": "date"
    }
  },
  "relations": {
    "physician": {
      "type": "belongsTo",
      "model": "Physician",
      "foreignKey": "physicianId"
    },
    "patient": {
      "type": "belongsTo",
      "model": "Patient",
      "foreignKey": "patientId"
    }
  }
}
```

---

### Finding Many to Many Records

```no-highlight
GET /api/Appointments?filter={"include":["patient","physician"]}
```

```js
[
  {
    "appointmentDate": "2014-06-01",
    "id": 1,
    "patientId": 5803,
    "physicianId": 51,
    "patient": {
      //...
    },
    "physician": {
      //...
    }
  }
]
```
<!-- .element: class="fragment" -->