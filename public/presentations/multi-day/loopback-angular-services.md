
![](/images/StrongLoop.png)

# LoopBack Angular Services

---

## LoopBack Angular Services

LoopBack provides a generator for all models exposed by your API.

These Angular services integrate seamlessly with your front-end.

---

### Generating LoopBack Services

First, make a directory for the JS file and generate it:

```
~/my-app$ mkdir client/js/services

~/my-app$ lb-ng server/server.js client/js/services/lb-services.js
```

---

### Include the File

Make sure that you include the services file!

<pre><code>&lt;!doctype html>
&lt;html ng-app>
  &lt;head>
    &lt;script src='/js/angular.js'>&lt;/script>
    &lt;script src='/js/angular-route.js'>&lt;/script>
    &lt;script src='/js/services/lb-services.js'>&lt;/script>
  &lt;/head>
  &lt;body>

  &lt;/body>
&lt;/html>
</code></pre>

---

### Add the Service as a Dependency

We need to tell our Angular app about our LoopBack services:

```js
// in app.js
var app = angular.module('coffeeShopReviews', ['ngRoute', 'lbServices' ]);

// ...
```

---

### Use Your Models

Now we're ready to use our API models in Angular!

```js
angular.module('coffeeShopReviews')
    .controller('ShopController', ['$scope', '$routeParams', 'CoffeeShop',
        function ($scope, $routeParams, CoffeeShop) {
            var id = $routeParams.shopId;
            
            $scope.shop = {};
            CoffeeShop.findById(id, function(err, data) {
                if (err) { /* ... */ }
                $scope.shop = data;
            });
        });
    }]);
```

---

### Use Your Models

We have access to all public methods on the models:

```js
// in AllReviewsController.js
angular.module('coffeeShopReviews')
    .controller('AllReviewsController', ['$scope', 'Review',
        function($scope, Review) {
            $scope.reviews = Review.find({
              filter: {
                include: [
                  'coffeeShop',
                  'reviewer'
                ]
              }
            });
        }]);
```

---

### Use the Data in Your Views

We can use model data in our views easily:

```html
<!-- in /partials/all-reviews.html -->
<section>
  <article ng-repeat='review in reviews.slice().reverse()'>
    <header>
      <h1>{{review.date | date}} | {{review.coffeeShop.name}}</h1>
      <h2>by {{review.reviewer.firstName}}</h2>
    </header>
    <p>{{review.rating}} stars: {{review.comments}}</p>
  </article>
</section>
```

---

### Using Authentication

You can use LoopBack token-based authentication easily through the built-in `User` model:

```js
// in UserController.js
angular.module('coffeeShopReviews')
    .controller('UserController', ['$scope', '$rootscope', '$location', 'User',
        function($scope, $rootscope, $location, User) {
            $scope.email = '';
            $scope.password = '';
            
            $scope.login = function() {
                User
                    .login({
                        email: $scope.email,
                        password: $scope.password
                    })
                    .$promise
                    .then(function(response) {
                        $rootScope.currentUser = response.user;
                        $location.path( '/my-account' );
                    });
            };
        }]);
```

_Note that you may want to abstract log in/out functionality to a service!_

---

### Using Authentication

Once a user authenticates, the LoopBack service will automatically send
their token with each API call in the `Authorization` header!

No need to handle it yourself. :)

---

### Using Authentication

And logging out is just as easy:

```js
angular.module('coffeeShopReviews')
    .controller('UserController', ['$scope', '$rootscope', '$location', 'User',
        function($scope, $rootscope, $location, User) {
            
            // ...
            
            $scope.logout = function() {
                User
                    .logout()
                    .$promise
                    .then(function(response) {
                        $rootScope.currentUser = null;
                        $location.path( '/' );
                    });
            };
        }]);
```

---

# fin
