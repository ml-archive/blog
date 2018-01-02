---
title: Getting started with Vapor 3
date: 2018-01-02 13:00:00
tags: vapor,swift,linux,swift4,vapor3
authorIds:
- stso
categories:
- Vapor
---

Vapor has been our go-to framework when we develop backend solutions at Nodes since January 2017. A lot has happened during the past year, specially when we saw Vapor 2 got released back in May. Our overall opinion is that Vapor 2 has been a mature and a fairly feature-rich framework we've been enjoying working with. That said, there's still some room for improvement, which has made us follow the development of Vapor 3 with excitement.



As of writing this post, the latest version of the next major version of Vapor is [3.0 Beta 1](https://github.com/vapor/vapor/releases/tag/3.0.0-beta.1). Although the major version hasn't yet hit a stable version, we wanted to take aside some time to have a look at how these changes will affect our daily work. We have developed and help maintain around 25+ customer projects and 30+ open source packages so it's important for us to know the amount of changes needed in order to migrate these projects to Vapor 3.

## Our focus areas

Before diving in and setting up our first Vapor 3 project, let's reflect a bit on what we want to achieve with this research of Vapor 3. Hopefully this will guide our exploration as well as give us some way categorize our findings and compare it with Vapor 2. These are the following areas we will look into when testing out Vapor 3 for this post:

- Configuration: How do we setup providers and middlewares and how do we configure these?
- Models: How do we create a model and how do we query it?
- Routing: How do we setup routes for our project and how does these interface with our controllers?
- Views: How do we setup views for our project?
- Commands: How do we setup and run commands?

Besides looking into the above areas using a new Vapor 3 project, we will also look into what it will require to migrate an existing project to Vapor 3.

## Getting started with Vapor 3

Please note that this post is based on a beta version of the framework and things might change before we see the official release of the next major version of Vapor.

### Setting up a project

First, make sure you have the recent version of the Vapor toolbox:

```bash
brew upgrade vapor
```

And if you don't have the toolbox already installed, then run:

```bash
brew install vapor/tap/vapor
```

Also make sure you're running Swift 4 as this is now required in Vapor 3:

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

### Configuration

When looking through the files in our new project, it's already worth noticing some differences. First up, we don't have `Droplet+Setup.swift` and `Config+Setup.swift`. They are instead replaced by:

- `boot.swift`: The `boot` function is called after initialization but before it starts running, meaning that it is an ideal place for running code that should run each time the application starts. Speaking of "application", notice how the signature now calls the `Droplet` an `Application` now. The signature also implies now that there's only going to be one `Application`. 
- `configure.swift`: 
- `routes.swift`:

### Models

TODO

### Routing

TODO

### Views

TODO

### Commands

TODO

## Migrating from Vapor 2 to Vapor 3

TODO - test out project or package

## Conclusion

TODO