---
title: 6 simple steps to get your first Vapor JSON response
date: 2016-11-08 12:42:00
tags: vapor,setup
authorId: olha
categories:
- Vapor
---

6 simple steps to setup your first Vapor JSON response. We will cover the initial setup and how to make both POST and GET with controllers and models. 

This tutorial will assume that you already have installed [Vapor](https://vapor.github.io/documentation/getting-started/install-swift-3-macos.html) and [Xcode 8](https://developer.apple.com/xcode/) and are familiar with Swift 3.

### 1. Creating your project

Now open your terminal and cd into the place you want your project.

Now run (also in the terminal, of course change the ProjectName to your actual project name)

```javascript
vapor new ProjectName
```
You should now see an ASCII art of the Vapor logo. Like so:

```bash

    												**
                                                 **~~**
                                               **~~~~~~**
                                             **~~~~~~~~~~**
                                           **~~~~~~~~~~~~~~**
                                         **~~~~~~~~~~~~~~~~~~**
                                       **~~~~~~~~~~~~~~~~~~~~~~**
                                      **~~~~~~~~~~~~~~~~~~~~~~~~**
                                     **~~~~~~~~~~~~~~~~~~~~~~~~~~**
                                    **~~~~~~~~~~~~~~~~~~~~~~~~~~~~**
                                    **~~~~~~~~~~~~~~~~~~~~~~~~~~~~**
                                    **~~~~~~~~~~~~~~~~~~~~~++++~~~**
                                     **~~~~~~~~~~~~~~~~~~~++++~~~**
                                      ***~~~~~~~~~~~~~~~++++~~~***
                                        ****~~~~~~~~~~++++~~****
                                           *****~~~~~~~~~*****
                                              *************
                                     
                                     _       __    ___   ___   ___
                                    \ \  /  / /\  | |_) / / \ | |_)
                                     \_\/  /_/--\ |_|   \_\_/ |_| \
                                       a web framework for Swift

                                 Project "ProjectName" has been created.
                          Type `cd ProjectName ` to enter the project directory.
                                                 Enjoy!

```

Congratulations you have succesfully created your first Vapor project. Let's now try to run the project. First cd into your project (```cd ProjectName```) and after run:

```javascript
vapor xcode
```

Vapor will then fetch the dependencies and run the project. Vapor will now ask you if you want to open the project, and yes, yes we do! (So type y to open)

```javascript
Select the `App` scheme to run.
Open Xcode project?
y/n>
```

You should now have your Xcode project open. Let's check if we have everything running correctly.
So in Xcode press the 'Run' button in the top left corner of the UI (or cmd+r). You should now see this in your console in Xcode (Make sure that you switch target from the framework to App, just next to the stop button)

```javascript
No command supplied, defaulting to serve...
No preparations.
Server 'default' starting at 0.0.0.0:8080
```

Now c+p ```0.0.0.0:8080``` into your browser. If you see the 'It works.' screen then you have successfully run your first local Vapor 

Note: Beacuse Vapor is constantly updating and new versions pushed out frequently then you might have this error in your Xcode project after running for the first time.

```jconsole
ld: library not found for -lCLibreSSL for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

If you didn't get that error then just go to section two of this article. If you did then open your terminal and first run 
```vapor build --clean```, after that run a ```vapor xcode``` that should do the trick. (This basically cleans the project and compiles it again)

And hopefully you should be ready to rock and roll.

### 2. Creating a model

Open the terminal again, and run 
```touch Sources/App/Models/Car.swift```

After that run ```vapor xcode``` this will make sure that you get the correct path for the model. If you open Xcode then you should be able to see your model in the Models folder.

Fill the model with the code below:

```swift
final class Car {
    
    //Add your properties like you normally would in iOS
    var name:String
    var color:String
    var milesDriven:Int
    
    //Convinience method for instanciation of our object
    init(name:String, color:String, milesDriven: Int) {
        self.name = name
        self.color = color
        self.milesDriven = milesDriven
    }
}
```
### 3. Returning some JSON baby

Vapor is using a class called ```Droplet```, the Droplet is the main entry point on the server (If you are familiar with iOS development then this would be our AppDelegate class or your entry point in Storyboard). The Droplet instance will contain all providers, routes and making sure that everything has been linked correctly to run the different functionalities in the run time. The line ```drop.run()``` in the ```main.swift``` is where the server actually gets booted, so everything you need to add have to be before this line.

Now open the ```main.swift``` file and add the following code right above the ```drop.run()```

```swift
//Declaring our first route, this will be a 'get' (could also be 'post' etc..)
drop.get("get_a_car") { request in
    
    //Creating our object
    let car = Car(name: "Toyota", color: "Red", milesDriven: 0)
    
    //Formating it into JSON
    return try JSON(node: [
        "name" : car.name,
        "color" : car.color,
        "miles_driven" : car.milesDriven
        ])
}

```
Now Run your Xcode project. You should now see this in your console in Xcode (Make sure that you switch target from the framework to App, just next to the stop button) 

```jconsole
No command supplied, defaulting to serve...
No preparations.
Server 'default' starting at 0.0.0.0:8080
```
Now open your browser and type in ```0.0.0.0:8080/get_a_car```, you should now have returned your first JSON feed! 

Of course, Vapor is way smarter than this. So please go ahead an delete the code you added in step 3.

### 4. Creating a Controller

Now go back to your terminal and run ```touch Sources/App/Controllers/CarController.swift``` and again ```vapor xcode```, the Controllers folder should now contain your newly created CarController.swift

Before we can make any good use of our new Controller then we have to update our ```Car.swift``` model to actually get some of Vapors awesome magic.

So jump back into the ```Car.swift``` file and update the file to have the following:

```swift
//Importing the Vapor framework to make the model support dependencies
import Vapor
//Importing Fluent which is Vapors powering of databases and tables
import Fluent

//Subclassing our Car model from 'Model' (Vapors magic model object)
final class Car: Model {
    
    //Vapor uses 'Node' as their Model ids. This is the datatype that they use to make lookup and look at the primary key in the DB's.
    var id:Node?
    
    var name:String
    var color:String
    var milesDriven:Int
    
    init(name:String, color:String, milesDriven: Int) {
        self.name = name
        self.color = color
        self.milesDriven = milesDriven
    }
    
    //Adding one of Vapors protocols to conform to the 'Model' object. This basically makes sure that data is mapped correctly when getting extracted from a data source such as a DB.  
    init(node: Node, in context: Context) throws {
        id = try node.extract("id")
        name = try node.extract("name")
        color = try node.extract("color")
        //We are making this underscored because that's how we normally name attributes in a database table
        milesDriven = try node.extract("miles_driven")
    }
    
    //makeNode makes sure that data can be saved into the given database (this is made super dynamic)
    func makeNode(context: Context) throws -> Node {
        return try Node(node: [
            "id": id,
            "name": name,
            "color": color,
            //We are making this underscored because that's how we normally name attributes in a database table
            "miles_driven": milesDriven
        ])
    }
}

//This is Vapor way of making migrations, leave them empty for now. We will add it later
extension Car: Preparation {
    static func prepare(_ database: Database) throws {
        //
    }
    
    static func revert(_ database: Database) throws {
        //
    }
}
```
So now our model should be ready for some cool controller action. Please now open our ```CarController.swift``` and add the following code:

```swift
import Vapor
//Import HTTP for getting all our response types, codes, etc..
import HTTP

//Subclass our Controller from ResourceRepresentable
final class CarController: ResourceRepresentable {
    
    //This will get called if the index in 'makeResource()' below will be called.
    func index(request: Request) throws -> ResponseRepresentable {
        
        //Create static object
        let car = Car(name: "Fiat", color: "SpaceGrey", milesDriven: 1000)
        return try car.converted(to: JSON.self)
    }
    
    //This is the function the figure out what method that should be called depending on the HTTP request type. We will here start with the get.
    func makeResource() -> Resource<Car> {
        return Resource(
            index: index
        )
    }
}
```
This is how some of the simplest controllers will look in Vapor. Now let's try to see how we will use them in our 'DropLet'.

### 5. Grouped routes and Controller bindings

Are you ready to see some magic? Ok, now open the ```main.swift``` let's start by doing some house cleaning, delete the following lines from the file:

```swift
drop.get { req in
    return try drop.view.make("welcome", [
    	"message": drop.localization[req.lang, "welcome", "title"]
    ])
}

drop.resource("posts", PostController())
```

and add the following lines of code:

```swift
//Creating a route group, in this way you won't have to add the same slugs over and over again
drop.group("api") { api in
    //Adding a sub slug to our URL and redirecting all requests to the CarController we just build..
    api.resource("cars", CarController())
}
```

Now try to open your browser and run ```http://0.0.0.0:8080/api/cars``` you should now see:

```javascript
{
	color: "SpaceGrey",
	id: null,
	milesDriven: 1000,
	name: "Fiat"
}
```
The id will still be null because the object wasn't instanciet from the db.

### 6. Adding some more magic

Ok cool, let's make our API actually holds some data (remember this will only be held until you have run the project again. Open your ```CarController.swift``` file and update the code to this:

```swift
import Vapor
import HTTP

final class CarController: ResourceRepresentable {
    
    //Adding our session container object
    var cars:[Car] = []
    
    func index(request: Request) throws -> ResponseRepresentable {
        
        //Update method to return the container object instead of the static object
        return try JSON(node: cars)
    }

    //This is where the 'post' request gets redirected to
    func create(request: Request) throws -> ResponseRepresentable {
        
        //Guard statement to make sure we are validating the data correct (we of course should also later guard for the color etc)
        guard let name = request.data["name"]?.string else {
            //Throw a Abort response, I like using the custom status to make sure the frontends have the correct message and response code
            throw Abort.custom(status: Status.preconditionFailed, message: "Missing name")
        }
        
        //Create a car
        let car = Car(name: name, color: "Red", milesDriven: 0)
        //Add it to our container object
        cars.append(car)
        //Return the newly created car
        return try car.converted(to: JSON.self)
    }
    
    //Add the store: create to tell Vapor that if a 'post' http requst comes in to redirect it there.
    func makeResource() -> Resource<Car> {
        return Resource(
            index: index,
            store: create
        )
    } 
}
```
Now Run your Xcode project again. If you start by opening your browser at our 'get' endpoint ```http://0.0.0.0:8080/api/cars``` for the cars then you will ofc be able to see that it's returning an empty array.

So let's now try to make a post request to our 'post endpoint' which is basically the same slug ```http://0.0.0.0:8080/api/cars``` (you can use whatever API testing tool, I normally use [Postman](https://www.getpostman.com/). If you don't have any tools like that then just use this cURL:

```jconsole
curl -H "Content-Type: application/json" -X POST -d '{}' http://0.0.0.0:8080/api/cars
```

This should return our error response (response code 412):
```javascript
{"error":true,"message":"Missing name"}
```

Let's now add our name param to the cURL:

```jconsole
curl -H "Content-Type: application/json" -X POST -d '{"name":"Fiat"}' http://0.0.0.0:8080/api/cars
```

And voila! we have stored our first (only in session object (and should ofc see our stored car object as JSON response). Try running the curl (or postman action) a couple of times with different names, and then run the 'get' in the browser.

```javascript
[
	{
		color: "Red",
		id: null,
		milesDriven: 0,
		name: "Fiat"
	},
	{
		color: "Red",
		id: null,
		milesDriven: 0,
		name: "Tesla"
	},
	{
		color: "Red",
		id: null,
		milesDriven: 0,
		name: "BMW"
	}
]
```

### What's next

So as you could see it's pretty easy to get up running with Vapor and basic stuff. In the next blog post, I will add on a MySQL database and show how you CRUD objects. (If you have followed this tutorial then it's only a small amount of lines of code that needs to be added). Sign up to the blog to make sure you get the latest tutorials and tech posts from our engineering team.
