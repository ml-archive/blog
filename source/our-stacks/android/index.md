---
title: Android
date: 2016-10-06 17:37:40
layout: stack
---

Android developers at Nodes strive to build awesome apps using the Material Design Guidelines and Google provided design tools. 

Custom designs are important to Nodes and helping the client get the best possible Android experience is a high priority for the Android devs.

### Tasks
- Maintain internal frameworks  
- Take over code bases and adapt/update to newest patterns
- Implement and tweak iOS designs to the _true Android way_
- Help the UX and UI team with the ever-changing design language on Android
- Estimate changes and feature requests on ongoing projects
- Refactor common used code into libraries/utilities
- Work closely together with the QA team

## Stack

### Language

##### Java
Java 1.0 was released in 1995 and is still being used widely today - in part because of Android. Being an old language the toolchain is mature, and features like annotation processing, instant-run and an excellent Java SDK provides a nice tool set for development.

### IDE
Android Studio is the natural choice on the platform with all the bells and whistles it brings. 

### Android Studio plugins
- [android-butterknife-zelezny](https://github.com/avast/android-butterknife-zelezny) - Generate view bindings from the xml file directly
- *Markdown support* - Preview the markdown layout directly in AS

### Other tools
- [Charles Proxy](https://www.charlesproxy.com/) - effectively serves as a MitM proxy which captures all network traffic and helps us debug network issues
- [Zeplin](https://zeplin.io/) - makes it easy to transfer designs to code by providing exact measurements, colors and assets
- [Postman](https://www.getpostman.com/) - all our APIs are documented through Postman allowing us to easily work together
- [Stetho](http://facebook.github.io/stetho/) - Really is a library but integrates with Google Chrome as a web proxy for debugging requests/responses

### Libraries
Android has an excellent selection of available libraries for everything. These are some of the tools we use on a day-to-day basis. We always use the latest official design and appcompat libraries from Google as well.

- [OkHttp](https://github.com/square/okhttp) - An HTTP+HTTP/2 client for Android and Java applications.
- [Retrofit](https://github.com/square/retrofit) - Used together with OkHttp as a "frontend" for API interfaces
- [OkHttp Logging interceptor](https://github.com/square/okhttp/tree/master/okhttp-logging-interceptor) - Great logging for quick http debugging
- [Picasso](http://square.github.io/picasso/) - Image loading library by the infamous Jake Wharton
- [Glide](https://github.com/bumptech/glide) - Memory efficient and fast image loading - our default choice at the moment
- [Realm](https://realm.io/) - Persistence layer with ORM like features
- [ButterKnife](http://jakewharton.github.io/butterknife/) - View binding made easy
- [LeakCanary](https://github.com/square/leakcanary) - Leak detection library for getting rid of those leaks with excellent logging and UI 
- [UrbanAirshipSDK](https://github.com/urbanairship/android-library) - integrates with Urban Airship to register for and handle push notifications
- [HockeySDK](https://github.com/bitstadium/HockeySDK-Android) - integrates with HockeyApp to collect crash reports and show application updates during testing
- [GoogleAnalytics](https://developers.google.com/analytics/devguides/collection/android/v4/) - analytics and tracking library from Google
- [Mixpanel](https://github.com/mixpanel/mixpanel-android) - advanced analytics and user tracking library with features like A/B testing and push notifications

### Open source
We try to do as much knowledge sharing as we can inside the Android team, and the result of that are libraries that contain code for our most common implemented tasks. 

- [nstack](https://github.com/nodes-android/nstack) - Inhouse mobile platform for in-app data and translations
- [gutenberg](https://github.com/nodes-android/gutenberg) - Font library for applying custom fonts easily
- [nstack-gradle](https://github.com/nodes-android/nstack-gradle) - Compile time gradle plugin for generation Translation classes
- [nutils](https://github.com/nodes-android/nutils) - Utility framework with minor helpers
- [nfusion](https://github.com/nodes-android/nfusion) - REST HTTP API Endpoint Abstraction Library with pluggable auth
