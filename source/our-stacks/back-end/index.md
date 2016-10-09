---
title: Backend
date: 2016-09-29 15:27:11
layout: stack
---

#Backend
The separation of software systems into front and back ends simplifies development and separates maintenance. A rule of thumb is that the front (or "client") side is any component manipulated by the user. The server-side (or "back end") code resides on the server.

###Product
Backend developers in Nodes build APIs with documentation & Admin panels / CMS 

###Tasks
 - Writing tests, all backend development is TDD, we write a lot of tests!
 - Architecting databases, setting up relations, handling migrations
 - Building custom APIs for mobile applications & web sites
 - Building Backends for admins to manage their app
 - Integrating with a bunch of services
 - Integrating with client's internal APIs

###IDE
PHP Storm is the preferred IDE

###Other tools
 - Terminal is heavily used during the day
 - phpMyAdmin or Sequel pro is used for quick access to MySQL
 - [Postman](https://www.getpostman.com/) All our APIs are documented through Postman. It is the perfect tool for big teams to work together on APIs

## Stack

Currently we are only working with one backend stack, which is a classic LAMP stack with some sugar.
(Soon [Vapor](https://vapor.codes/) will be part of our client stack)

### [L]inux
### [A]pache
### [M]ySQL
### [P]HP

Linux & Apache more info [Here](https://engineering.nodesagency.com/our-stacks/operations/)

### MySQL

We are using MySQL as a persistent database for all of our projects. 

### PHP 

We have been developing in PHP since 2010 and like the language for it's rapid and easy flow
We have missed the strictness you see from other languages, for bigger projects. But now with PHP 7 it's starting to be much better

### Framework - [Laravel](https://laravel.com/)

Today, there is almost no one who is writing web applications in pure PHP.
In Nodes we use [Laravel](https://laravel.com/) and are extremely happy with it. Very easy to get started with. Much more object oriented than competitors (at that time at least) 
Massive community which brings a lot of really good open source projects and rapid bug fixes.
Laravel is also the biggest PHP framework today, which is never a bad thing!
 
Nodes was using [CakePHP](http://cakephp.org/) until 2013 where we moved to [Laravel](https://laravel.com/), since we felt Cake was not moving fast enough.  

### More stack
 - [Elastic search](https://www.elastic.co/) - For some projects MySQL is not good enough for advanced queries
 - [Redis](http://redis.io/) - Used for caching & and sessions 
 - [MongoDB](https://www.mongodb.com/) - In few cases, mostly for big data sets where the pipeline aggregation is needed
 - [S3](https://aws.amazon.com/documentation/s3/) - Storage
 - [CloudFront](https://aws.amazon.com/cloudfront/) - CDN, with our own image scaling system in front (?w=100&h=100)
 - [ImgIX](https://http://imgix.com/) - CDN with image scaling / optimization 
 - [Bugsnag](https://bugsnag.com/) - A tool for collecting errors in production 

### Libraries
 - [PHP unit](https://phpunit.de/) - Unit testing
 - [Dingo](https://github.com/dingo/api) - Build awesome APIs easier for Laravel
 - [Ide helper](https://github.com/barryvdh/laravel-ide-helper) - Easy way to get @property attributes on models and your facades linked to the repositories. Auto complete is your friend
 - [Debug](https://github.com/orchestral/debug) - A really sweet library for monitoring you SQL queries and improving performance for our apps
 - [Cors](https://github.com/barryvdh/laravel-cors) - Easy CORS integration
 - [Excel](https://github.com/Maatwebsite/Laravel-Excel) - Awesome library for import/export xls/csv files
 
### Open source
The backend team in Nodes has some packages we have created to ease our daily work. We don't want to spend time on building the same thing over and over. And it's boring!
[Nodes-PHP](https://github.com/orgs/nodes-php/)

 - Backend
 - API
 - Assets
 - Push
 - Cache
 - Counter cache
 - API Scaffolding
