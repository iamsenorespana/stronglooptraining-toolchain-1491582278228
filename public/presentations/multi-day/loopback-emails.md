
![](/images/StrongLoop.png)

# Sending Emails from LoopBack

---

### Sending Emails using Non-DB connector `Email`

Email model extends LoopBack base Model.

Email Model Properties(options)
* to - String, Email addressee, Required.
* from  - String    ,Email sender address, Required.
* subject - String, Email subject string, Required.
* text  - String    ,Text body of email
* html - String,HTML body of email

(See [NodeMailer](https://github.com/andris9/Nodemailer) for other supported options.)

---

## Creating an email data source
### Installing

Create a new email data source with the data source generator:

```
$ slc loopback:datasource
```

^ No module installation is required in loopback as email is an included connector

---

When prompted, select Email as the connector.  This creates an entry in datasources.json like this (for example):

`/server/datasources.json`:

```javascript
"myEmailDataSource": {
   "name": "myEmailDataSource",
   "connector": "mail"
 }
```

---

## Configuring an email data source
### Configure the email data source

Configure the email data source by editing /server/datasources.json (for example):

---

`/server/datasources.json`:

```javascript
{
  ...
  "myEmailDataSource": {
     "connector": "mail",
     "transports": [{
       "type": "smtp",
       "host": "smtp.private.com",
       "secure": false,
       "port": 587,
       "tls": {
         "rejectUnauthorized": false
       },
       "auth": {
         "user": "me@private.com",
         "pass": "password"
       }
     }]
  }
  ...
}
```

---

## Sending emails in Loopback
###Connecting a model to the email data source

Then, connect models to the data source in /server/model-config.json as follows (for example) in `/server/model-config.json`:

```javascript
{
  ...
  "Email": {
    "dataSource": "myEmailDataSource",
  },
  ...
}
```

---

# fin
