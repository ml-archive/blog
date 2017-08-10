---
title: Backend
date: 2017-08-09 12:55:11
layout: stack
---
The separation of software systems into front- and backends simplifies development and separates maintenance. A rule of thumb is that the front (or "client") side is any component manipulated by the user. The server-side (or "backend") code resides on the server.

### Product
Backend developers at Nodes build APIs with documentation and admin panels/CMS.

### Tasks
- Setting up and maintaining unit- and integration tests
- Architecting databases, setting up relations and handling migrations
- Building custom APIs for mobile applications and websites
- Building admin panels for admins to manage their app
- Integrating with third-party services
- Integrating with client's internal APIs

## Stack
Since the beginning of 2017, all new backend projects has been made using [Vapor](https://vapor.codes/). We still maintain legacy projects in PHP.

### Vapor
#### Vapor Cloud
We deploy our projects to [Vapor Cloud](https://vapor.cloud/). Vapor Cloud is a PaaS built on top of AWS (using Linux machines) which allows us to deploy and run our Vapor projects with ease.

#### MySQL
We are using [MySQL](https://www.mysql.com/) as a persistent database for all of our projects. MySQL is a battle-tested relational DBMS with a big set of features.

#### Vapor
Vapor is a web framework written in [Swift](https://swift.org/) for Swift. The framework ships with a rich component set, including its own webserver.


### PHP
Our PHP projects are running on a LAMP stack.

#### [L]inux, [A]pache
Info about Linux and Apache can be found [here](https://engineering.nodesagency.com/our-stacks/operations/).

#### [M]ySQL
We are using [MySQL](https://www.mysql.com/) as a persistent database for all of our projects. MySQL is a battle-tested relational DBMS with a big set of features.

#### [P]HP
We have been developing in PHP since 2010 and like the language for its rapid and easy flow
We have missed the strictness you see in other languages, for bigger projects. But now with PHP 7 it's starting to be much better

#### Framework - [Laravel](https://laravel.com/)
Today almost no one writes web applications in pure PHP. At Nodes we use [Laravel](https://laravel.com/) and are extremely happy with it. It's very easy to get started with and much more object-oriented than competitors (at that time at least) 
Laravel also has a massive community which brings a lot of really good open source projects and rapid bug fixes.
Laravel is also the biggest PHP framework today, which is never a bad thing!

Nodes was using [CakePHP](http://cakephp.org/) until 2013 where we moved to [Laravel](https://laravel.com/), since we felt Cake was not moving fast enough.  

### More stack
- [Elastic search](https://www.elastic.co/) - For some projects MySQL is not good enough for advanced queries
- [Redis](http://redis.io/) - Used for caching and sessions 
- [MongoDB](https://www.mongodb.com/) - In few cases, mostly for big data sets where the pipeline aggregation is needed
- [S3](https://aws.amazon.com/documentation/s3/) - Storage
- [CloudFront](https://aws.amazon.com/cloudfront/) - CDN, with our own image scaling system in front `(?w=100&h=100)`
- [ImgIX](https://http://imgix.com/) - CDN with image scaling/optimization 
- [Bugsnag](https://bugsnag.com/) - A tool for collecting errors in production 

### Libraries
#### Vapor
Most of the libraries we use are either provided by Vapor (see [Vapor's GitHub organization](https://github.com/vapor) for a list) or made internally at Nodes (see [Nodes-Vapor GitHub organization](https://github.com/orgs/nodes-vapor/) for a list).

- [Jobs](https://github.com/BrettRToomey/Jobs) - A minimalistic job system in Swift, for Swift
- [Brett XML](https://github.com/BrettRToomey/brett-xml) - A pure Swift XML parser that's compatible with Vapor's node data structure

#### PHP
- [PHP unit](https://phpunit.de/) - Unit testing
- [Dingo](https://github.com/dingo/api) - Build awesome APIs easier for Laravel
- [Ide helper](https://github.com/barryvdh/laravel-ide-helper) - Easy way to get `@property` attributes on models and your facades linked to the repositories. Auto complete is your friend
- [Debug](https://github.com/orchestral/debug) - A really sweet library for monitoring your SQL queries and improving performance for our apps
- [CORS](https://github.com/barryvdh/laravel-cors) - Easy CORS integration
- [Excel](https://github.com/Maatwebsite/Laravel-Excel) - Awesome library for import/export of  xls/csv files

### Open source
The backend team at Nodes has some packages we have created to ease our daily work and to contribute to the community.

#### Vapor
All of our open sourced Swift/Vapor repositories can be found on the [Nodes-Vapor GitHub organization](https://github.com/orgs/nodes-vapor/). Some examples:

- [Paginator](https://github.com/nodes-vapor/paginator) - Query pagination for Vapor and Fluent
- [Admin Panel](https://github.com/nodes-vapor/admin-panel) - Build easy customizable admin features for your app
- [Storage](https://github.com/nodes-vapor/storage) - A package to ease the use of multiple storage and CDN services

#### PHP
All of our open sourced PHP repositories can be found on the [Nodes-PHP GitHub organization](https://github.com/orgs/nodes-php/).

- [Assets](https://github.com/nodes-php/assets) - An easy integration for handling files with Laravel
- [Push](https://github.com/nodes-php/push) - A push manager to send push messages to mobile devices from your project
- [API](https://github.com/nodes-php/api) - A "mobile friendly" API package made on-top of the popular [Dingo API](https://github.com/dingo/api) package
