'use strict';

var x = 10;
x = 5;

var y = 20;

y = 8;

function foo() {
    var x = 15;
    
    return x;
}

var z = foo();

z = x;