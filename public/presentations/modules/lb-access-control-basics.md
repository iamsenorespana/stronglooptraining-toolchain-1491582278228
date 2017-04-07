
## Authentication and Authorization

---

## LoopBack Auth

* Principal<span class='fragment'>: <em>An entity that can be authenticated</em></span>
* Role<span class='fragment'>: <em>A group of principals</em></span>
* RoleMapping<span class='fragment'>: <em>Maps a principal to a role</em></span>
* ACL<span class='fragment'>: <em>Access control list for a principal on a model</em></span>

---

### Principal

Any entity that can be identified or authenticated

* A user
* An application
* A role

---

### Built-in, Dynamic Roles

* `$everyone`
<!-- .element: class="fragment" -->
* `$unauthenticated`
<!-- .element: class="fragment" -->
* `$authenticated`
<!-- .element: class="fragment" -->
* `$owner`
<!-- .element: class="fragment" -->

---

## Access Control

<p class="fragment">Use a **"White Listing"** approach!</p>

---

### Adding ACLs

One possible workflow...

1. Deny ALL access to EVERYONE for the given model
<!-- .element: class="fragment" -->
1. Allow authenticated users to read model instances
<!-- .element: class="fragment" -->
1. Allow owners of a model to update existing instances
<!-- .element: class="fragment" -->
1. Allow authenticated users to create an inctance
<!-- .element: class="fragment" -->

---

### Defining an ACL

<pre><code class='lang-no-highlight'>~/my-project$ slc <strong>loopback:acl</strong></code></pre>

<pre class='fragment'><code class='lang-no-highlight'>? Select the model to apply the ACL entry to: <strong>Review</strong></code></pre>
<pre class='fragment'><code class='lang-no-highlight'>? Select the ACL scope: <strong>All methods and properties</strong></code></pre>
<pre class='fragment'><code class='lang-no-highlight'>? Select the access type: <strong>All (match all types)</strong></code></pre>
<pre class='fragment'><code class='lang-no-highlight'>? Select the role: <strong>All users</strong></code></pre>
<pre class='fragment'><code class='lang-no-highlight'>? Select the permission to apply: <strong>Explicitly deny access</strong></code></pre>

---

### Review the Config

```js
{
  "name": "Review",
  // ...
  "acls": [
    {
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "DENY"
    }
  ],
  // ...
}
```

---

### Defining ACLs

Now allow **READ** access in the same manner:

<pre><code class='lang-no-highlight'>~/my-project$ slc <strong>loopback:acl</strong></code></pre>

<pre class='fragment'><code class='lang-no-highlight'>? Select the model to apply the ACL entry to: <strong>Review</strong>
? Select the ACL scope: <strong>All methods and properties</strong>
? Select the access type: <strong>Read</strong>
? Select the role: <strong>Any authenticated user</strong>
? Select the permission to apply: <strong>Explicitly grant access</strong></code></pre>

---

### Defining ACLs

**WRITE** access controls ANY data saving:

<pre class='fragment'><code class='lang-no-highlight'>~/my-project$ slc <strong>loopback:acl</strong>
? Select the model to apply the ACL entry to: <strong>Review</strong>
? Select the ACL scope: <strong>All methods and properties</strong>
? Select the access type: <strong>Write</strong>
? Select the role: <strong>The user owning the object</strong>
? Select the permission to apply: <strong>Explicitly grant access</strong></code></pre>

<p class="fragment">
    Remember that "ownership" derives from a `belongsTo` relationship!
</p>

---

### Defining ACLs

"Write" access includes creation...  
but on "create" there is no owner yet!

So we need to grant that access explicitly.

<pre class='fragment'><code class='lang-no-highlight'>~/my-project$ slc <strong>loopback:acl</strong>
? Select the model to apply the ACL entry to: <strong>Review</strong>
? Select the ACL scope: <strong>All methods and properties</strong>
  All methods and properties 
❯ A single method</code></pre>

<pre class='fragment'><code class='lang-no-highlight'>? Enter the method name <strong>create</strong>
? Select the role: <strong>Any authenticated user</strong>
? Select the permission to apply: <strong>Explicitly grant access</strong></code></pre>

---

## Add Access Control to All Models!
