---
title: Vapor code generation with Sourcery
date: 2017-12-20 13:00:00
tags: vapor,swift,linux,sourcery,swift4,metaprogramming
authorIds:
- brto
- stso
categories:
- Vapor
---

Swift is a relatively new language in the server realm that brings a lot of nice changes, such as type safety and compilation. But it's not all sunshine and rainbows. Swift's poor metaprogramming can introduce a huge amount of boilerplate into Swift projects, including Vapor projects. 

## Creating a model in Vapor without Sourcery

For some context, let's take a look at a typical model.

```swift
internal final class User: Model, Timestampable, SoftDeletable {
    internal enum Keys {
        static let email = "email"
        static let name = "name"
        static let password = "password"
        static let passwordRepeat = "passwordRepeat"
        static let companyId = "companyId"
    }

    internal let storage = Storage()

    internal var email: String
    internal var name: String?
    internal var password: String
    internal var companyId: Identifier

    internal init(
        email: String,
        name: String?,
        password: String,
        companyId: Identifier
    ) {
        self.email = email
        self.name = name
        self.password = password
        self.companyId = companyId
    }

    internal init(row: Row) throws {
        name = try row.get(Keys.name)
        email = try row.get(Keys.email)
        password = try row.get(Keys.password)
        companyId = try row.get(Keys.companyId)
    }
}

extension User: JSONRepresentable {
    internal enum JSONKeys {
        static let name = Keys.name
        static let email = Keys.email
        static let companyId = Keys.companyId
    }

    internal func makeJSON() throws -> JSON {
        var json = JSON()
        try json.set(idKey, id)
        try json.set(JSONKeys.name, name)
        try json.set(JSONKeys.email, email)
        try json.set(JSONKeys.companyId, companyId)
        return json
    }
}

extension User: NodeRepresentable {
    internal func makeNode(in context: Context?) throws -> Node {
        var node = Node([:])
        try node.set(idKey, id)
        try node.set(Keys.name, name)
        try node.set(Keys.email, email)
        try node.set(Keys.companyId, companyId)
        try node.set(User.createdAtKey, createdAt)
        try node.set(User.updatedAtKey, updatedAt)
        try node.set("company", company.get())
        return node
    }
}

extension User: Preparation {
    internal static func prepare(_ database: Database) throws {
        try database.create(self) { user in
            user.id()
            user.string(Keys.email, unique: true)
            user.string(Keys.name, optional: true)
            user.string(Keys.password)
            user.string(Keys.companyId)
        }


        try database.index(Keys.email, for: User.self)
        try database.index(Keys.companyId, for: User.self)
    }

    internal static func revert(_ database: Database) throws {
        try database.delete(self)
    }
}

extension User {
    internal func makeRow() throws -> Row {
        var row = Row()
        try row.set(Keys.email, email)
        try row.set(Keys.name, name)
        try row.set(Keys.password, password)
        try row.set(Keys.companyId, companyId)
        return row
    }
}
```

As you can see, it's quite a bit of code. The `makeRow` and `init(row:)` are for serialization and deserialization of database entries, `makeJSON` is for JSON serialization, `makeNode(context:)` is for legacy libraries and rendering views and finally, `prepare(database:)` and `revert(database:)` are for setting up and tearing down the database schema. This is the minimum amount of boilerplate required in most cases, but there are many cases where you can conform to more protocols.

After spending most of our days duplicating this relatively static data, we started looking for ways to automate it. This is where [Sourcery](https://github.com/krzysztofzablocki/Sourcery) comes in.

## Sourcery
Taken from the GitHub repository:
> Sourcery is a code generator for Swift language, built on top of Apple's own SourceKit. It extends the language abstractions to allow you to generate boilerplate code automatically.

Sourcery is a tool that has been adopted well throughout the iOS and macOS community and it seemed like a natural fit for solving our challenges. Sourcery is built around the idea of "meta-programming". In short, this means that we're able to write code at a meta level where the result of executing this code will result in another program. To be more concrete, we're now able to write templates that describes what code we want to create in a generic way. When we then run Sourcery, it will generate all the concrete implementations for our project.

Let's have a look at a small example. Given this small piece of code for a model in Vapor:

```swift
final class User: Model {
    var name: String
    var age: Int?
}
```

We can then write a small template for Sourcery, e.g. by using [Stencil](http://stencil.fuller.li/en/latest/), to generate the corresponding initializer:

``` 
{% for type in types.based.Model %}
    // sourcery:inline:auto:{{ type.name }}.Models
    internal let storage = Storage()

    internal init(
        {% for var in type.storedVariables %}
        {{ var.name }}: {{ var.typeName.description }}{% if var.isOptional %} = nil{% endif %}{% if not forloop.last %},{% endif %}
        {% endfor %}
    ) {
        {% for var in type.storedVariables %}
        self.{{ var.name }} = {{ var.name }}
        {% endfor %}
    }
    // sourcery:end
{% endfor %}
```

After running Sourcery, we will then end up with an updated `User` model which now looks like this:

``` swift
final class User: Model {
    var name: String
    var age: Int?

// sourcery:inline:auto:User.Models
    internal let storage = Storage()

    internal init(
        name: String,
        age: Int? = nil
    ) {
        self.name = name
        self.age = age
    }
// sourcery:end
}
```

In this case we made Sourcery generate code inline in our existing file, but we could also have chosen to have it generate new files for us. By doing this, it becomes a bit more clear what code is generated by Sourcery and what is not (although it might not always be possible).

Armed with this amazing tool, we built a [collection of templates](https://github.com/nodes-vapor/sourcery-templates) that tries to eliminate most of Vapor's boilerplate. The overall guidelines for our templates are:

- That they should be easy to opt-in and out of.
- That it should be easy to mix and match between generated code and user-written code.
- That it should be clear what has been generated by Sourcery.
- That they should cover the common cases, but not all cases; edge cases should be solved by opting out of Sourcery for the specific case.

The templates are mostly focused around generating code for models, but they also include implementations for routes, the `LinuxMain.swift` file and more.

## Creating a model in Vapor with Sourcery

Coming back to our previous example of how to create a user model in Vapor, let's have a look at how that looks like now using our Sourcery templates. To define the previously defined model, all you need to write is the following:

  ```swift
final class User: Model, Timestampable, SoftDeletable {
    public var email: String    
    public var name: String?
    public var password: String
    public var companyId: Identifier
}
  ```

After running `sourcery` in the project directory, the templates will generate all of the boilerplate for the initializers, `RowConvertible`, `NodeRepresentable`, `JSONConvertible` and `Preparation`. The templates also include helpers for enumerations, route collections and unit testing. Most of the generated files will be created in a `Generated` folder like this:

- `App/Generated/User/User+JSONConvertible.generated.swift`
- `App/Generated/User/User+NodeRepresentable.generated.swift`
- `App/Generated/User/User+Preparation.generated.swift`
- `App/Generated/User/User+RowConvertible.generated.swift`

Making it very clear what has been generated and that those files shouldn't be manually edited. Further, the templates has a range of options when it comes to customizing the generated code. Please have a look at the [readme](https://github.com/nodes-vapor/sourcery-templates) for a full overview of the available configurations.

## Looking ahead

Templating the Vapor interfaces has some not-so-obvious advantages. For instance, when the Vapor APIs are updated we can, theoretically, update the templates and the rest of the project will get updated automatically. That being said, Vapor 3 looks like it's going to completely redefine the framework and we're not sure how realistic this is. Besides that, we have a couple of ideas for future features such as generating convenience functions for relations, generating type-safe routes and more.

Thankfully, the future of server side Swift looks promising. Swift 4 brings codeable and Vapor 3 will fully embrace it. Until Vapor 3's release and we update all of our projects, we will continue to enjoy the quality of life improvement Sourcery brings to Vapor.

