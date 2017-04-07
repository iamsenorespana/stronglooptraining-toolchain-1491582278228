
## Scaling

---

![fit](/images/event-loop.png)

---

### Vertical Scaling

<img src="images/vertial-scaling-strongloop.png" style="width:100%">

---

## Use a Process Manager!

---

### Using a Process Manager

* Easy clustering
* Auto-restart
* Remote deployment
* Metrics and monitoring
* Production profiling

## [strong-pm](https://github.com/strongloop/strong-pm)
<!-- .element: class="fragment" -->

---

### Install and Start the PM

(On your _deployment_ machine...)

```no-highlight
~$ npm install -g strong-pm
~$ sl-pm-install
~$ /sbin/initctl start strong-pm
```

Be sure to set the `NODE_ENV`  
environment variable to "production"!

---

## Build and Deploy

---

### Build Your App with `slc`

(On your _local_ or _build_ machine...)

```no-highlight
~/my-app$ slc build --npm
...
```

`../my-app-1.0.0.tgz`
<!-- .element: class="fragment" -->

---

### Deploy to Strong PM

(On your _local_ or _build_ machine...)

```no-highlight
~/my-app$ slc deploy http://myserver.com:8701
```

(Read more about [securing the process manager](http://docs.strongloop.com/display/SLC/Securing+Process+Manager).)

---

## Scale the Cluster

```no-highlight
~$ slc ctl -C http://myserver.com:8701 set-size my-app 8
```

---

<!-- .slide: data-background="white" -->

### Managing Hosts from Arc

![](/images/arc-pm.png)

---

<!-- .slide: data-background="white" -->

### Managing Hosts from Arc

![](/images/arc-cluster-restart.png)
