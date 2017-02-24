---
title:  Serpent - more than just another JSON mapping framework
date: 2017-02-27 10:10:57
tags: ios,JSON,mapping,parsing,framework
authorIds: 
- maco
categories:
- iOS
---

<p align=center><img src="https://d1gwekl0pol55k.cloudfront.net/image/nstack/translate_values/Serpent_icon_MKPKLwKrTM.png" width=30%/></p>

At [Nodes](https://nodesagency.com), we develop apps that rely a lot on complex REST APIs. The iOS team needed a fast and fully featured JSON mapping framework.
We had been using our own internal parsing framework for Objective-C for a long time, but when Swift came out we decided to create a new one, in Swift, taking advantage of protocol-oriented programming. 

After many iterations and a renaming (our JSON mapping framework was previously known as Serializable), we are proud to announce that [Serpent](https://github.com/nodes-ios/Serpent) has reached version 1.0.



### Another JSON mapping framework?

More than that. Serpent is [one of the fastest JSON mappers](https://github.com/nodes-ios/SerpentPerformanceComparison#-the-results)  out there and has the most features, according to [our analysis](https://github.com/nodes-ios/SerpentPerformanceComparison#-feature-comparison).

<p align=center><img src = "https://raw.githubusercontent.com/nodes-ios/SerpentPerformanceComparison/master/chart.png"/></p>

And maybe you only have to parse and map small JSONs, and you don't care that much about the time it takes. But what about the time it takes to write the mapping code? 

We made a tool that goes hand in hand with Serpent: with <img src="https://d1gwekl0pol55k.cloudfront.net/image/nstack/translate_values/ModelBoiler_1281_Hkq7ey3ZGo.png" width=4%/> **Model Boiler** you only have to declare the properties on your model, and the parsing code will be generated for you, potentially saving you hours of work. 

<p align=center><img src = "https://d1gwekl0pol55k.cloudfront.net/image/nstack/translate_values/ModelBoiler_5S0fTmSARI.gif"/></p>




### But why build a new one?
Yes, there are lots of other JSON mapping frameworks out there. But when we started developing Serpent, there was only SwiftyJSON, which wasn't exactly what we wanted. So we needed to build our own. 

Since February 2016 we moved the project to a [public GitHub repo](https://github.com/nodes-ios/Serpent) and kept developing in the open. In the meantime, we were already using this framework in all our apps. At the moment, we can say that ***various versions of Serpent are part of apps with more than 1.3 million monthly users***.

### Working with Serpent

We built Serpent to make the developers' life as easy as possible when creating models. So we also built a few goodies around Serpent, which allow the developer to save a lot of time when creating the models for the app. 

#### <img src = "https://d1gwekl0pol55k.cloudfront.net/image/nstack/translate_values/TemplateIcon_ma6gVMOOZ7.png" width=4%/> Serpent Xcode File Template

We made the [Serpent Xcode File Template](https://github.com/nodes-ios/SerpentXcodeFileTemplate), which adds a new file template for Xcode. No more typing `import Serpent` manually. It sounds small, but when you have to create 10-20 models, it saves you from a lot of annoyance. 

<p align=center><img src="https://d1gwekl0pol55k.cloudfront.net/image/nstack/translate_values/687474703a2f2f692e696d6775722e636f6d2f6a75647a614a5a2e706e67_JSsVywYm5H.png" width=50%/></p>

#### <img src="https://d1gwekl0pol55k.cloudfront.net/image/nstack/translate_values/ModelBoiler_1281_Hkq7ey3ZGo.png" width=4%/> Model Boiler 

The most annoying part when working with JSONs in Swift is typing all the parsing code. We made a tool that works with Serpent that does that for you. The [Model Boiler](https://github.com/nodes-ios/ModelBoiler) is a small macOS app that lives in your mac's menu bar. In Xcode (or your favourite editor), select the code for the model and its properties, and press a keyboard shortcut, and the Model Boiler will generate the necessary code for parsing to your Clipboard. You can just paste the parsing code in your model. And that's it.

<img src = "https://d1gwekl0pol55k.cloudfront.net/image/nstack/translate_values/modelboiler_QFktJAlXOv.gif" width=80%/>



Together with the Xcode file template and with the Model Boiler, Serpent is (in our opinion) the easiest and most pleasant to use JSON mapping framework for Swift.


### Why Serpent?
Here's a short list of some of the advantages that Serpent has:

* Its own [Xcode file template](https://github.com/nodes-ios/SerpentXcodeFileTemplate)
* Its own code generator: [<img src="https://d1gwekl0pol55k.cloudfront.net/image/nstack/translate_values/ModelBoiler_1281_Hkq7ey3ZGo.png" width=4%/> Model Boiler](https://github.com/nodes-ios/ModelBoiler)
* The best balance between speed and features. We did [the tests](https://github.com/nodes-ios/SerpentPerformanceComparison) and we compared it to some of the most popular JSON mapping frameworks out there.
* [100% test coverage](https://codecov.io/github/nodes-ios/Serpent)
* Carthage, CocoaPods and Swift Package Manager support
* Different versions of it are used in apps used by more than 1.3 million users every month (based on analytics data for some of our apps).


We're really proud to be able to release the 1.0 version of Serpent. The biggest thanks go to all the [contributors that made it possible](https://github.com/nodes-ios/Serpent/graphs/contributors). We hope more developers find Serpent useful and give it a try in their apps. 

Serpent is [open source](https://github.com/nodes-ios/Serpent). If you find bugs or have ideas for new features, you're more than welcome to contribute to Serpent. And if you really like what we're doing, check out the [Nodes careers page](https://www.nodesagency.com/careers/) and join us to make awesome things together.
