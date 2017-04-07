
![](/images/StrongLoop.png)

# Build, Deploy, and Scale

---

## Building a Node.js App

Produce a packaged container suitable for deployment to [strong-pm](https://strong-pm.io/)

Include all dependencies (except those that require OS-level building)

---

### Prepare Your Application

Tell npm about your bundled dependencies (for deployment):

```
~/my-app$ slc build --bundle
```

_Be sure to keep the `bundleDependencies` property in `package.json` up to date!_

Then edit the newly created `.npmignore` file to remove things like test files
from the bundled deployment.

---

## Building from CLI

To an npm archive (tar gzip):

```
~/my-app$ slc build --npm
~/my-app$ ls
... ...  my-app-0.1.0.tgz
```

To a git branch (`deploy`):

```
~/my-app$ slc build --git
~/my-app$ slc build --git --onto foobar
```

---

### Committing a Deployment

It is generally bad practice to commit dependencies to a source repository.

You can use `slc` to produce a build artifact and commit it to source control:

```
~/my-app$ slc build --git --commit
```

These builds are also suitable for deployment to Amazon or Heroku.

---

### Including Built Dependencies

You can speed up deployments by including OS-level building of dependencies:

```
~/my-app$ slc build --npm --install --scripts
```

_Caution! You need to be on the same system architecture as the machine you deploy to._

---

### Locking Down Dependency Versions

Running `npm install` on a deployment machine can be dangerous as you may get newer (broken) versions of dependencies.

We can lock down dependency versions with:

```
~/my-app$ npm shrinkwrap
```

_**However**, if npm is down at the time of deployment you're still in trouble!_

---

## Deploying Your App

By using the StrongLoop Process Manager you can achieve zero-downtime deploys.

This is done with rolling deployments (one pid at a time).

---

### Setting Up Strong-PM

First, run strong-pm on your deployment machine:

```
~$ npm install -g strong-pm
~$ sl-pm-install
~$ /sbin/initctl start strong-pm
```

You should also set the `NODE_ENV` environment variable to "production"!

_(Note that you may need to run these under `sudo`)_

^ These commands are for Ubuntu, but similar commands work on other Linux ditros
This also sets up auto-restart (system service)

---

### Setup PM Authentication

```
~$ sl-pm-install --http-auth admin:foobar
```

Read more about [securing the process manager](http://docs.strongloop.com/display/SLC/Securing+Process+Manager).

---

## Deploying Your App

After running `slc build ...`

```
~/my-app$ slc deploy http://myserver.com:8701
```

Or with key-based authentication:

```
~/my-app$ slc deploy http+ssh://myserver.com:8701
```

Note that `8701` is default port for strong-pm.

---

### Deploying Multiple Apps

You can deploy multiple applications to a single instance of strong-pm with service names

```
~/my-app$ slc deploy -s myapp http://myserver.com:8701 /path/to/my-app-0.1.0.tgz
```

The service name defaults to the `name` property in package.json

---

<!-- .slide: data-background="white" -->

## Building and Deploying From Arc

![](/images/arc-build-deploy.png)

---

# Scaling

---

<!-- .slide: data-background="white" -->

![](/images/vertial-scaling-strongloop.png)

---

## Scaling with `cluster`

Do you really want this in your source code?

```js
var http = require('http'),
    cluster = require('cluster');

if (cluster.isMaster) {
  
    for (var i = 0; i < numCPUCores; i++) {
        cluster.fork();
    };
  
} else {
    http.createServer(function(req, res) { ... })
        .listen(8080, ...);
});
```

---

## Vertical Scaling with PM

Instead, we can control our PM instances from a local machine.

From your machine (any machine with `strongloop` installed):

```
~$ slc ctl -C http://myserver.com:8701 set-size myapp 8
```

_If running locally, with one service you could just do:_

```
~$ slc ctl set-size 2
```

---

<!-- .slide: data-background="white" -->

![fit](/images/horizontal-scaling.png)

---

## Horizontal Scaling

1. Install a load balancer (optional... but you should!)
1. Install `strong-pm` on each machine
1. Deploy to each host
1. Use Arc to manage all instances together!

---

<!-- .slide: data-background="white" -->

### Managing Hosts from Arc

![](/images/arc-pm.png)

---

<!-- .slide: data-background="white" -->

### Managing Hosts from Arc

![](/images/arc-cluster-restart.png)

---

## Load Balancing with [nginx](http://wiki.nginx.org/Main)

---

### Load Balancing with nginx

First, each machine should run nginx with a proxy pass:

```Nginx
server {
    listen 80
    location / {
        proxy_pass http://localhost:3000;
    }
 
    location /static/ {
        root /var/www/my-app/public;
    }
}
```

Notice we also serve static files straight from nginx!

^ Discuss how nginx is better suited to serving static files, Node is not.

---

### Load Balancing with nginx

Then add a load balancing machine:

```Nginx
http {
    upstream myapp {
        least_conn; # round-robin is the default...
                    # Or use ip_hash; for "sticky" sessions...
        server www1.my-app.com;
        server www2.my-app.com;
        server www3.my-app.com;
    }

    server {
        listen 80
        location / {
            proxy_pass http://myapp;
        }
    }
}
```

^ Discuss least_conn versus round robin (the default)
And be sure to discuss session management in a distributed system!

---

### StrongLoop and nginx

Then install the [StrongLoop nginx controller](http://docs.strongloop.com/display/SLC/Configuring+Nginx+load+balancer) on the load balancer:

```bash
~$ npm install -g strong-nginx-controller

~$ sl-nginx-ctl-install
```

---

### StrongLoop and nginx

And manage the load balancing infrastructure from [StrongLoop Arc](http://docs.strongloop.com/display/SLC/Managing+multi-server+apps#Managingmulti-serverapps-Addingaloadbalancer):

![Arc Load Balancer Config](/images/arc-load-balancer.png)

---

# fin
