## What is a REST API?

REpresentational State Transfer (REST) is an architectural pattern for developing network applications.
<!-- .element: class="fragment" -->

REST APIs build off this concept, organizing data into resources accessed via common HTTP verbs.
<!-- .element: class="fragment" -->

---

### HTTP Verbs

```no-highlight
GET
PUT
POST
DELETE
```

```no-highlight
PATCH
HEAD
OPTIONS
```
<!-- .element: class="fragment" -->

---

### HTTP Verbs and endpoints

```no-highlight
POST   /Resource    -- Create a "Resource"
GET    /Resource    -- list this type of record
GET    /Resource/13 -- retrieve record with id 13
PUT    /Resource/13 -- update record with id 13
DELETE /Resource/13 -- delete record with id 13
```

```no-highlight
GET    /Resource/13/groups -- retrieve groups attached to Resource 13
DELETE /Resource/13/groups -- delete groups associated w/ Resource 13
```
<!-- .element: class="fragment" -->

---

### HTTP Status Codes

* 2XX: for successfully processed requests
* 3XX: for redirections or cache information
<!-- .element: class="fragment" -->
* 4XX: for client-side errors
<!-- .element: class="fragment" -->
* 5XX: for server-side errors
<!-- .element: class="fragment" -->
