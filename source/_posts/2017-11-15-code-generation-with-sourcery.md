---
title: Getting stack traces in Swift on Linux
date: 2017-11-15 13:00:00
tags: vapor,swift,linux,sourcery,swift4
authorIds:
- brto
categories:
- Vapor
---

Swift is a relatively new language in the server realm that brings a lot of nice changes. Such as type safety and compilation. But it's not all sunshine and rainbows. Swift's poor metaprogramming introduces a huge amount of boilerplate into Vapor projects. For some context, let's take a look at a typical model.

```swift
final class AppUser: Model, Timestampable, SoftDeletable {
    struct Keys {
        static let email = "email"
        static let name = "name"
        static let password = "password"
        static let passwordRepeat = "passwordRepeat"
        static let companyId = "companyId"
    }
    
    public let storage = Storage()
    
    public var email: String
    public var name: String?
    public var password: String
    public var companyId: Identifier
    
    public init(
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

    public init(row: Row) throws {
        name = try row.get(Keys.name)
        email = try row.get(Keys.email)
        password = try row.get(Keys.password)
        companyId = try row.get(Keys.companyId)
    }
  
    internal enum JSONKeys: String {
        case name
        case email
        case companyId
    }
}

extension AppUser: JSONRepresentable {
    public func makeJSON() throws -> JSON {
        var json = JSON()
        try json.set(idKey, id)
        try json.set(JSONKeys.name.rawValue, name)
        try json.set(JSONKeys.email.rawValue, email)
        try json.set(JSONKeys.companyId.rawValue, companyId)
        return json
    }
}

extension AppUser: NodeRepresentable {
    public func makeNode(in context: Context?) throws -> Node {
        var node = Node([:])
        try node.set(idKey, id)
        try node.set(Keys.name, name)
        try node.set(Keys.email, email)
        try node.set(Keys.companyId, companyId)
        try node.set(AppUser.createdAtKey, createdAt)
        try node.set(AppUser.updatedAtKey, updatedAt)
        try node.set("company", company.get())
        return node
    }
}

extension AppUser: Preparation {
    public static func prepare(_ database: Database) throws {
        try database.create(self) { user in
            user.id()
            user.string(Keys.email, unique: true)
            user.string(Keys.name, optional: true)
            user.string(Keys.password)
            user.string(Keys.companyId)
        }
        
        
        try database.index("email", for: AppUser.self)
        try database.index(Keys.companyId, for: AppUser.self)
    }
    
    public static func revert(_ database: Database) throws {
        try database.delete(self)
    }
}

extension AppUser {
    public func makeRow() throws -> Row {
        var row = Row()
        try row.set(Keys.email, email)
        try row.set(Keys.name, name)
        try row.set(Keys.password, password)
        try row.set(Keys.companyId, companyId)
        return row
    }
}
```

As you can see, it's quite a bit of code. Sadly, it doesn't get much better from here. The more Vapor features you opt-in to the more boilerplate you're going to have to write. At Nodes, we noticed that most of our day was spent writing boilerplate and we began to search for solutions. After doing some research, we ended up going with [Sourcery](https://github.com/krzysztofzablocki/Sourcery).

## Sourcery
Taken from the GitHub repository:
> Sourcery is a code generator for Swift language, built on top of Apple's own SourceKit. It extends the language abstractions to allow you to generate boilerplate code automatically.

Just give Sourcery a few templates using the [Stencil](https://github.com/kylef/Stencil) template language and it'll solve all your problems.

Armed with this amazing tool, we built a collection of templates that eliminate virtually all of Vapor's boilerplate. The overall guidelines for our templates are that they should be easy to opt-in and out of, easy to mix and match between generated code and user-wrote code and they should cover the common cases, but not all cases; edge cases should be solved by opting out of Sourcery for the specific case. An example of what our templates provide is model generation. To define the previously defined model, all you need to write is the following:
  ```swift
final class AppUser: Model, Timestampable, SoftDeletable {
    public var email: String    
    public var name: String?
    public var password: String
    public var companyId: Identifier
}
```

and then run `sourcery` in the project directory. The templates will generate all of the boilerplate for the initializers, `RowConvertible`, `NodeRepresentable`, `JSONConvertible` and `Preparation`. The templates also include helpers for enumerations, route collections and unit testing. If you're curious, you can learn more about them [here](https://github.com/nodes-vapor/sourcery-templates).

Templating the Vapor interfaces has some not-so-obvious advantages. For instance, when the Vapor APIs are updated we can, theoretically, update the templates and the rest of the project will get updated automatically. That being said, Vapor 3 looks like it's going to completely redefine the framework and we're not sure how realistic this is.

Thankfully, the future of server side Swift looks promising. Swift 4 brings codeable and Vapor 3 will fully embrace it. Until Vapor 3's release and we update all of our projects, we will continue to enjoy the quality of life improvement Sourcery brings to Vapor.