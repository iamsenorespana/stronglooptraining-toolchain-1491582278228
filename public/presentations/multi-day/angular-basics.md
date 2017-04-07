
![](/images/StrongLoop.png)

# Angular Basics

---

## What is AngularJS?

* Open-source framework for building web apps
* Sponsored by Google
* MV* pattern (Model-View-Anything)

---

## Get the Code

Download it from [angularjs.org](https://angularjs.org/)

Or

Install via bower:

```
~$ npm install -g bower
~/my-app$ bower install angular
```

_If using Bower, be sure to use the correct path in `script` tags!_

---

## Bootstrapping

Our Single Page Application (SPA) base:

<pre><code>&lt;!doctype html>
&lt;html ng-app>
  &lt;head>
    &lt;script src='/js/angular.js'>&lt;/script>
    &lt;!-- Or you can place this at the end of the body... -->
  &lt;/head>
  &lt;body>

  &lt;/body>
&lt;/html>
</code></pre>

^ Note: don't forget to add a script tag for all source files!

---

### Ng-App

Angular needs to know the application's root element  
using the **ng-app** _directive_:

```html
<html ng-app>
    ...
</html>
```

---

### Ng-App

You can restrict the app to any element:

```html
<!doctype html>
<html>
    <head> ... </head>
    <body>

        <div id='main' ng-app>
            ...
        </div>

    </body>
</html>
```

---

### Application Name

You can also specify the name of the module:

```html
<html ng-app='coffeeShopReviews'>
    ...
</html>
```

_(Usually only necessary when using multiple app modules.)_

---

### Creating a Module

In our main file `coffee-shop.js`:

```js
var app = angular.module('coffeeShopReviews', []);
```

The second argument is for any dependencies this app requires.

---

### Creating a View

Essentially an html file...

```html
<div>
    <h1>{{'Coffee' + ' ' + 'Shops'}}</h1>
</div>
```

...with template expressions in double angle brackets.
<!-- .element: class="fragment" -->

---

### Expressions

Enclose the expressions in **{{** and **}}** tags

```html
<div>
    <p>1 + 1 = {{ 1 + 1 }}</p>
    <p>2 * 2 = {{ 2 * 2 }}</p>
    <p>Name: {{ shop.name }}</p>
    <p>Reviews: {{ shop.reviews.length }}</p>
</div>
```

The coffee shop data (`shop.name`) will come from a binding to a controller scope...

---

### Creating a Controller

Controllers create data-binding between model and view.

Data-binding syncs changes between view and model.

```js
angular.module('coffeeShopReviews')
    .controller('ShopController', ['$scope', function ($scope) {
        
        // Use $scope for any bindings to the view...
        
        $scope.shop = {
            name: 'My Awesome Shop',
            reviews: [ { /* ... */ }, { /* ... */ } ]
        };
        
    }]);
```

---

### Creating a Controller

In our view we add an `ng-controller` directive:

```html
<div ng-controller='ShopController'>
    
    <p>Name: {{ shop.name }}</p>
    <p>Reviews: {{ shop.reviews.length }}</p>
    
</div>
<div>
    <!-- no access to `shop` in here! -->
</div>
```

Note that all `$scope`d properties (and methods) are restricted to the controllers root element!

---

## Repeaters

The `ng-repeat` directive creates a copy of an HTML tag for each element in a collection:

```html
<div ng-controller='ShopController'>
    <p>Name: {{ shop.name }}</p>
    <p>Reviews: {{ shop.reviews.length }}</p>
    
    <ul>
        <li ng-repeat='review in shop.reviews'>
            Rating: {{ review.rating }}
        </li>
    </ul>
</div>
```

^Note: the collection is specified as data in the controller

---

## Two-way Binding

We can bind data to a model using the `ng-model` directive:

```html
<form ng-controller='AddReviewController'>
    <input type='hidden' ng-model='review.shopId'>
    <input type='text' ng-model='review.rating' placeholder='1-5'>
    <input type='text' ng-model='review.comments' placeholder='Comments...'>
</form>
```

```js
angular.module('coffeeShopReviews')
    .controller('AddReviewController', ['$scope', function ($scope) {
        
        $scope.review = {
            shopId: 13,
            rating: null,
            text: ''
        };
        
    }]);
```

^Note: the `ng-model` directive synchronizes changes between its identifier and its variable of the same name in its controller's $scope object

---

## Binding Methods

We can also bind methods to a controller:

```html
<div ng-controller='AddReviewController'>
    <form ng-submit='addReview()'>
        ...
    </form>
</div>
```

```js
angular.module('coffeeShopReviews')
    .controller('AddReviewController', ['$scope', function ($scope) {
        
        $scope.review = { /* ... */ };
        
        $scope.addReview = function() {
            // use $scope.review to save data!
        };
        
    }]);
```

---

## Events

We have other events just like `ng-submit` in our form:

* ng-click, ng-dbl-click
* ng-mousedown, ng-mouseup
* ng-mouseenter, ng-mouseleave
* ng-mousemove, ng-mouseover
* ng-keydown, ng-keyup
* ng-keypress, ng-change

---

### Events

To create a click event, add an event directive and a method:

```html
<div ng-controller='SearchController'>
    <label>Shop Search:</label>
    <input type='text' ng-model='query' ng-mouseup='liveSearch()'>
    
    <ul>
        <li ng-repeat'result in results'> ... </li>
    </ul>
</div>
```

```js
angular.module('coffeeShopReviews')
    .controller('SearchController', ['$scope', function ($scope) {
        $scope.query = '';
        $scope.results = [];
        $scope.liveSearch = function() {
            // ... fill $scope.results
        };
    }]);
```

---

## Filters

Angular provides filters for template data.

Just add the filter using a pipe (`|`):

```html
<div>
    <p>{{ product.price | currency: 'USD' }}</p>

    <p>{{ shop.lastUpdateTime | date: 'yyyy-MM-dd HH:mm:ss' }}</p>
    
    <p>{{ shop.name | uppercase }}</p>
    
    <p>{{ shop.reviews | limitTo: 3 }}</p>

    <p>{{ review.rating | number }}</p>
</div>
```

---

# Routing and Multiple Views

---

## Routing and Multiple Views

As the application grows in size,  
it should be broken into multiple views.

This provides many benefits such as  
_separation of concerns_ and better _maintainability_.

---

### Multiple Views

Our `index.html` file becomes a **layout** template.

Other templates called **partials** are included at runtime based on the route

---

### Layout Template

First, restructure `index.html`:

<pre><code>&lt;!doctype html>
&lt;html ng-app>
  &lt;head>
    &lt;script src='/js/angular.js'>&lt;/script>
    &lt;!-- We also need the router module! -->
    &lt;script src='/js/angular-route.js'>&lt;/script>
  &lt;/head>
  &lt;body>
  
    &lt;div ng-view>&lt;/div>
    
  &lt;/body>
&lt;/html>
</code></pre>

---

### View Partials

Now move other views into `/partials/...`:

```html
<!-- /partials/add-review.html -->
<form ng-controller='AddReviewController'>
    <input type='hidden' ng-model='review.shopId'>
    <input type='text' ng-model='review.rating' placeholder='1-5'>
    <input type='text' ng-model='review.comments' placeholder='Comments...'>
</form>
```

```html
<!-- /partials/shop-view.html -->
<div ng-controller='ShopController'>
    <p>Name: {{ shop.name }}</p>
    <p>Reviews: {{ shop.reviews.length }}</p>
    <ul>
        <li ng-repeat='review in shop.reviews'>
            Rating: {{ review.rating }}
        </li>
    </ul>
</div>
```

---

### Multiple Views

Now we add the routing module as a dependency:

```js
var app = angular.module('coffeeShopReviews', ['ngRoute']);
```

---

### Multiple Views

```js
var app = angular.module('coffeeShopReviews', ['ngRoute']);
```

And then configure our routes:

```js
app.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
        .when('/add-review', {
            templateUrl : 'partials/add-review.html',
            controller  : 'AddReviewController'
        })
        .when('/shop/:shopId', {
            templateUrl : 'partials/shop-view.html',
            controller  : 'ShopController'
        })
        .otherwise({
            redirectTo : '/'
        });
    }
]);
```

---

### URL Parameters

We can access URL parameters on `$routeParams`:

```js
angular.module('coffeeShopReviews')
    .controller('ShopController', ['$scope', '$routeParams', 'Shop',
        function ($scope, $routeParams, Shop) {
            var id = $routeParams.shopId;
            
            $scope.shop = {};
            Shop.findById(id, function(err, data) {
                if (err) { /* ... */ }
                $scope.shop = data;
            });
        });
    }]);
```

_Note that we have not yet created our `Shop` model!_

---

## Angular Services

---

### Services

Angular services are used to organize and share code across your application.

They are all **singletons** and **lazily instantiated**.

---

### Services

We can use a service for our model:

```js
angular.module('coffeeShopReviews')
    .factory('Shop', function () {
      return function Shop () {
        return {
            findById: function(id, cb) { /* ... */ },
            ...
        };
      };
    });
```

---

### Using a Service

```js
angular.module('coffeeShopReviews')
    .controller('ShopController', ['$scope', '$routeParams', 'Shop',
        function ($scope, $routeParams, Shop) {
            var id = $routeParams.shopId;
            
            $scope.shop = {};
            Shop.findById(id, function(err, data) {
                if (err) { /* ... */ }
                $scope.shop = data;
            });
        });
    }]);
```

---

# fin
