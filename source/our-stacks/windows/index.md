---
title: Windows
date: 2017-09-04 17:37:40
layout: stack
---
Windows developers at Nodes build awesome user-centric apps using Microsoft's Fluent Design System which are distributed on the Microsoft Store publicly or through specific distribution channels. 
<!--we havn't actually used fluent design yet, but it's something we should do for any future project... alternatively I can just say microsoft's design language-->
Using UWP (Universal Windows Platform) we can deliver applications targeting a range of different platforms like Phone, Tablet, Desktop, and Xbox.

### Tasks
- Writing business and view logic
- Integrating with in-house or external APIs and services
- Working closely with our UX, Design and QA teams
- Implement and tweak iOS/Android designs to fit the windows environment
- Estimate changes and feature requests on ongoing projects

## Stack

### Language

##### C#
C# has been the go to language in Windows App development for over a decade. Since its inception it has evolved adding several major features such as the inclusion of LINQ extensions and the support for asynchronous programming, which are the cornerstone of any modern app.

##### Other languages
Visual Basic and JavaScript can also be used in UWP but are not as as popular as C#.

### Architecture

##### MVVM
MVVM (Model-View-ViewModel) is a software architectural pattern that was designed to make use of the data binding functions in WPF, and now UWP, and facilitates the separation of development of the UI from the business logic. This decoupling of the View ensures that the ViewModel will not only handle user interaction, but also most of the business logic; it will retrieve data from the model, and manipulate it in some way that makes it simpler for the view to handle. This is how we can easily bind elements in a view to data and translations from [NStack](https://github.com/nodes-projects/nstack-sdk-winrt).

MVVM will also typically be used alongside Inversion of Control (IoC) and Dependency Injection (DI) patterns, particularly in larger projects, as it supports the loose-coupling between the View and ViewModel.

### IDE
Visual Studio is the de facto IDE for development on Microsoft platforms. When targeting UWP features such as the Live Property Explorer, Edit and Continue, and the Remote Debugger make Visual Studio indispensable.

### Other tools
- [Fiddler](http://www.telerik.com/fiddler) - effectively serves as a MitM proxy which captures all network traffic and helps us debug network issues
- [Zeplin](https://zeplin.io/) - makes it easy to transfer designs to code by providing exact measurements, colors and assets
- [Postman](https://www.getpostman.com/) - all our APIs are documented through Postman allowing us to easily work together
<!-- - [Xamarin](https://www.xamarin.com/) - allows us to target native Android, iOS, and Windows apps, using existing skills, teams, and code.-->

### Libraries
These are the 3rd party libraries we use in out projects.

- [Json.NET](https://www.newtonsoft.com/json) - A popular high-performance JSON framework for .NET.
- [UrbanAirshipSDK](https://bintray.com/urbanairship/windows/urbanairship-sdk) - integrates with [Urban Airship](https://www.urbanairship.com/) to register for and handle push notifications
- [HockeySDK](https://github.com/bitstadium/HockeySDK-Windows) to collect crash reports and show application updates during testing
- [GoogleAnalytics](https://github.com/dotnet/windows-sdk-for-google-analytics) - analytics and tracking library from Google
- [Mixpanel](hhttps://github.com/eealeivan/mixpanel-csharp) - advanced analytics and user tracking library with features like A/B testing and push notifications

### Continuous Integration

We have set up a continuous integration server using [Visual Studio Team Services](https://app.vssps.visualstudio.com/) to automate our builds, tests and deployments.