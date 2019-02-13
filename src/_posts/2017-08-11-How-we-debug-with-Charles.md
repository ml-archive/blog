---
title: How we debug with Charles
date: 2017-12-18 00:00:00
tags: [charles,QA,testing]
image: https://cdn-laravel.vapor.cloud/image/nstack/translate_values/charles_IPjFgz7Fvv.png
categories:
- QA
authorIds:
- sely
---

![Charles](https://cdn-laravel.vapor.cloud/image/nstack/translate_values/charles_IPjFgz7Fvv.png)

For those who don't know [Charles](https://www.charlesproxy.com), Charles is an HTTP proxy and monitor that enables testers and developers to view all HTTP and HTTPS traffic between the device and the internet. This includes requests, responses and the HTTP headers. Charles is an incredibly powerful tool in debugging mobile and web applications. This post of the Nodes Engineering Blog explores the debugging capabilities of Charles used daily by our QA and Application Mangement Team.


## Top 5 debugging tools

Charles has many built in tools that can do various things. This post will aim to describe the top 5 tools we use in Nodes QA for debugging our mobile applications. These are the following:

1. Monitor all traffic between API and application (Recording).
2. Simulating network conditions (Throttle).
3. Rewriting the API (Rewrite).
4. Simulating API responses (Map local).
5. Interrupting API calls (Breakpoints).

### 1. Monitor all traffic

The most common thing you can do with Charles, is to have a peek underneath the hood of the application, also known as 'Recording'. By default in Charles, when you start to record traffic you will be looking at the structure tab, that lists all the executed requests organised by URL. All traffic in Charles is stored in the current session, which acts as a log over all traffic. Each request appears in the session window when they are recorded. The session allows testers to look into all traffic coming from the app: from opening the app for the first time, to creating users, to logging in or logging out. We make sure to keep Charles running in the background while performing all our tests to the application. If the app suddenly fails during testing, we can easily 'go back in time' and investigate why, by looking at the requests in the session. Here are a few scenarios in which Charles is a great help in debugging the application:

* When the app is making network requests to an API or a third party provider and you are not receiving the expected results in the app.
* The app displays an empty view, when the app is supposed to fetch data from the API – you need to make sure to check whether data is received correctly from the API.
* If you are making changes in the app and the changes are not applied – you need to check if the app is sending the data correctly or whether you are receiving the processed data from the server unexpectedly.
* Any other scenario that involves the app making or receiving network calls – you need to check your Charles!

With Charles, we are not only able to monitor the implementation of API, we can also monitor the implementation of third party providers such as push providers, Google Analytics, Hockey and furthermore we can monitor the order in which they are implemented. To ensure an agile workflow and a quick response to the issues that are found, Charles sessions can be exported and shared across the team. This 'comes in handy' when a tester is discovering an issue and wants to show the developer what is happening without the aforementioned steps to reproduce the issue. By exporting the session from Charles and adding it as an attachment in the ticket, it becomes very easy for the developer to reproduce the problem. 

Charles also has a built in way to publish gists to Github. The gist will automatically contain all required information in order to reproduce the issue such as auth token, request headers, API path, API environment, etc. This makes the workflow around discovering and reporting bugs in API or API implementation very quick and agile.

The attached example beneath is a screenshot of a Charles session, in which I am recording the traffic in the Apple Store App for iOS. On app open we can for example see that the app calls a Content Delivery Network to get a feature graphic of an iPhone X.

For testers the recording tool in Charles is the most important tool in the Charles toolbox. It gives us an insight into how mobile applications are built and furthermore allows us to identify issues on a lower level than otherwise possible.

![Recording1](https://cdn-laravel.vapor.cloud/image/nstack/translate_values/tool_recording1_vdLLomVrtU.png)

![Recording2](https://cdn-laravel.vapor.cloud/image/nstack/translate_values/tool_recording2_8oTLVyS2PB.jpeg)


### 2. Simulating network conditions

One of the built-in-tools that we use while testing is 'Throttle'. Throttle is used to adjust the bandwidth and latency of the current internet connection. This enables us to simulate a 3G network condition using a high-speed connection. By simulating poor network conditions, we can make sure that our mobile applications handle poor internet connectivity and that timeouts are correctly implemented in the app. We can check if assets are served to the app in a suited file size as well as checking if assets are being cached correctly. This gives us, developers and testers, an insight into how the user experience will be in that scenario. Testing on slow connection speeds is an often forgotten aspect to test for, since most of the apps out there are developed and maintained on high-speed internet connections. However doing so gives us a more realistic sense of the end user experience. 

The throttle functionality is quickly enabled and disabled from the Charles toolbar by clicking on the icon of a turtle. Charles offers a few options for speed restrictions to simulate different network connections, as shown in the screenshots below:



![throttle1](https://cdn-laravel.vapor.cloud/image/nstack/translate_values/tool_throttle1_ZQ2qihmQCZ.png)


### 3. Rewriting the API

When developing mobile applications sometimes the requests made by the app or the responses made by the API are not exactly what we need them to be. With the Charles 'Rewrite' tool we can manipulate an url request on the fly (change the header, modify query params, etc). The rewrite tool can be useful for doing various tricks such as rewriting the authentication token, rewriting the API environment (by modifying the API path), as well as rewriting the status codes of the response. 

Another known trick is to inject a custom request header to be able to trace our request in the server logs seperately from the rest. We use rewrite as a mean to quickly give us access to view the app as a specific user by rewriting the authentication headers. This will allow us to test the app as that type of user, without having to spent time entering username and password. 

During development of the app, the developer might want to quickly change the API environment. He or she is then able to rewrite the API url from development to production environment without having to recompile or reconfigure either client or server. We make sure to always test for error handling when it comes to status codes returned by API. In some projects, it may be difficult to simulate certain status codes no matter how hard you try breaking things. In that case we can use rewrite. In the screenshots below I am rewriting the landing page of the iOS Apple Store App by changing the url of the iPhone X image to a an image of a Samsung Galaxy S8.



}![rewrite1](https://cdn-laravel.vapor.cloud/image/nstack/translate_values/tool_rewrite1_3CeaIAAvHJ.png)

_First we create a rewrite rule in order to replace the URL of the iPhone X image_


![rewrite2](https://cdn-laravel.vapor.cloud/image/nstack/translate_values/tool_rewrite2_hljikhsImW.jpeg)

_We then reopen the app to force the app to make the request again_


![rewrite3](https://cdn-laravel.vapor.cloud/image/nstack/translate_values/tool_rewrite3_UynlzcU5tw.png)

_Checking in our session, we can now see that the rewrite rule has been applied to the request_


We can use the rewrite functionality on any requests, and multiple rewrites can be configured at the same time. Rewrites are encapsulated into rule sets, which can be saved in your Charles config for future use. Rewrite rules can be disabled and enabled as you please along the testing. As you can see, the options of rewriting are many. There are various reasons for why you might need to add rewrite rules, but these are the most common use cases for us:

* Rewriting status codes
* Rewriting API url
* Rewriting authentication headers
* Rewriting headers to alter user agent
* Injecting extra headers
* Injecting response headers
* Adding a find-and-replace rule on the body of a request or the response


### 4. Simulating API responses

With the 'Map local' tool testers have the ability to modify the responses on the fly. The 'Map local' tool changes the response of the request, per the configured mappings, so that the response is transparently served from the new location locally as if that was the original request. In other words the map local will allow testers to simulate responses from each request. 

We use this tool to quickly modify the response body locally in order to test how app reacts to it. The simplest example could be modifying a response from an API call to see if the app UI can handle longer text values. Another use case, is when testers or developers are not getting the expected response from the API either due to new features not being deployed or bugs in the API. In that case we can modify the API response locally to the expected in order to be able to continue testing or developing. We often see that logic, which depends on certain properties/values in the response from the API, is difficult to test for. 
Sometimes, testers will need to go through complicated flows in the app in order to have the response properties updated accordingly. Here the map local comes in handy, as we can quickly modify the response and change the required parameter to what we need, in order to be able to test.


### 5. Interrupting API calls

Another nifty feature of Charles Proxy is called 'Breakpoints'. Breakpoints allows you to specify any host as a breakpoint. Once the app makes a request or receives a response from something that matches your breakpoint, it will pause the request/response to give you an opportunity to examine or edit the request/response. Eventually you can decide whether to allow it to proceed or to block it. We use the breakpoints tools for interrupting the calls to API by aborting them. We do this to see how the app reacts to it, whether the app breaks or an error message is displayed. The breakpoints tool is also useful for modifying the request/response values to try and break the app in order to find security vulnerabilities. The breakpoints can be configured in breakpoints settings and they are quickly turned on or off by clicking the red hexagonal button in the Charles toolbar.

![Breakpoints1](https://cdn-laravel.vapor.cloud/image/nstack/translate_values/tool_breakpoints_1_qMtFVRMWsi.png)


## Get started with Charles

These five tools are all very useful when it comes to developing and testing mobile applications. The biggest advantage for developers is that they won't need to recompile or reconfigure either client or server to make these changes, Charles will act as middleman and make the changes on the fly. During development you might want to quickly change whether app hooks up to development or production API, this is a very quick and easy thing to do in Charles. The biggest advantage for testers is that they can get a peak under the hood of the application and quickly find and identify issues. Using Charles gives you the ability to put on your 'hacker hat' and try to debug or break the app. Charles saves you a lot of time and helps you analyze, debug and fix the issues of your application.

This blog post aimed to give you an overview of some of the most useful debugging capabilities of Charles for mobile developers and testers. It aimed to give you an insight in how we use charles for developing and debugging in Nodes QA. You can start by downloading a free copy of Charles Proxy from the website: [http://www.charlesproxy.com/](http://www.charlesproxy.com/). Charles is supported on Windows, Mac and Linux. Under the section documentation you will find the instructions for installing the tool as well as how to setup and get started.
