---
title: 6 simple steps to get your first Vapor JSON response
date: 2016-11-08 12:42:00
tags: vapor,setup
authorId: olha
categories:
- Vapor
---

6 simple steps to setup your first Vapor JSON response. We will cover the initial setup and how to make both POST and GET with controllers and models. 

This tutorial will assume that you already have installed Vapor and Xcode 8 and are farmiliar with Swift 3.

### 1. Creating your project

Now open your terminal and cd into the place you want your project.

Now run

```
vapor new --ProjectName
```

Vapor will now ask you if you want to open the project. (Just go 'y')

If you get 

```
ld: library not found for -lCLibreSSL for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

Then just open terminal and run 
```vapor build --clean```, after that run a ```vapor xcode``` that should do the trick.

And hopefully you should be ready to rock and roll.

### 2. Creating a model

Open the terminal again, and run 
```touch Source/App/Models/Car.swift```

After that run ```vapor xcode``` this will make sure that you get the correct path for the model. You should now be able to see your model in the Models folder.

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
Now Run your Xcode project. You should now see this in your console in Xcode

```
No command supplied, defaulting to serve...
No preparations.
Server 'default' starting at 0.0.0.0:8080
```
Now open your browser and type in ```0.0.0.0:8080/get_a_car```, you should now have returned your first JSON feed! 

Ofc Vapor is way smarter than this. So please go ahead an delete the code you added in step 3.

### 4. Creating a Controller

Now go back to your terminal and run ```touch Sources/App/Controllers/CarController.swift``` and again ```vapor xcode```, the Controllers folder should now contain your newly created CarController.swift

Before we can make any good use of our new Controller then we have to update our ```Car.swift``` model to accutally get some of Vapors awesome magic.

So jump back into the ```Car.swift``` file and update the fill to have the following:

```
//Importing the Vapor framework to make the model support dependencies
import Vapor
//Importing Fluent which is Vapors powering of databases and tables
import Fluent

//Subclassing our Car model from 'Model' (Vapors magic model object)
final class Car: Model {
    
    //Vapor uses 'Node' as their Model id's. This is the datatype that they use to make lookup and look at the primary key in the DB's.
    var id:Node?
    
    var name:String
    var color:String
    var milesDriven:Int
    
    init(name:String, color:String, milesDriven: Int) {
        self.name = name
        self.color = color
        self.milesDriven = milesDriven
    }
    
    //Adding one of Vapors protocols to conform to the 'Model' object. This basicly makes sure that data is mapped correctly when getting extracted from a data source such as a DB.  
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

```
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

Are you ready to see some magic? Ok, now open the ```main.swift``` let's start by do some house cleaning, delete the following lines from the file:

```
drop.get { req in
    return try drop.view.make("welcome", [
    	"message": drop.localization[req.lang, "welcome", "title"]
    ])
}

drop.resource("posts", PostController())
```

and add the following lines of code:

```
//Creating a route group, in this way you won't have to add the same slugs over and over again
drop.group("api") { api in
    //Adding a sub slug to our URL and redirecting all requests to the CarController we just build..
    api.resource("cars", CarController())
}
```

Now try to open your browser and run ```http://0.0.0.0:8080/api/cars``` you should now see:

```
{
	color: "SpaceGrey",
	id: null,
	milesDriven: 1000,
	name: "Fiat"
}
```
The id will still be null because the object wasn't instanciet from the db.

### 6. Adding some more magic

Ok cool, let's make our API accutally hold some data (remember this will only be held untill you have run the project again. Open your ```CarController.swift``` file and update the code to this:

```
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
        
        //Guard statement to make sure we are validating the data correct (we ofc should also later quard for the color etc)
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

So let's now try to make a post request to our 'post endpoint' witch is basicly the same slug ```http://0.0.0.0:8080/api/cars``` (you can use whatever API testing tool, I normally uses [Postman](https://www.getpostman.com/). If you don't have any tools like that then just use this cURL:

```
curl -H "Content-Type: application/json" -X POST -d '{}' http://0.0.0.0:8080/api/cars
```

This should return our error response (response code 412):
```
{"error":true,"message":"Missing name"}
```

Let's now add our name param to the cURL:
```
curl -H "Content-Type: application/json" -X POST -d '{"name":"Fiat"}' http://0.0.0.0:8080/api/cars
```

And volia! we have stored our first (only in session object (and should ofc see our stored car object as JSON response). Try running the curl (or postman action) a couple of times with different names, and then  run the 'get' in the browser..

```json
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

So as you could see it's pretty easy to get up running with Vapor and basic stuff. In the next blog post I will add on a MySQL database and show how you CRUD objects. (If you have followed this tutorial then it's only a small amount of lines of code that needs to be added). Sign up to the blog to make sure you get the latests tutorials and tech posts from our engeniering team.
