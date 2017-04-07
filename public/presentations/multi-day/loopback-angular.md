
![](/images/StrongLoop.png)

# LoopBack and Angular

---

## What is AngularJS?

AngularJS is an open-source JavaScript framework by Google, for building web apps. It was designed to make structured development and testing easier.


It is a **Model View Whatever** framework, giving you the freedom to decide what design structure to follow.

^This lesson will cover creating an Angular application via the **Model View Controller** pattern.

---

Note:

* AngularJS used to be closer to MVC from the beginning, but is now closer to MVVM
* Instead of having developers waste countless hours debating the benefits of one over the other, it was decided that it would be heralded as MVW
* Model-View-Whatever is an indication to go with whatever works

---

### Bootstrapping

Our Single Page Application (SPA) base...

```html
<!doctype html>
<html ng-app>
  <head>
    < script src="/js/angular.js">< /script>
    < script src="/js/student.js">< /script>
  </head>
  <body>

  </body>
</html>
```

^Note: don't forget to add a `<script>` tag for the source file!

---

### Ng-App

Before Angular can bootstrap an application, it needs to know the application's root element.

This is achieved using the **ng-app** directive

```html
<html ng-app>
    ...
</html>
```

---

Angular can be restricted to operate on parts of the HTML document.

```html
<!doctype html>
<html>
    <head> ... </head>
    <body>

        <div id="main" ng-app>
            ...
        </div>

    </body>
</html>
```

---

### Application Name

**ng-app** also accepts a value to specify the name of the module:

```html
<html ng-app="studentApp">
    ...
</html>
```

---
### Create a Module

Create the `studentApp` module with `angular.module` in `student.js`:

```js
var studentApp = angular.module('studentApp', []);
```

---

### Creating a View

Essentially an html file with standard syntax:

```html
<body>
<div>
  <label>Name:</label>
  <input type="text" placeholder="Enter a name here">
  <hr>
  <h1>Students</h1>
</div>
</body>
```

---

### Expressions in Angular

Simple expressions, such as arithmetic, can be evaluted in a view.

Enclose the expression in **{{** and **}}** tags

```html
  ...
  <body>
    <div>
      <p>1 + 1 = {{ 1 + 1 }}</p>
      <p>2 * 2 = {{ 2 * 2 }}</p>
      <p>Name  = {{ person.name }}</p>
      <p>{{ students[0] }}</p>
    </div>
  </body>
  ...
```

---

### Expressions in Angular

For complex evaluations and logic, use Angular directives:

```html
  ...
  <body>
    <div>
      <label>Name:</label>
      <input type="text" ng-model="name" placeholder="Enter a name here">
      <hr>
      <h1>Students</h1>

      <!-- print list of students -->
    </div>
  </body>
  ...
```


---

### Creating a Controller

The controller sets up data-binding between the model and the view.

Data-binding synchronizes changes between the view and the model:

```js
studentApp.controller('StudentsCtrl', function ($scope) {
  // add logic here
});
```

---

To use a controller, add an `ng-controller` directive to the view:

```html
  <body>
    <div ng-controller="StudentsCtrl">
      ...
    </div>
  </body>
```

---

### Controller Context

The `ng-controller` directive also defines context.

Data models and functions of a controller are accessible only
within the context of its controller:

```html
  <body>
    <div ng-controller="StudentsCtrl">
      <!-- valid, name is accessible inside StudentsCtrl -->
      <input type="text" ng-model="name" placeholder="Enter a name here">
      ...
    </div>

    <!-- invalid, name not accessible outside StudentsCtrl -->
    <input type="text" ng-model="name" placeholder="Enter a name here">
  </body>
```


---

Note:

* `ng-controller` directive determines where in a view its data models
  and functions are accessible
* The context is valid within the opening and close tags of the element
  to which the directive is added


---

### Data Binding with Models

Create data models by adding to `$scope` object in a controller:

```js
studentApp.('StudentsCtrl', funcion ($scope) {
    // populate the $scope object
    $scope.students = [
        { firstName : "John", lastName : "Doe" },
        { firstName : "Jane", lastName : "Doe" }
    ];
});
```

---

Data models are accessible in views via the `ng-model` directive. `ng-model` binds data between the directive's identifier and a variable of the same name in the `$scope` object:

```html
  <body>
    <div ng-controller="StudentsCtrl">
      <input type="text" ng-model="name" placeholder="Enter a name here">
      ...
    </div>
  </body>
```

^Note: the `ng-model` directive synchronizes changes between its identifier and its variable of the same name in its controller's $scope object

---

## Repeaters

`ng-repeat` creates a copy of an HTML tag for each element in a collection:

```html
  ...
  <body>
    <div>
      <label>Name:</label>
      <input type="text" ng-model="name" placeholder="Enter a name here">
      <hr>
      <h1>Students</h1>

      <ul class="students">
        <li ng-repeat="student in students">
            {{ student.name }}
        </li>
      </ul>
    </div>
  </body>
  ...
```

^Note: the collection is specified as data in the controller

---

### Dependency Injection

Dependency Injection is a software design pattern that provides objects and functions their dependencies.

---

There are 3 ways an object or function can access its dependencies:

1. Create the dependency using the `new` operator
2. Refer to the dependency globally
3. The dependency is passed to the object or function

Dependency Injection in AngularJS is based on step 3

^Note: the first two options aren't ideal as they hardcode the dependencies

---

Passing of depedencies is ideal as it removes the need for objects or functions to locate it themselves.

This approach makes code loosely coupled.

---

Injecting dependencies in AngularJS is very easy.

To add the built-in HTTP service for example, simply add `$http` to the controller's argument list

```js
studentApp.controller('StudentsCtrl', function ($scope, $http) {
    // the HTTP service is now usable!
    $http.get('/students.json').success(function (data) {
        $scope.students = data;
    });
});
```

---

## Filters

Angular provides the following filters:

* currency
* date
* filter
* json
* limitTo
* lowercase
* number
* orderBy
* uppercase

---

To use filters, add them to a template

```html
  ...
  <body>
    <div>
      <p>{{ 1234.56 | currency: "RM" }}</p>
      <p>{{ 1288323623006 | date:'yyyy-MM-dd HH:mm:ss ' }}</p>
      <p>{{ { name : 'John Doe' } | json }}</p>
      <p>{{ [ 1, 2, 3, 4, 5 ] | limitTo: 3 }}</p>
      <p>{{ "ALL CAPS" | lowercase }}</p>
      <p>{{ "ALL CAPS" | number }}</p>
      <p>{{ "ALL CAPS" | orderBy }}</p>
      <p>{{ "all small" | uppercase }}</p>
    </div>
  </body>
  ...
```

---


Custom filters can be created in Angular:

```js
angular.module('studentFilters', []).filter('customFilter', function () {
    return function (input) {
        return input ? 'val1' : 'val2';
    };
});
```

---

### Routing

As the application grows in size, it should be broken into multiple views.

This provides some benefits:

* Separation of concerns
* Easy management of complexity
* Tidier templates

---

When using multiple views, the purpose of **index.html** changes. It now becomes a layout template, a basis for all other templates.

Other templates, referred to as **partials**, are then included in
index.html - this changes depending on the current route.

---

First, restructure `index.html`

```html
<!doctype html>
<html ng-app="studentApp">
  <head>
    < script src="/js/angular.js">< /script>
    < script src="/js/student.js">< /script>
  </head>
  <body>
    <div ng-view></div>
  </body>
</html>
```

---

Second, move the template for students to `partials\students.html`:

```html
<div>
  <label>Name:</label>
  <input type="text" ng-model="query">

  <ul>
    <li ng-repeat="student in students | filter : query">
      <a href="/#/students/{{ student.id }}">
        {{ student.firstName }} {{ student.lastName }}
      </a>
    </li>
  </ul>
</div>
```

---

Create a template for individual students at `partials\student.html`:

```html
<h1>Details for Student #{{ student.id }}</h1>

<p>First Name : {{ student.firstName }}</p>
<p>Last Name  : {{ student.lastName }}</p>
```

---

Support for routing in Angular v1.2 and greater has been moved to its own file.

Download it from <http://bit.ly/1EZR2qJ>.

---

Add a script tag for the route file:

```html
  ...
  <head>
    < script src="/js/angular.js">< /script>
    < script src="/js/angular-route.js">< /script>
    < script src="/js/student.js">< /script>
  </head>
  ...
```

Set the module to use the routing provider in `student.js`:

```js
var studentApp = angular.module('studentApp', [ 'ngRoute' ]);
```

---

Next, configure the routing for the application:

```js
studentApp.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
        .when('/students', {
            templateUrl : 'partials/students.html',
            controller  : 'StudentsCtrl'
        })
        .when('/students/:studentId', {
            templateUrl : 'partials/student.html',
            controller  : 'StudentCtrl'
        })
        .otherwise({
            redirectTo : '/students'
        });
    }
]);
```

---

Add an extra controller to handle individual students:

```js
studentApp.controller('StudentCtrl', function ($scope, $routeParams, $http) {
  var studentId = $routeParams.studentId;
  $http.get('students/' + studentId + '.json').success(function (data) {
      $scope.student = data;
  });
});
```

The $routeParams dependency provides access to URI parameters.

---

## Events

Angular provides the following directives for event handling:

* ng-click, ng-dbl-click
* ng-mousedown, ng-mouseup
* ng-mouseenter, ng-mouseleave
* ng-mousemove, ng-mouseover
* ng-keydown, ng-keyup
* ng-keypress, ng-change

---

To create a click event, add an event directive to a template

```html
<!-- partials/students.html -->
<div>
  <label>Name:</label>
  <input type="text" ng-model="query">

  <ul>
    <li ng-repeat="student in students | filter : query">
      <a href="/#/students/{{ student.id }}">{{ student.firstName }} {{ student.lastName }}</a>
    </li>
  </ul>

  <button ng-click="message($event)"></button>
</div>
```

---

Add a function to the controller's `$scope` object:

```js
studentApp.controller('StudentsCtrl', function ($scope, $http, Student) {
    ...

    $scope.message = function (e) {
        console.log(e);
        alert('Hello World!');
    };
});
```

---

## Services

Angular services are used to organize and share code across your application.

They are by design:

* Lazily instantiated
* Singletons

---

Custom services can be created in AngularJS:

```js
studentApp.factory('Student', function () {
  return function Student (firstName, lastName) {
    return {
        firstName : firstName,
        lastName  : lastName
    };
  };
});
```

---

Using it is easy as Angular handles dependency injection automatically.

```js
studentApp.controller('StudentCtrl', function ($scope, $routeParams, $http, Student) {
  ...
  // Student is now accessible
  var student = new Student('Bruce', 'Wayne');
  ...
});
```

---

## LoopBack Services

---

### Generating LoopBack Services

```
~/my-app$ mkdir client/js/services
~/my-app$ lb-ng server/server.js client/js/services/loopback-services.js
```

---

### LoopBack and Angular

```js
// in app.js
angular
    .module('app', [
        'ui.router',
        'lbServices'
    ])
    .config(['$stateProvider', '$urlRouterProvider', function( $stateProvider, $urlRouterProvider ) {
        $stateProvider

            // other routes...

            .state('all-reviews', {
            url: '/all-reviews',
                templateUrl: 'views/all-reviews.html',
                controller: 'AllReviewsController'
            })
  
        // ...
```

---

### LoopBack and Angular

```js
// in AllReviewsController.js
angular
    .module('app')
    .controller('AllReviewsController', ['$scope', 'Review', function($scope, Review) {
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

### LoopBack and Angular

```html
<!-- in /views/all-reviews.html -->
<section>
  <article ng-repeat="r in reviews.slice().reverse()">
    <header>
      <h1>{{r.date | date}} | {{r.coffeeShop.name}}</h1>
      <h2>{{r.reviewer.username}}</h2>
    </header>
    <p>{{r.rating}} stars: {{r.comments}}</p>
  </article>
</section>
```

---

# fin
