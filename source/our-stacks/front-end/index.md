---
title: Front-end
date: 2016-09-29 15:27:11
layout: stack
---
The front-end team at Nodes builds a variety of products using modern web technologies.
We build web apps, hybrid apps and websites using [Angular](https://www.angular.io) or [Ionic](https://www.ionicframework.com) for both our clients and for internal use, as well as the occasional email layouts. 

### Tasks
 - Writing and maintaining UI libraries for client and internal use
 - Building responsive layouts for a range of modern browsers
 - Writing business and view logic
 - Integrating with in-house or external APIs and services 
 - Working closely with our UX and Design teams

## Stack

### Languages

#### JavaScript
Most of our code is currently written in ES5, but we are looking to switch to TypeScript and ES6+. We write JavaScript both for the browsers and for our toolchains (using NodeJS).

#### CSS
All of our styling is written in Sass (scss), where we make use of the BEM syntax and SMACCS principles to keep our CSS well structured, flexible and object-oriented.

#### HTML/Templates
HTML is a given but we also use the blade templating language when working on PHP projects, and EJS/Handlebars for internal sites and email layouts.

### Frameworks of choice

#### Angular
[Angular](https://www.angularjs.org) is an open-source MV* framework for building single-page applications (SPAs). It has great features like Dependency Injection(DI), Two-way Bindings (model<-->view), Routing, Animation support built-in, Superb control over forms and much much more.
  
We have been using Angular since version 1.1 for production and have released a slew of SPAs with this framework over the years. We feel that this framework has enterprise level quality, and will continue to build our products with the latest 2.0 version.

#### Ionic
The [Ionic](https://www.ionicframework.com) framework builds on top of Angular and gives us a set of tools to build both Native Apps as well as progressive web apps (PWAs). It offers a beautiful UI and access to native features like Cameras, File systems and more through Cordova.
  
Being experienced with Angular, this framework was a natural choice for us as we were already familiar with the structures and syntax of Angular which is heavily utilized in Ionic. Through their CLI tools we can easily build apps ready to be deployed to the app stores as well as offer companion web apps sharing most of the same code base.

### IDE
Our IDE of choice is WebStorm/PHPStorm. Before we made the switch to actual IDEs (and boy are we glad we did), we used Sublime Text 2.

### Other tools
 - [Yeoman](http://yeoman.io/)* - He calls himself your friendly butler, Yeoman is a CLI scaffolding tool that is easy to extend. We use this every day to scaffold out new parts of our applications using well defined templates. 
 - [Gulp](http://gulpjs.com/)* - A task runner, we are currently working on moving all of our tasks from Grunt to Gulp because of its extensibility and tasks in parallel features.
 - [Grunt](http://gruntjs.com/)* - A task runner, Grunt in our case is currently used with our boilerplate for client products. 
 - [Webpack](https://webpack.github.io/) - An amazing module bundler.
 - [NPM](https://www.npmjs.com/)* - The defacto JavaScript package manager.
 - [Bower](http://bower.io/)* - A package manager designed for consuming client-side modules and plugins.
 - [Hexo](http://hexo.io/) - A blogging system build with NodeJS, it uses a flat-file structure much like Jekyll. 
 - [Postman](https://www.getpostman.com/) - All our internal APIs are documented by our back-end developers through Postman, an app that let's us easily discover the endpoints we need to integrate against.
 - [Zeplin](https://zeplin.io/) - Zeplin bridges the gap between developers and designers, it let's us easily extract the graphical assets as well as colours and measurements from the design deliverables. 
 - [Sass](http://sass-lang.com/) - Sass (Syntactically Awesome Stylesheets)is a scripting language that is interpreted into CSS offering loads of features such as variables, mixins, iterators, functions and nesting of selectors.
 - Browser Developer Tools
 
_*: Read more about how we use these tools, and our cli scaffolding tool - generator-nodes in the slides from a [presentation](https://docs.google.com/presentation/d/15GboYY-o9_23ekdw6ZdOpibAfMeLuk18b9ttw9C6A6A/edit?usp=sharing) we gave at an AngularJS Copenhagen Meetup, and check out the source code on [Github](https://www.github.com/nodes-frontend/generator-nodes)._
 
### Libraries
These are the 3rd party libraries we primarily use in our projects.

 - [Angular.js](https://www.angularjs.org) - Read more about Angular in the Frameworks of choice section further up on this page.
 - [Ionic](https://www.ionicframework.com) - Read more about Ionic in the Frameworks of choice section further up on this page. 
 - [Foundation for sites](https://foundation.zurb.com/sites/docs/) - Our favorite CSS framework and the perfect starter point for our client facing products, the modular structure and clean starting point makes it easy for us to go from prototypes to polished products.   
 - [Foundation for emails](https://foundation.zurb.com/emails/docs) - Building the proper markup for emails is a nightmare, but this frameworks takes out most of that hassle by providing an easy to use templating language and a set of tested UI components.
 - [Bootstrap](https://www.getbootstrap.com) - Used on internal web apps not running on Angular, this framework is well known by both our front-end and back-end teams and gives us a great starter point for working together with our coworkers on internal products.
 - [Angular Material](https://material.angularjs.org) - Used on internal web apps running on Angular, Material for Angular is a set of amazing UI components and tools for quickly scaffolding great looking web apps.
 - [ui.router](https://angular-ui.github.io/ui-router/site/) - The best routing solution for Angular.
 
### Open source
To support our daily work we maintain a range of open source libraries, ranging from Angular based UI components, to NodeJS tooling, that helps us ensure high quality products and give us battle-tested components that are easy to use. All our repositories are being maintained on [Github](https://github.com/nodes-frontend/).

 - [generator-nodes](https://www.github.com/nodes-frontend/generator-nodes) - Our opinionated Yeoman CLI, and the boilerplate for all of our Angular projects.
 - [nodes-component-starter](https://www.github.com/nodes-front-end/nodes-component-starter) - Not every project ends up being an actual product, we often build isolated UI components and small libraries to use in our projects. This is our starting point for Open Source projects and comes with Angular, Typescript, semantic-release and slew of other awesome features.
 - [nImage](https://www.github.com/nodes-frontend/nImage) - We use images, a lot. This module enhances images with (lazy-)loading, fallbacks, aspect-ratios and cropping/resizing.
 - [nExceptionHandler](https://www.github.com/nodes-frontend/nExceptionHandler) - This module helps us send errors to external sources so we can keep track of the state of our Angular apps.  
 - [nMessages](https://www.github.com/nodes-frontend/) - Just like images, we often need to provide feedback messages for our end users when asyncronous tasks takes place. This UI component lets us easliy create toasts or any other kind of messages by providing a manageable LIFO que and the UI to go along. 
 - [The setup behind this blog](https://www.github.com/nodesagency/blog) - Built with Hexo, this repository should be interesting for anyone looking for an advanced Hexo setup with lots of great front-end features such as ES6 support, Offline Sync through service-workers, and a lot of preconfigured Hexo speciffic settings.
 - And much more

### Community Involvement
Our team is very engaged in the Angular community in Copenhagen (and the rest of the world). We help organize and run the [AngularJS CPH meetup group](https://www.meetup.com/AngularJS-Copenhagen/) as well as international meetups and soon also conferences.