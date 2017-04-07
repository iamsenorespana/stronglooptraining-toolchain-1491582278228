
![](/images/StrongLoop.png)

# Push Notifications

---

## Push Notifications

* Overview of LB Push Notification Support & API
* Sending Push Notifications on iOS
* Sending Push Notifications on Android

---

### Push Notifications

- Push notifications enable server applications to be able to be sending information to mobile apps even when the app isn’t in use.
- The device displays the information using a "badge," alert, or pop up message.

^So what're push notifications (Most shall be aware)

---

### How does it work ? (1/2)

A push notification uses the service provided by the device's operating system:

1. iOS - Apple Push Notification service (APNS)
1. Android - Google Cloud Messaging (GCM)

---

<!-- .slide: data-background="white" -->

### How does it work ? (2/2)

![inline](/images/push-notification.png)

^So we need our cloud friends (Google and Apple) to make it work.
How Push Notifications Work?

---

### Making it work -- Steps by Step

^And how do we go about the implementation ? Let's look at the steps involved


### Setup and clone the example component

1. Create a LoopBack server application
  2. setup dependencies `npm install loopback-component-push`
  3. Use the sample app:

```bash
~$ git clone
~$ https://github.com/strongloop/loopback-component-push.git
```

---

2. Configure your iOS and Android client apps accordingly.

---

### Setup an server to android client communication

* Set up messaging credentials for Android apps
* Get your credentials for Android apps at http://bit.ly/1J2ODym). After following the instructions, you will have a GCM API key.
* Then edit example/server/config.js and look for the line:
  `exports.gcmServerApiKey = 'Your-server-api-key';`

---

* Replace Your-server-api-key with your GCM server API key. For example: `exports.gcmServerApiKey = 'AIzaSyDEPWYN9ehc';`

^Here's how we setup GCM credentials for our app. The iOS process at apple is also similar.

---

### Setup an server to android client communication

* once done with GCM credentials, get further in sample app
  * `cd example/server`
  * `npm install` to install all modules needed
  * start the app `node app`

---

You will see the message:

```
The server is running at http://127.0.0.1:3010
```

---

### Set up your LoopBack application to send push notifications

* Install Loopback push notification module
  * `npm install loopback-component-push`
* To send push notifications, you must create a push model(using Mongoose).  *The code below illustrates how to do this with a database as the data source.* The database is used to load and store the corresponding application/user/installation models.

---

```js
var loopback = require('loopback');
var app = loopback();
var Notification = app.models.notification;
var Application = app.models.application;
var PushModel = app.models.push;
```

^Here's where loopback comes in.

---

### Configure the application with push settings

Register a mobile application(Android)

*The mobile application needs to register with LoopBack so it can have an identity for the application and corresponding settings for push services. Use the Application model's register() function for sign-up.*

Follow http://bit.ly/1J2ORFD for more details.

^ We need to configure the loopback powered application with our credentials next. (References to be followed here) . here's the one for Android


---

### Configure the application with push settings

Register a mobile application(iOS)

The mobile application needs to register with LoopBack so it can have an identity for the application and corresponding settings for push services. Use the Application model's register() function for sign-up.

Follow http://bit.ly/1J2ORFD for more details.

^here's the one for iOS

---

### Send push notifications

LoopBack provides two Node.js methods to select devices and send notifications to them:

* `notifyById()`: Select a device by registration ID(of the registered device) and send a notification to it.
* `notifyByQuery()`: Get a list of devices using a query and send a notification to all of them.

^Herein lies the main logic. How are the notificatiosn triggered

---

## Notification Send with loopback Code wise
### Code-wise 1/3

Setting up notification:

```js
var badge = 1;
app.post('/notify/:id', function (req, res, next) {
 var note = new Notification({
   expirationInterval: 3600,
   // Expires 1 hour from now.
   badge: badge++,
   sound: 'ping.aiff',
   alert: '\uD83D\uDCE7 \u2709 ' + 'Hello',
   messageFrom: 'Ray'
 });
```

^Let's look at the code involved (prreparing the message)

---


## Notification Send with loopback Code wise
### Code-wise 2/3

PushModel.notifyById() example:

```js
PushModel.notifyById(req.params.id, note, function(err) {
    if (err) {
        // let the default error handling middleware
        // report the error in an appropriate way
        return next(err);
    }
    console.log('pushing notification to %j', req.params.id);
    res.send(200, 'OK');
    });
 });
```

^Further code (notifyById function)

---

## Notification Send with loopback Code wise
### Code-wise 3/3

`PushModel.notifyByQuery()` example:

```js
PushModel.notifyByQuery({userId: {inq: selectedUserIds}}, note, function(err) {
    console.log('pushing notification to %j', selectedUserIds);
});
```

---

References:

* Push API http://bit.ly/1J2PdMA
* Loopback tutorial (ios and Android): http://bit.ly/1J2PhMt

^Further code (notifyByQuery function)

---

<!-- .slide: data-background="white" -->

### Loopback Push Architecture

<img src='/images/push-notification-loopback.png' style='width:70%; margin-top:0;'>

^Here's a diagramatic representation of the architecture

---


## Push Notifications on iOS application
### Steps involved (Server App)

Server side (Loopback app): Configure Push notifactions sending capable Server app (with loopback power)

Tutorial for Push capable Loopback app for iOS: <http://bit.ly/1EOwPqM>

^<https://github.com/strongloop/loopback-component-push/tree/master/example/ios>
Lets look at creating a loopback app with push capabilities. Here are the steps involved.

---

## Push Notifications on iOS application
### Steps involved (Client app)


Mobile Side (iOS app)

* Provision an application with Apple and configure it to enable push notifications.
* Add LoopBack iOS SDK as a framework.
* Initialize LBRESTAdapter
* Register the device
* Handle received notifications
* Provide code to receive notifications, under three different application modes: foreground, background, and offline.
* Process notifications.

^ Lets look at creating a loopback app with push capabilities. Here are the steps involved on Client side (iOS App).

---

## Push Notifications on iOS application
### Step 1 - Create a server app that sends push notifications to subscribed clients

* Getting loopback push dependencies setup
* Preparing the notification with code
* Sending the notification using loopback code

^Create a server app that sends push notifications to subscribed clients

---

## Push Notifications on iOS application
### Step 2.1 - Configure your iOS application to receive loopback


Registering an app, and getting APN credentials (as discussed here and earlier).

Please see Register a mobile application at <http://bit.ly/1GFaufR>.

^<http://docs.strongloop.com/display/LB/Push+notifications#Pushnotifications-Registeramobileapplication> Provision an application with Apple and configure it to enable push notifications.

---


## Push Notifications on iOS application (Client side)
### Step 2.2 - Add LoopBack iOS SDK as a framework

Open your XCode project, select targets, under build phases unfold Link Binary with Libraries, and click on '+' to add LoopBack framework.

XCode Setup: http://bit.ly/1zaEHQQ

^http://docs.strongloop.com/download/attachments/3836331/loopback-framework.png?version=1&modificationDate=1405990869000&api=v2 Adding LoopBack iOS SDK as a framework

---

### Push Notifications on iOS application (Client side)
#### Step 2.3 - Add LoopBack iOS SDK as a framework

The LoopBack iOS SDK provides two classes to simplify push notification programming:

* LBInstallation - enables the iOS application to register mobile devices with LoopBack. (http://bit.ly/1P3PUEQ)
* LBPushNotification - provides a set of helper methods to handle common tasks for push notifications. (http://bit.ly/1OAZzYJ)

^http://apidocs.strongloop.com/loopback-sdk-ios/api/interface_l_b_installation.html
http://apidocs.strongloop.com/loopback-sdk-ios/api/interface_l_b_push_notification.html
Step 2.3 :: Add LoopBack iOS SDK as a framework

---

### Push Notifications on iOS application (Client side)
###3 Step 2.4 - Initialize LBRESTAdapter


```objectivec
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.settings = [self loadSettings];
  self.adapter = [LBRESTAdapter adapterWithURL:[NSURL URLWithString:self.settings[@"RootPath"]]];
     // Reference to Push notifs List VC
    self.pnListVC = (NotificationListVC *)[[(UINavigationController *)self.window.rootViewController viewControllers]
                                         objectAtIndex:0];
  LBPushNotification* notification = [LBPushNotification application:application
                                                 didFinishLaunchingWithOptions:launchOptions];

  // Handle APN on Terminated state, app launched because of APN
  if (notification) {
      NSLog(@"Payload from notification: %@", notification.userInfo);
      [self.pnListVC addPushNotification:notification];
  }
  return YES;
}
```

^ Step 2.4 :: Set up hook at iOS client app side . Following code instantiates the shared LBRESTAdapter. In most circumstances, you do this only once; putting the reference in a singleton is recommended for the sake of simplicity. However, some applications will need to talk to more than one server; in this case, create as many adapters as you need.

---


## Push Notifications on iOS application (Client side)
### Step 2.5 - Register the device

```objectivec
 - (void)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken
  {
    __unsafe_unretained typeof(self) weakSelf = self;

    // Register the device token with the LoopBack push notification service
    [LBPushNotification application:application
    didRegisterForRemoteNotificationsWithDeviceToken:deviceToken
    adapter:self.adapter
    userId:@"anonymous"
      subscriptions:@[@"all"]
            success:^(id model) {
                LBInstallation *device = (LBInstallation *)model;
                weakSelf.registrationId = device._id;
            }
            failure:^(NSError *err) {
                NSLog(@"Failed to register device, error: %@", err);
            }
        ];
```

---

```objectivec
  - (void)application:(UIApplication*)application didFailToRegisterForRemoteNotificationsWithError:(NSError*)error
    {
      // Handle errors if it fails to receive the device token
        [LBPushNotification application:application didFailToRegisterForRemoteNotificationsWithError:error];
    }
    }
```

^ Code to register the device (. I can rush through this if not an iOS audience)

---


## Push Notifications on android application (Step by Step)
### The flow


Steps To enable an Android app to receive LoopBack push notifications:

* Setup your app to use Google Play Services.
* On app startup, register with GCM servers to obtain a device registration ID (device token) and register the device with the LoopBack server application.

---

Configure your LoopBack application to receive incoming messages from GCM.

* Setup Eclipse ADT and Configure Android Development Tools
* Process the notifications received.

^ As with iOS app, Android apps can be setup in the same way to couple with server and be push notifications capable. The server side loopback remains the same, client side is now setup in Android setup


---

## Push Notifications on android application (Android Client side)
### Step 1.1 - Setup Development tools

Before you start developing your application make sure you've the following done:

* Download the [LoopBack Android SDK](http://docs.strongloop.com/display/LB/Android+SDK)
* Install [Eclipse development tools (ADT)](http://developer.android.com/sdk/index.html)

^Start with dev tools setup

---

## Push Notifications on android application (Android Client side)
### Step 1.2 - Configure Android Development Tools

* Open Eclipse from the downloaded ADT bundle.
* In ADT, choose Window > Android SDK Manager.
* Install the following if they are not already installed:

---

Tools:

* Android SDK Platform-tools 18 or newer
* Android SDK Build-tools 18 or newer
* Android 4.3 (API 18):
* SDK Platform.
* Google APIs

^Configure Dev tools

---

## Push Notifications on android application (Android Client side)
### Step 1.2 - Configure Android Development Tools (continued)

* Before you start, make sure you have set up at least one Android virtual device: Choose  Window > Android Virtual Device Manager .
* Configure the target virtual device as shown in the screenshot below.  See  AVD Manager (<http://bit.ly/1HOY4Au>) for more information.

---

<!-- .slide: data-background="white" -->

![inline](/images/avd.png)

^AVD manager http://developer.android.com/tools/help/avd-manager.html

---

## Push Notifications on android application (Android Client side)
### Step 1.3 - Get your Google Cloud Messaging credentials

**Get your Google Cloud Messaging credentials**

* To send push notifications to your Android app, you need to setup a Google API project and enable the Google Cloud Messaging (GCM) service.
* Open the [Android Developer's Guide](http://developer.android.com/google/gcm/gs.html#create-proj)
* Follow the instructions to get your GCM credentials:

---

## Push Notifications on android application (Android Client side)

Follow steps to create a Google API project and enable the GCM service.

* Create an Android API key
* In the sidebar on the left, select APIs & auth > Credentials.
* Click Create new key.
* Select Android key.

---

## Push Notifications on android application (Android Client side)

Enter the SHA-1 fingerprint followed by the package name, for example:

```
45:B5:E4:6F:36:AD:0A:98:94:B4:02:66:2B:12:17:F2:56:26:A0:E0;com.example
```

NOTE: Leave the package name as "com.example" for the time being.

---

## Push Notifications on android application (Android Client side)
### Step 1.3 - Get your Google Cloud Messaging credentials (Continued ... )


You also have to create a new server API key that will be used by the LoopBack server:

* Click Create new key.
* Select Server key.
* Leave the list of allowed IP addresses empty for now.
* Click Create.
* Copy down the API key.  Later you will use this when you
* configure the LoopBack server application.

^Create a new server key by logging on to Google Cloud Messaging Server

---

## Push Notifications on android application (Android Client side)
### Step 1.4 - Create and configure your Android app

^Now you android app (which shall already be created) can now be configured to enable messaging

---

## Push Notifications on android application (Android Client side)
### Step 1.5 - Setup GCM credentials in your server app

Configure GCM push settings in your server application. Add the following key and value to the push settings of your application:

```js
{
  gcm: {
    serverApiKey: "server-api-key"
  }
}
```

---

Replace server-api-key with the API key you obtained earlier in the session

^This is same as before step, the server credentials created earlier need to be setup in your loopback server app

---

## Push Notifications on android application (Android Client side)
### Step 1.5 - Setup your android app now for push messaging

* Imp Note : Things here depend on Google Play Services so we must check by calling  checkPlayServices()
* if  this method returns true, it proceeds with GCM registration.  The checkPlayServices() method checks whether the device has the Google Play Services APK.
* If  it doesn't, it displays a dialog that allows users to download the APK from the Google Play Store or enables it in the device's system settings.

^Now we look at enabling messaging in our android app

---

## Push Notifications on android application (Android Client side)
### Step 1.5 - Setup your android app now for push messaging


```java
public void onCreate(final Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main);

    if (checkPlayServices()) {
        updateRegistration();
    } else {
        Log.i(TAG, "No valid Google Play Services APK found.");
    }
}
 ....
```

^Looking at associated code

---

## Push Notifications on android application (Android Client side)
### Step 1.5 - Setup your android app now for push messaging(continued ..)


```java
private boolean checkPlayServices() {
    int resultCode = GooglePlayServicesUtil.isGooglePlayServicesAvailable(this);
    if (resultCode != ConnectionResult.SUCCESS) {
        if (GooglePlayServicesUtil.isUserRecoverableError(resultCode)) {
            GooglePlayServicesUtil.getErrorDialog(resultCode, this,
                    PLAY_SERVICES_RESOLUTION_REQUEST).show();
        } else {
            Log.i(TAG, "This device is not supported.");
            finish();
        }
        return false;
    }
    return true;
}
```

^ Looking at associated code

---

## Push Notifications on android application (Android Client side)
### Step 1.6 - Create LocalInstallation


Once you have ensured the device provides **Google Play Services**, the app can register with GCM and LoopBack (for example, by calling a method such as updateRegistration() as shown below). Rather than register with GCM every time the app starts, simply store and retrieve the registration ID (device token).

---

The LocalInstallation class in the LoopBack SDK handles these details for you.
For more information on LocallInstallation, see [Working with the LocalInstallation class](http://docs.strongloop.com/display/LB/Working+with+the+LocalInstallation+class).

^ Setup Android code now for the rest (LocalInstallation class)

---

The example **updateRegistration(**) method does the following:

* Lines 3 - 4: get a reference to the shared RestAdapter instance.
* Line 5: Create an instance of LocalInstallation.
* Line 13: Subscribe to topics.
* Lines 15-19: Check if there is a valid GCM registration ID.  If so, then save the installation to the server; if not, get one from GCM and then save the installation.

---

## Push Notifications on android application (Android Client side)
### Step 1.6 - Create LocalInstallation (continued .. )

```java
private void updateRegistration() {
    final DemoApplication app = (DemoApplication) getApplication();
    final RestAdapter adapter = app.getLoopBackAdapter();
    final LocalInstallation installation = new LocalInstallation(context, adapter);

    // Substitute the real ID of the LoopBack application as created by the server
    installation.setAppId("loopback-app-id");

    // Substitute a real ID of the user logged in to the application
    installation.setUserId("loopback-android");

    installation.setSubscriptions(new String[] { "all" });

    if (installation.getDeviceToken() != null) {
        saveInstallation(installation);
    } else {
        registerInBackground(installation);
    }
}
```

^ See how updateRegistration looks

---

## Push Notifications on android application (Android Client side)
### Step 1.7 - Register with GCM if needed


* The application obtains a new registration ID from GCM.
* Because the register() method is blocking, you must call it on a background thread.

Look at code that follows

^ get a new GCM registration id

---

### Step 1.7 - Register with GCM if needed (continued ...)

```java
private void registerInBackground(final LocalInstallation installation) {
    new AsyncTask<Void, Void, Exception>() {
        @Override
        protected Exception doInBackground(final Void... params) {
            try {
                GoogleCloudMessaging gcm = GoogleCloudMessaging.getInstance(this);
                final String regid = gcm.register("12345"); // replace "12345" !!
                installation.setDeviceToken(regid);
                return null;
            } catch (final IOException ex) {
                return ex;
            }
        }
        @Override
        protected void onPostExecute(final Exception error) {
            if (err != null) {
                Log.e(TAG, "GCM Registration failed.", error);
            } else {
                saveInstallation(installation);
            }
        }
    }.execute(null, null, null);
}
```

---

## Push Notifications on android application (Android Client side)
### Step 1.8 - Register with LoopBack server


Once you have all Installation properties set, you can register with the LoopBack server. The first run of the application should create a new Installation record, subsequent runs should update this existing record. The LoopBack Android SDK handles the details.  Your code just needs to call save().

The following code shows the same.

^Write code to get Installation Id generated

---

## Push Notifications on android application (Android Client side)
### Step 1.8 - Register with LoopBack server (Code)


```java
void saveInstallation(final LocalInstallation installation) {
    installation.save(new Model.Callback() {
        @Override
        public void onSuccess() {
            // Installation was saved.
            // You can access the id assigned by the server via
            //   installation.getId();
        }
        @Override
        public void onError(final Throwable t) {
            Log.e(TAG, "Cannot save Installation", t);
        }
    });
}
```

---

## Push Notifications on android application (Android Client side)
### Step 1.9 - Handle received notifications

Android apps handle incoming notifications in the standard way; LoopBack does not require any special changes. For more information, see the section "Receive a message" of Google's Implementing GCM Client guide. (<http://bit.ly/1HVvq2c>)

^http://developer.android.com/google/gcm/client.html

---

# fin
