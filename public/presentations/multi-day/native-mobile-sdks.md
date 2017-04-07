
![](/images/StrongLoop.png)

# Native App SDKs

---

## Native App SDKs

LoopBack provides SDKs for Android and iOS development.

These tools provide simple Java and Objective C APIs to interact with your LoopBack application.

---

## Android SDK

[SDK Documentation](http://docs.strongloop.com/display/LB/Android+SDK) is on the StrongLoop web site.

1. Create the model class
<!-- .element: class="fragment" -->
1. Create a model repository
<!-- .element: class="fragment" -->
1. Create a REST adapter
<!-- .element: class="fragment" -->
1. Connect them all together
<!-- .element: class="fragment" -->

---

### Creating a Model

```java
import com.strongloop.android.loopback.Model;

public class Widget extends Model {

    private String name;
    private float price;

    public void setName(String name) { this.name = name; }
    public String getName() { return name; }

    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getPrice() { return price; }
}
```

---

### Create a Model Repository

```java
public class WidgetRepository extends ModelRepository<Widget> {
    public WidgetRepository() {
        // connect the server "widget" model to the Java Class
        super("widget", Widget.class);
    }
}
```

The "Repository" is your collection of widgets, depending on the data source this could be an SQL table, a MongoDB collection, etc.

---

### Connecting Front and Back

```java
RestAdapter adapter = new RestAdapter("http://myserver.com:3000/api");

WidgetRepository repository = adapter.createRepository(WidgetRepository.class);
```

We have to tell our repository where to find our api (the base path).

---

### Using the API

```java
Widget pencil = repository.createObject( ImmutableMap.of("name", "Pencil") );
pencil.price = 1.5;

pencil.save(new VoidCallback() {
    @Override
    public void onSuccess() {
        // Pencil now exists on the server!
    }
 
    @Override
    public void onError(Throwable t) {
        // save failed, handle the error
    }
});
```

---

### Finding Records

```java
repository.findById(2, new ObjectCallback<Widget>() {
    @Override
    public void onSuccess(Widget widget) {
        // process the data
    }
 
    public void onError(Throwable t) {
        // handle the error
    }
});
```

---

### API Authentication

First, create the User repository:

```java
public static class UserRepository extends com.strongloop.android.loopback.UserRepository<User> {
    public interface LoginCallback extends com.strongloop.android.loopback.UserRepository.LoginCallback<User> {
        // code to execute when a user logs in...
    }
    public UserRepository() {
        super("user", null, User.class);
    }
}
```

_(You could create a custom `User` class as well, if needed.)_

---

### API Authentication

```java
RestAdapter restAdapter = new RestAdapter("http://myserver.com:3000/api");
UserRepository userRepo = restAdapter.createRepository(UserRepository.class);

userRepo.loginUser(username, password, new UserRepository.LoginCallback() {
    @Override
    public void onSuccess(AccessToken token, User currentUser) {
        // w00t!
    }
    
    @Override
    public void onError(Throwable t) {
        // handle the error
    }
});
```

```java
userRepo.logout(new VoidCallback() {
    // ...
});
```
<!-- .element: class="fragment" -->

---

## iOS SDK

Very similar to the Android version, just in Objective C!

Still need to create a model, adapter, repository, and connect them all!

---

### iOS SDK Basics

```objectivec
#import <LoopBack/LoopBack.h>

@interface Widget : LBModel
@property (nonatomic, copy) NSString *name;
@property (nonatomic) NSNumber *price;
 
@end
```

```objectivec
LBRESTAdapter *adapter = [LBRESTAdapter adapterWithURL:[NSURL URLWithString:@"http://myserver.com:3000/api"]];

LBModelRepository *repository = [adapter repositoryWithModelName:@"widgets"];

Widget *pencil = (Widget *)[repository modelWithDictionary:@{ @"name": @"Pencil", @"price": @1.5 }];
```

---

## iOS SDK

Saving a new model is easy:

```objectivec
[pencil saveWithSuccess:^{
    // Pencil now exists on the server!
}
failure:^(NSError *error) {
    NSLog("An error occurred: %@", error);
}];
```

---

## iOS SDK

So is finding models!

```objectivec
[repository findWithId:@2
    success:^(LBModel *model) {
        Widget *pencil = (Widget *)model;
    }
    failure:^(NSError *error) {
        NSLog("An error occurred: %@", error);
    }
];
```

---

#fin
