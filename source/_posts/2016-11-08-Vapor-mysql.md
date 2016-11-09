---
title: Adding MySQL to your Vapor project
date: 2016-11-08 21:31:21
tags: vapor,mysql
authorId: olha
categories:
- Vapor
---

In this tutorial we will walk through how to add a database layer to your [Vapor](vapor.codes) project. We will be using MySQL and will assume that you have set it up on your local machine [(guide here)](https://dev.mysql.com/doc/refman/5.6/en/osx-installation-pkg.html).

We are continuing on our 'Car' project in Vapor. You don't necacery have to have read that tutorial if you already are a Vapor rock star. If not then please find it here [LINK WILL COME WHEN FIRST PART IT UP]().

### 1. Adding the MySQL package

Open your Vapor project and open the ```Package.swift``` file and make sure it looks like this:

```swift
import PackageDescription

let package = Package(
    name: "Drive",
    dependencies: [
        .Package(url: "https://github.com/vapor/vapor.git", majorVersion: 1, minor: 1),
        //Package for MySQL provider for Vapor
        .Package(url: "https://github.com/vapor/mysql-provider", majorVersion: 1, minor: 0)
    ],
    exclude: [
        "Config",
        "Database",
        "Localization",
        "Public",
        "Resources",
        "Tests",
    ]
)
```
Now open your terminal (make sure you are cd into the project) and run ```vapor build --mysql``` and after that ```vapor xcode --mysql```, this will make sure everything is compiled correctly with Vapor and linked with MySQL on your local machine.

You should now be able to see some of the new dependencies in the ```Dependencies``` folder in your project. (MySQL, VaporMySQL, FluentMySQL etc).

### 2. Setting up the DropLet to support the provider

Now open your main.swift file and add the following code:

```swift
...
//Importing our new MySQL provider
import VaporMySQL

let drop = Droplet()

// Add providers
try drop.addProvider(VaporMySQL.Provider.self)

//Making sure that Vapor runs our migrations / preperations for our model(s)
drop.preparations.append(Car.self)

....

drop.run()
```
Now lets jump into our ```Car.swift``` file and update the extension from ```Preparation``` in the bottom of the file to look like the following:

```swift
//This is Vapor way of making migrations, leave them empty for now. We will add it later
extension Car: Preparation {
    static func prepare(_ database: Database) throws {
        //Adding our accual migration table and attributes
        try database.create("cars") { cars in
            cars.id()
            cars.data("name")
            cars.data("color")
            cars.data("miles_driven")
        }
    }
    
    //Making sure it gets deleted when cleaning
    static func revert(_ database: Database) throws {
        try database.delete("cars")
    }
}
```

If you now Run the project then it will compile correct but crash right after it has started. This is due to that we are missing a mysql config file.

So now open terminal again and run ```touch Config/mysql.json```, now open the newly added file and add the following: (Ofc depending on your local MySQL settings)

```javascript
{
    "host": "127.0.0.1",
    "user": "root",
    "password": "",
    "database": "drive"
}
```
Make sure you run ```mysql.server start``` either before or after these steps. (It will tell you by saying ```Failed to start preparation
connection("Can\'t connect to MySQL server on \'127.0.0.1\' (61)")``` in the console.

But after that's run and you have MySQL running then you should see this in the consol in Xcode:

```sh
Preparing Car
Prepared Car
Database prepared
Server 'default' starting at 0.0.0.0:8080
```
And boom, we are up and running. Now check your database interface if you are using any (I'm using [SequelPro](https://www.sequelpro.com/)), you should now be able to see model(s) that you have asked the droplet to prepare. ```drop.preparations.append(Car.self)``` (From our ```main.swift``` file)

### 3. Saving and retreving our models

Ok, now the fun part starts. Open your controller ```CarController.swift``` and update our create function to this:

```swift
func create(request: Request) throws -> ResponseRepresentable {
        
	guard let name = request.data["name"]?.string else {
	throw Abort.custom(status: Status.preconditionFailed, message: "Missing name")
	}
        
	//Create a car
	var car = Car(name: name, color: "Red", milesDriven: 0)
	try car.save()
	return try car.converted(to: JSON.self)
	
}
```
Now try to run the 'post' cURL (or use Postman, still an awesome tool).

```sh
curl -H "Content-Type: application/json" -X POST -d '{"name":"Fiat"}' http://0.0.0.0:8080/api/cars
```

You should now be able to see that your first entry in a database with Vapor as been stored! Congrats, huge day. 

Now let's return our stored data, by updating the index function to the following:

```swift
func index(request: Request) throws -> ResponseRepresentable {
        
	//So get all our car objects from the database (ofc we should in a real world scenario add some pagination), and convert the whole thing into JSON
	return try Car.all().makeNode().converted(to: JSON.self)
}
```

(You can also remove the ```let cars:[Cars] = []``` session property if you have that in from earlier tutorial)

Now try to run the 'get' endpoint in your browser (or Postman, or cURL, etc). ```http://0.0.0.0:8080/api/cars```

And volia!, you should now see a JSON response of objects from the database.

```javascript
[
	{
		color: "Red",
		id: 1,
		miles_driven: 0,
		name: "Fiat"
	},
	{
		color: "Red",
		id: 2,
		miles_driven: 0,
		name: "BMW"
	},
	{
		color: "Red",
		id: 3,
		miles_driven: 0,
		name: "Audi"
	}
]
```

### So what's next?

Well you now know how to create routes for controllers and work with models, you know how to store and retreive from the database. Now go explore and maybe get a job at Nodes if you mean you have the skills and what it takes.