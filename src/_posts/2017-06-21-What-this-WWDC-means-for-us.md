---
title: What this WWDC means for us
date: 2017-06-21 10:10:57
tags: [ios,WWDC,ios11]
image: https://cdn-laravel.vapor.cloud/image/nstack/translate_values/wwdc17-og_gKPiuvwlII.jpg
authorIds:
- maco
categories:
- iOS
---


WWDC 2017 happened at the beginning of June in San Jose, California, and Apple presented lots of exciting changes. We already covered in [this article](https://www.nodesagency.com/ios-11-top-new-features-additions/) the most important iOS additions from a user's perspective, but what exactly did WWDC 2017 bring for an iOS developer? Continuing the trend from the last year, the WWDC Keynote was less targeted to developers, and more towards media and users. The interesting things for developers are covered mostly in the Platforms State of the Union, and in the following sessions.

## Swift 4

As was expected, iOS 11 comes with Swift 4. However, since Swift is open source, and all the development is done in the open, there were no big surprises here. [Ole Begemann](https://twitter.com/olebegemann) made a playground a few weeks before WWDC showing [what's new in Swift 4](https://oleb.net/blog/2017/05/whats-new-in-swift-4-playground/), that also got a mention during one of the WWDC sessions. 

There's a new `Codable` protocol, which hopes to end the war of the JSON parsers; there are a lot of changes to the `String` type, which is now a collection again; Swift 4 supports multi-line literal strings (an announcement that was greeted with lots of applause from the developers), and support for KVC was added (and to make it better, the key paths are strongly typed). However, the best part about Swift 4 is that it is source compatible with Swift 3. Upgrading codebases from Swift 3 to 4 is going to be very easy ([here](https://github.com/nodes-ios/Codemine/commit/17cab6b9a3260357ba80c38ff091484ed1d7f80b)'s an example of updating [Codemine](https://github.com/nodes-ios/Codemin) to the latest Swift version).


## Xcode 9

But it's not Swift 4 that got developers excited at WWDC. The greatest news, for me, at least, was Xcode 9.

Xcode 9 finally brings refactoring for Swift code. Not only that, but the whole source editor was rewritten (in Swift). The source control integration has been improved, there are updates to the build system and Xcode Server comes by default with Xcode 9.

<p align="center"><img src="https://cdn-laravel.vapor.cloud/image/nstack/translate_values/xcode-3_oHKU9h4bxf.gif"/></p>

Other noteworthy features are named colours in the asset catalogue, pure vector image support, a main thread checker, a new unexpected behaviour sanitizer, and wireless debugging. 


## iOS 11

With regards to iOS 11, the two new APIs that excited me the most are the new `PDFView` and the Drag and Drop. Drag and Drop is really interesting, especially for iPads. There is support for Drag and Drop on iPhones too, but that's only in the same app. For iPad, however, this opens up a lot of possibilities. The whole way of interacting with files and data across multiple applications has been updated. There are a lot of new possibilities for app developers, and I can't wait to see iPad-optimised apps in autumn.

<p align="center"><img src="https://cdn-laravel.vapor.cloud/image/nstack/translate_values/ios_11_drag_and_drop_pltFnWyKjL.gif"/></p>


Regarding the new `PDFViewer`, I'm looking forward to not having to use a web view for displaying pdfs; even though that's fast, convenient and it worked, that always seemed a bit like a sub-optimal solution.


## What's next

At WWDC we've been given a preview of what our next year will be like. We'll get new betas every approx. 2 weeks with the latest updates and changes. In the autumn iOS 11 will be released, and everyone will be able to use the apps we developed during the summer with the latest APIs and features. 

<br><br>
Image sources:
- [Apple](https://developer.apple.com/wwdc/images/wwdc17-og.jpg)
- [Macworld](http://www.macworld.co.uk/review/ios-apps/ios-11-vs-ios-10-3660096/)
- [Ray Wenderlich](https://www.raywenderlich.com/163940/wwdc-2017-initial-impressions)
