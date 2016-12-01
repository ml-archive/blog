---
title:  Serpent - more than just another JSON mapping framework
date: 2016-11-30 10:10:57
tags: ios,JSON,mapping,parsing,framework
authorId: maco
categories:
- iOS
---

<p align=center><img src="https:\/\/d1gwekl0pol55k.cloudfront.net\/image\/nstack\/translate_values\/Serpent_icon_MKPKLwKrTM.png" width=50%/></p>

At [Nodes](https://nodesagency.com), we develop apps that rely a lot on complex backend APIs. The need for a fast and fully featured JSON mapping framework was obvious.

We had been using our own internal parsing framework for Objective-C for a long time, but when Swift came out we decided to create a new one, in Swift, taking advantage of protocol-oriented programming. 

After many iterations and a renaming (our JSON mapping framework was previously known as Serializable), we are proud to announce that Serpent has finally reached version 1.0.



### Another JSON mapping framework?

Yes, there are lots of other JSON mapping frameworks out there. But when we started developing Serpent, there was only SwiftyJSON, which wasn't exactly what we wanted. So we needed to build our own. 

Since February 2016 we moved the project to a [public GitHub repo](https://github.com/nodes-ios/Serpent) and kept developing in the open. In the meantime, we were already using this framework in all our apps. At the moment, we can say that ***various versions of Serpent are part of apps used by more than 1.3 million users every month***.

### Working with Serpent

We built Serpent to make the developers' life as easy as possible when creating models. So we also built a few goodies around Serpent, which allow the developer to save a lot of time when creating the models for the app. 

#### <img src = "https:\/\/d1gwekl0pol55k.cloudfront.net\/image\/nstack\/translate_values\/TemplateIcon_ma6gVMOOZ7.png" width=4%/> Serpent Xcode File Template

We made the [Serpent Xcode File Template](https://github.com/nodes-ios/SerpentXcodeFileTemplate), which adds a new file template for Xcode. No more typing `import Serpent` manually. It sounds small, but when you have to create 10-20 models, it saves you from a lot of annoyance. 

<p align=center><img src="https:\/\/d1gwekl0pol55k.cloudfront.net\/image\/nstack\/translate_values\/687474703a2f2f692e696d6775722e636f6d2f6a75647a614a5a2e706e67_JSsVywYm5H.png" width=50%/></p>

#### <img src="https:\/\/d1gwekl0pol55k.cloudfront.net\/image\/nstack\/translate_values\/ModelBoiler_1281_Hkq7ey3ZGo.png" width=4%/> ModelBoiler 

The most annoying part when working with JSONs in Swift is typing all the parsing code. We made a tool that works with Serpent that does that for you. The [ModelBoiler](https://github.com/nodes-ios/ModelBoiler) is a small mac app that lives in your mac's menu bar. In Xcode (or your favourite editor), select the code for the model and its properties, and press the ⌘§ shortcut, and the ModelBoiler will generate the necessary code for parsing to your Clipboard. You can just paste the parsing code in your model. And that's it.



Together with the Xcode file template and with the ModelBoiler, Serpent is (in our opinion) the easiest and most pleasant to use JSON mapping framework for Swift.


### Why Serpent?
Here's a short list of all the advantages that Serpent has:

* Its own [Xcode file template](https://github.com/nodes-ios/SerpentXcodeFileTemplate)
* Its own code generator: [ModelBoiler](https://github.com/nodes-ios/ModelBoiler)
* The best balance between speed and features. We did some [performance tests](https://github.com/nodes-ios/Serpent/wiki/Performance-tests) back in March
* [100% test coverage](https://codecov.io/github/nodes-ios/Serpent)
* [100% documented](http://cocoadocs.org/docsets/Serpent/)
* Carthage, CocoaPods and Swift Package Manager support
* Different versions of it are used in apps used by more than 1.3 million users every month (based on analytics data for some of our apps).


We're really proud to be able to release the 1.0 version of Serpent. The biggest thanks go to all the [contributors that made it possible](https://github.com/nodes-ios/Serpent/graphs/contributors). We hope more developers find Serpent useful and give it a try in their apps. 

Serpent is [open source](https://github.com/nodes-ios/Serpent). If you find bugs or have ideas for new features, you're more than welcome to contribute to Serpent. And if you really like what we're doing, check out the [Nodes careers page](https://www.nodesagency.com/careers/) and join us to make awesome things together.
