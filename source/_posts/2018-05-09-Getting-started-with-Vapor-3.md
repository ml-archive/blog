---
title: Getting started with Vapor 3
date: 2018-05-09 13:00:00
tags: vapor,swift,linux,swift4,vapor3
authorIds:
- stso
- sikk
categories:
- Vapor
---

Vapor has been our go-to framework when we develop backend solutions at Nodes since January 2017. A lot has happened during the past year, especially when we saw Vapor 2 got released back in May. Our overall opinion is that Vapor 2 has been a mature and a fairly feature-rich framework we've enjoyed working with. That said, there is still room for improvement and therefore we have been watching the development of Vapor 3 with excitement.

A couple of days ago, [Vapor released the next major version](https://medium.com/@codevapor/vapor-3-0-0-released-8356fa619a5d) and we've been following along since the betas came out to see how the changes will affect our daily work. We have developed and help maintain around 25+ customer projects and 30+ open source packages so it's important for us to know the amount of changes needed in order to migrate these projects to Vapor 3. Some of these projects are already in the progress of being migrated and some of still to be worked on. Our progress of migrating our open source projects can be found on this [GitHub project board](https://github.com/nodes-vapor/readme/projects/2).

## Our focus areas

Before diving in and setting up our first Vapor 3 project, let's reflect a bit on what we want to achieve with this research of Vapor 3. This should guide our exploration and give us some way to categorize our findings and compare it to Vapor 2. These are the following areas we will look into when testing out Vapor 3 for this post:

- Configuration: How do we setup providers and middlewares and how do we configure these?
- Models: How do we create a model and how do we query it?
- Routing: How do we set up routes for our project and how do these interface with our controllers?
- Views: How do we set up views for our project?
- Commands: How do we set up and run commands?

## Getting started with Vapor 3

Please note that some some of the dependencies used in this post (e.g. Leaf) is based on release candidates and things might change before we see the official releases.

### Setting up a project

First, make sure you have the recent version of the Vapor toolbox:

```bash
brew upgrade vapor
```

And if you don't have the toolbox already installed, then run:

```bash
brew install vapor/tap/vapor
```

Also make sure you're running Swift 4.1 as this is now required in Vapor 3:

```bash
swift --version
```

With that in place, we can now create our Vapor 3 project. For this project, we're going to use the [`api-template`](https://github.com/vapor/api-template/tree/beta) since that has been updated for Vapor 3 (using the `beta` branch):

```bash
vapor new vapor-3-test --template=api --branch=beta
```

As always, let's make the Vapor toolbox generate our Xcode project for us:

```bash
cd vapor-3-test
vapor xcode
```

When it's done generating the project you should be able to run the project and when visiting `http://localhost:8080/hello` in your browser you should see the `Hello, world!` page.

When looking through the files in our new project, it's already worth noticing some differences. First up, we don't have `Droplet+Setup.swift` and `Config+Setup.swift`. They are instead replaced by:

- `boot.swift`: The `boot` function is called after initialization but before it starts running, meaning that it is an ideal place for running code that should run each time the application starts. Speaking of "application", notice how the signature now names the `Droplet` an `Application` now. The signature also implies now that there's only going to be one `Application`. 
- `configure.swift`: This is where you would configure and set up your application. You can basically think of this as a replacement for your old `Config+Setup.swift` file (although the way you set up is now different).
- `routes.swift`: This is where your "main" route collection is and this is where you would add individual routes or other route collections.

### Configuration

Let's go ahead and try and configure something. For this project, we'll use MySQL as this seems to be very common in Vapor projects. Let's add the MySQL package to our `Package.swift` file:

```swift
.package(url: "https://github.com/vapor/fluent-mysql.git", from: "3.0.0-rc"),
```

Don't forget to add `FluentMySQL` to the list of dependencies for the `App` target:

```swift
.target(name: "App", dependencies: ["FluentMySQL", "Vapor"]),
```

It's worth noticing that we're not adding a `mysql-provider` package. The concept still exists but `Provider`s do not come in separate packages anymore.

Replace the contents of `configure.swift` with the following to set our project up with MySQL:

```swift
import FluentMySQL
import Vapor

public func configure(
    _ config: inout Config,
    _ env: inout Environment,
    _ services: inout Services
) throws {
    // Register providers
    try services.register(FluentMySQLProvider())

    // Configure and register a MySQL database
    let config = MySQLDatabaseConfig(
        username: "vapor3",
        password: "password",
        database: "vapor3"
    )
    let mysql = MySQLDatabase(config: config)
    var databases = DatabasesConfig()
    databases.add(database: mysql, as: .mysql)
    services.register(databases)
}
```

Let's try and go through the different steps that are happening in the above code:

- We register the `FluentMySQLProvider` which takes care of setting up database connections and migrations.
- We create a `MySQLDatabaseConfig` with our MySQL connection settings.
- We create a `MySQLDatabase` using our config.
- We create a database config object and add our database to it specifying that we will identify this as the MySQL database (`as: .mysql`) and register it with the services object.

It takes a little to grasp the notion of "Services" and how you now register providers and use configurations. We are excited to see that there are **no more json configs**.

### Models

Vapor 2 has been pretty boilerplate-heavy when it comes to models. This is something we have tried to solve using Soucery as described in [this blog post](https://engineering.nodesagency.com/articles/Vapor/vapor-code-generation-with-sourcery/). We've been pretty interested in seeing how this would change with Vapor 3 since the framework is now able to leverage on the [`Codeable`](https://developer.apple.com/documentation/swift/codable) features of Swift 4.

Let's start out by creating a simple model conforming to `Codeable`:

```swift
final class Post: Codable {
    var id: Int?
    let title: String
    let body: String

    init(id: Int? = nil, title: String, body: String) {
        self.id = id
        self.title = title
        self.body = body
    }
}
```

At this point, there's nothing Vapor specific. It's great to see how we are able to keep our raw models independent of the framework and instead use extensions to add the Vapor specific functionality. To make our `Post` a `MySQLModel` do:

```swift
import FluentMySQL

extension Post: MySQLModel {}
```

That's it! For brevity, you can simply conform your model to `MySQLModel` directly since it inherits `Codable`.

#### Migrations

```swift
extension Post: Migration {}
```

That's pretty much it. Using `Codable` Vapor is now able to convert your Swift types into database field types. To make sure your migration is being run you'll have to register a migration configuration in your `configure.swift`:

```swift
var migrations = MigrationConfig()
migrations.add(model: Post.self, database: .mysql)
services.register(migrations)
```

This will obviously not be a solution to all cases, and most of the time you will probably have specific requirements for your database fields. One example could be to lower the length of your `VARCHAR` since a `String` in Swift will be turned into a 255 characters long VARCHAR, which might not be what you want if you want [to support emojis](https://github.com/nodes-vapor/readme/blob/master/Documentation/how-to-support-emojis.md). To handle your migration manually, you can instead specify the `prepare` function yourself:

```swift
import Vapor

extension Post: Migration {
    static func prepare(on connection: MySQLConnection) -> Future<Void> {
        return MySQLDatabase.create(self, on: connection) { builder in
            try builder.field(type: Int.mySQLColumnDefinition, for: \.id, isIdentifier: true)
            try builder.field(for: \.title)
            builder.field(type: .varChar(length: 191), for: \.body)
        }
    }
}
```

Notice how we're using Swift 4's typesafe KeyPath syntax (`\.`) for referring to our `Post`'s properties. We can omit the type (so not `\Post.id`) because `builder` is already aware of our model type.
Another thing to mention here is that we have to specify that the `id` field is an identifier. Because there is no variant of the `field` function that accepts only `KeyPath` and `isIdentifier` we also have to specify the column type (ie. `Int.mySQLColumnDefinition`).

### Routing

Let's go through some of common use cases for dealing with a `Model`:

- Retrieving all instances of a model.
- Retrieving one specific instance of a model using a unique identifier.
- Creating a new instance of a model.
- Updating an instance of a model.
- Deleting an instance of a model.

Before we can begin creating these routes we need a router so let's add the following to the `configure` function in `configure.swift`:

```swift
// Register router and routes
let router = EngineRouter.default()
try routes(router)
services.register(router, as: Router.self)
```

After creating the router we pass it into the `routes` function defined in `routes.swift` before finally registering it with the services object.

Replace the contents of `routes.swift` with:

```swift
import Vapor

func routes(_ router: Router) throws {
    let postsGroup = router.grouped("posts")
    let postController = PostController()

}
```

For now, let's just create an empty controller:

```swift
final class PostController {

}
```

We'll want to be able to return (arrays of) `Post` instances in our routes. Conform your model to `Content` to enable this:

```swift
extension Post: Content {}
```

> The default encoding for `Content` is JSON. This is due to the fact that `defaultMediaType` for Content is set to `.json`:
> ```swift
> public static var defaultMediaType: MediaType {
>     return .json
> }
> ```

Lastly, we'll want to make our `Post` model conform to `Parameter` so that it can be used as a type-safe parameter for our routes. Go ahead and add this to `Post.swift`:

```swift
extension Post: Parameter {}
```

#### Retrieving all instances

To return all posts created (e.g. by requesting `GET /posts`), we're going to query them like this in our `PostController`:

```swift
func all(req: Request) throws -> Future<[Post]> {
    return Post.query(on: req).all()
}
```

To link it up to our route group we add the following to our `routes` function:

```swift
postsGroup.get(use: postController.all)
```

There's a couple of things to notice in the first snippet when we compare it to Vapor 2. 

First is that we're passing the `Request` to the `query` function. This is because `Request` is a (`Container`)[https://docs.vapor.codes/3.0/concepts/services/#container] which has access to the registered services, including the database. This makes it very explicit for who is responsible for performing the lookup. Without having tried it yet, this should help us make tests as well since we should potentially be able mock the database connection and instead of hitting a database, we could return in-memory objects created in our tests.

Next, there's the return type which is now `Future<[Post]>` instead of `[Post]` as you might have expected coming from Vapor 2. [Async, Streams, Futures and Reactive Programming](https://docs.vapor.codes/3.0/async/getting-started/) are central topics in Vapor 3 in order to increase the performance of the framework due to their non-blocking nature and it will change the way we work. Without going too much into details, one way of thinking of the concepts could be:

- Futures: Values that at some point in time will exist. The future part is a wrapper that allows us to continue the work we want to do when the value arrives.
- Streams: If a future produces one value when it's done executing, a stream can return an endless number of values. Think of it as generally always running which might produce values once in a while.
- Reactive Programming: Related to futures and streams are reactive programming. It's a pattern for dealing with these types of data, usually using functional programming. You can think of it as a way of transforming or dealing with data when it comes in through a future or a stream.

If you've worked with any of the reactive programming frameworks, these concepts introduced in Vapor 3 should be familiar.

#### Retrieving one specific instance

To return one specific post (e.g. by requesting `GET /posts/:id`), we're going to request that instance like this:

```swift
func specific(req: Request) throws -> Future<Post> {
    return try req.parameters.next(Post.self)
}
```

This is very similar to what we've used to in Vapor 2 with the exception that fetching a parameter from the request now returns a `Future`.

The accompanying entry in `routes.swift` looks like this:

```swift
postsGroup.get(Post.parameter, use: postController.specific)
```

#### Creating a new instance

To create a new post (e.g. by requesting `POST /posts`), we're going to do it like this:

```swift
func create(req: Request) throws -> Future<Post> {
    return try req.content.decode(Post.self).save(on: req)
}
```

A couple of things have changed here. In Vapor 2 you might have used `req.data`, `req.form` or `req.json` for retrieving the body of a request, but in Vapor 3 this is now contained in a `ContentContainer` on the request. Next we can use `decode` to transform the body into the expected type using the `Decodable` protocol from Swift 4. Remember that our `Post` model conforms to `Codable` in order for this to work.

The POST route can be added as follows:

```swift
postsGroup.post(use: postController.create)
```

#### Updating an instance

To update an existing post (e.g. by requesting `PATCH /posts/:id`), we're going to do it like this:

```swift
func update(req: Request) throws -> Future<Post> {
    let post = try req.parameter(Post.self)
    let content = try req.content.decode(Post.self)

    return flatMap(to: Post.self, post, content) { (post, content) in
        post.title = content.title
        post.body = content.body

        return post.save(on: req)
    }
}
```

You could choose to do something similar to the code snippet for creating an instance, since Vapor will update the instance if the payload contains an `id` field. For this example, we've chosen to make it more explicit what is going on in the update process. In the above code, we're fetching the post that was specified in the request, we're decoding the post model that was giving in the body of the request and last we're updating the currently saved post. Note how we're using a static variant of `flatMap` that takes in two futures. We need this variant since getting the `Post` from the parameter and decoding the `Post` from request content both returns futures and we want to do a transformation once their values has arrived. Finally we use a `flatMap` since we are returning a `Future` in the closure when calling `save`.

#### Deleting an instance

To delete an existing post (e.g. by requesting `DELETE /posts/:id`), we're going to do it like this:

```swift
func delete(req: Request) throws -> Future<HTTPResponse> {
    let post = try req.parameters.next(Post.self)
    return post.flatMap(to: HTTPResponse.self) { post in
        return post.delete(on: req).transform(to: HTTPResponse(status: .ok))
    }
}
```

The above code is very similar to how we deal with updating a post, with the difference being that instead of returning the updated post, we're returning a `HTTPResponse` with the HTTP code 200.

### Views

In order to render views using Leaf, we need to pull in the dependency. Go ahead and update `Package.swift` by adding the following:

```swift
.package(url: "https://github.com/vapor/leaf.git", from: "3.0.0-rc"),
```

Next, register the provider in `configure.swift`:

```swift
try services.register(LeafProvider())
```

#### Rendering a view

To render a simple a view, try and add a file called `hello.leaf` to your `Resources/Views` folder with the following content:

```html
Hello #(name)
```

To render this template file, we will have to do the folowing:

```swift
func renderHello(_ req: Request) throws -> Future<View> {
    let leaf = try req.make(LeafRenderer.self)
    let context: [String: String] = ["name": "VaporMan"]
    return leaf.render("hello", context)
}
```

Opening the route in your browser should output `Hello VaporMan`.

#### Rendering a view with persisted data

Most of the time you need to fetch something from the database using Fluent and then render a view using that data. Earlier we looked at how we can fetch and return a `Post` in a JSON format by doing:

```swift
func specific(req: Request) throws -> Future<Post> {
    return try req.parameters.next(Post.self)
}
```

Now let's have a look at how we can render a view displaying a single post. First thing is to create a new leaf file with the content:

```html
<h1>#(title)</h1>
<p>#(body)</p>
```

The file will simply output the title and the body of the blog post. The function for rendering the view looks like this:

```swift
func renderSpecific(req: Request) throws -> Future<Post> {
    return try req.parameters.next(Post.self)
        .flatMap(to: View.self) { post in
            return try req.make(LeafRenderer.self).render("post", post)
    }
}
```

Instead of returning the `Post` directly as in the previous function, this one transforms it to a `View` using `flatMap` since rendering a view returns another `Future`.

### Commands

Creating a command is fairly simple and a bit more structured than in Vapor 2. For this example, let's have a look at how we can make a command that seeds a post. For a command, there's basically four parts you need to consider:

- Arguments: Required input for the command.
- Options: Optional input for the command.
- Help: Text to aid the user in how to use the command.
- Body: The actual work we want to perform when running the command.

Let's start by creating a simple command and make it comform to `Command`:

```swift
public struct PostCommand: Command {

}
```

#### Arguments

To satisfy the conformance to `Command`, the first step would be to supply the available arguments for our command. Remember, that this list of commands are required in order to run the command. Go ahead and add the following to your `PostCommand`:

```swift
public var arguments: [CommandArgument] {
    return [.argument(name: "title", help: ["Title of the post"])]
}
```

This will make our `PostCommand` require a title to be passed in every time the command is run.

#### Options

Options are very similar to arguments:

```swift
public var options: [CommandOption] {
    return [
        .value(name: "body", short: "b", default: "This is a seeded post", help: ["Change post's body"]),
    ]
}
```

Options are optional and the command will run without these options being defined. 

#### Help

We also need to supply a help message to describe what our command does, this is done like this:

```swift
public var help: [String] {
    return ["Seeds a post."]
}
```

This help text will be included when running our command with `--help`.

#### Command body

The last step is to provide the actual work we want to perform in our command. For this simple command, we will simply create a `Post` based on the input:

```swift
public func run(using context: CommandContext) throws -> Future<Void> {
    let title = try context.argument("title")
    let body = context.options["body"] ?? "Seeded post"

    return context.container.withNewConnection(to: .mysql) { db in
        let post = Post(title: title, body: body)
        return post.save(on: db).transform(to: ())
    }
}
```

Let's walk through the steps we take in the above snippet:

- We pull out `title` from the arguments. Since arguments are required, we don't have to unwrap the value.
- We pull out the `body` option from the dictionary of options and supply a fallback. Another approach would be to do `try context.requireOption("body")` since there's already a fallback defined in the option. However doing this would mean that we would need to always pass in the option flag (in this case `-b`) but we can omit the value for the option if we want to. A way to think of it is to consider the value of the option to be optional, and not the existence of the option.
- Lastly we connect to our MySQL database and we create and save the post.

#### Running our command

With the command in place, the last thing to do is to register it in our `configure.swift`:

```swift
// Commands
var commandConfig = CommandConfig.default()
commandConfig.use(PostCommand(), as: "post-seeder")
services.register(commandConfig)
```

We can now run our command:

- `swift run Run post-seeder --help`: Outputs the help text
- `swift run Run post-seeder "My post"`: Creates a post using the title and the default body. The body will be the one defined in `run`.
- `swift run Run post-seeder "My post" -b`: Creates a post using the title and the default body. The body will be the one defined in the option.
- `swift run Run post-seeder "My post" -b "My body"`: Creates a post using the title and body.

## Conclusion

Having worked with Vapor 3 for a couple of weeks we think that Vapor has come a long way. There's a steeper learning curve to the framework compared to older versions of the framework mostly due to the async principles adopted in Vapor 3. However, once you get past that, then the framework feels more mature and more fun to use compared to older versions. One example is the fact that using `Codable` heavily reduces boilerplate and introduces some more safety in your code. Overall we're excited about this major version and we can't wait to migrate all of our packages and work on more projects using this new version.
