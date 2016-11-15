---
title: Adding MySQL to your Vapor project
date: 2016-11-08 21:31:21
tags: vapor,mysql
authorId: olha
categories:
- Vapor
---

In this tutorial we will walk through how to add a database layer to a [Vapor](vapor.codes) project. We will be using MySQL and will assume that you have set it up on your local machine [(guide here)](https://dev.mysql.com/doc/refman/5.6/en/osx-installation-pkg.html).

We are continuing on our 'Car' project. You don't necacery have to have read that tutorial if you already are a Vapor rock star. If not then please find it [here](https://engineering.nodesagency.com/articles/Vapor/6-simple-steps-to-setup-vapor/).

### 1. Adding the MySQL package

Open your Vapor project and open the `Package.swift` file and add the extra dependecy under the main vapor dependency:

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
Now open your terminal (make sure you are cd into the project) and run `vapor build --mysql` and after that `vapor xcode --mysql`, this will make sure everything is compiled correctly with Vapor and linked with MySQL on your local machine. 

You should now be able to see some of the new dependencies in the `Dependencies` folder in your project. (MySQL, VaporMySQL, FluentMySQL etc).

### 2. Setting up the DropLet to support the provider

Now open your main.swift file and add the following lines of code:

```swift
...
//Importing our new MySQL provider
import VaporMySQL

let drop = Droplet()

// Add providers. This tells Vapor that we are using the VaporMySQL provider, this will bind the data to the database and the models automaticlly down the line
try drop.addProvider(VaporMySQL.Provider.self)

//Making sure that Vapor runs our migrations / preperations for our model(s) 
drop.preparations.append(Car.self)

....

drop.run()
```
Now lets jump into our `Car.swift` file (and down in the extension of the model) add some actual Preparation code. 

```swift
extension Car: Preparation {
    static func prepare(_ database: Database) throws {
        
        //Adding our actual migration table and attributes. We are first defining the name of the database table and afterwards what attributes the table should have.
        try database.create("cars") { cars in
            cars.id()
            cars.data("name")
            cars.data("color")
            cars.int("miles_driven")
        }
    }
    
    //This makes sure it gets deleted when reverting the projects database
    static func revert(_ database: Database) throws {
        try database.delete("cars")
    }
}
```

If you now Run the project then it will compile correct but crash right after it has started. This is due to we are missing a MySQL config file. 

So now open terminal again and run:

`touch Config/mysql.json`

Open the newly added file and add the following: (Of course depending on your local MySQL settings)

```bash
{
    "host": "127.0.0.1",
    "user": "root",
    "password": "",
    "database": "drive"
}
```

If you try to Run your Xcode project now and get the following:

```bash
Failed to start preparation
Can\'t connect to MySQL server on \'127.0.0.1\' (61)
```

Then run `mysql.server start` in your terminal, this makes sure that you have MySQL running on your local machine. You will see a success message when it's up running. (You can't continue the tutorial before you have this setup)

When you have a MySQL database setup on your local machine, then try to Run the Xcode project. You should then see the following:

```bash
Preparing Car
Prepared Car
Database prepared
Server 'default' starting at 0.0.0.0:8080
```

The consol are here telling you that the model Car is getting setup in the database as a table. You will only get this message(s) the first time you Run the project where you don't have the tables setup in the database. 

And boom, we are up and running. Now check your database interface if you are using any (I'm using [SequelPro](https://www.sequelpro.com/)), you should now be able to see our Car model as a database table (cars). You will also see a table called 'fluent', this is Vapors way of keeping track of what models should be linked to what tables.

### 3. Saving and retreving our models

Ok, the fun part starts now. Open your controller `CarController.swift` and update our create function to this:

```swift
func create(request: Request) throws -> ResponseRepresentable {
        
	guard let name = request.data["name"]?.string else {
		throw Abort.custom(status: Status.preconditionFailed, message: "Missing name")
	}
        
	//Create a car object
	var car = Car(name: name, color: "Red", milesDriven: 0)
	
	//Asking the car to save itself, the Car model can do that because it's subclassed from Vapors Model 
	try car.save()
	return try car.converted(to: JSON.self)
	
}
```

Now try to run the 'post' cURL (or use Postman, still an awesome tool).

```bash
curl -H "Content-Type: application/json" -X POST -d '{"name":"Fiat"}' http://0.0.0.0:8080/api/cars
```

You should now be able to see that your first entry in a database with Vapor as been stored! Congratulations, huge day. 

Now let's return our stored data, by updating the index function to the following:

```swift
func index(request: Request) throws -> ResponseRepresentable {
        
	//So get all our car objects from the database (Of course we should in the real world add some pagination, sorting, filtering etc), we are chaining our formatter method after our query method, this automaticly converts the whole thing into JSON
	return try Car.all().makeNode().converted(to: JSON.self)
}
```

(You can also remove the `let cars:[Cars] = []` session property if you have that in from earlier tutorial)

Now try to run the 'get' endpoint in your browser (or Postman, or cURL, etc). `http://0.0.0.0:8080/api/cars`

And voila!, you should now see a JSON response of objects from the database.

```bash
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