---
title: Droidcon London 2016
date: 2016-11-15 17:26:43
tags: ios,ci,continuous integration,fastlane,
authorId: joso
categories:
- Android
---

DroidCon London is located super close to our London office, so our Android developer Mario attended as a volunteer this year! Awesome!


## Johnny, _Mobile Lead_


### Day 1

__What's NNNNNNNNew in Android Security?__ _by Scott Alexander-Bown_

Turned out to be a great talk! Very obvious that Scott have spent some time with the nitpicks and dark corners of implementing security and encryption on Android. Followed him on twitter after this talk! ([@scottyab](https://twitter.com/scottyab))

Also the first time I heard about the SafetyNet API. A Google API that checks for a device's security state and whether it's rooted or not. Scott created a helper around that:

[https://github.com/scottyab/safetynethelper](https://github.com/scottyab/safetynethelper)

Further info:
[Android Training docs]
(https://developer.android.com/training/safetynet/index.html)

In Android 7.0 Google introduced Network Security Configuration, which is a way to describe what protocols and endpoints are allowed to connect to.

[Google has excellent info here](https://developer.android.com/training/articles/security-config.html)

Commonsguy have backported this tool to Android 4.2 here, which is super awesome:
[https://github.com/commonsguy/cwac-netsecurity](https://github.com/commonsguy/cwac-netsecurity)

__Scaling Android @Facebook__ _by Marco Cova & Balazs Balazs_

Impressive talk about the insane numbers behind the facebook app and what kind of process it takes to support that.

If I remember correctly Facebook commits up to 3500 times a week, and due to the massive codebase - everything is split into modules to avoid unnecessary recompiles.

To further improve on that, Facebook has created a custom build tool called _Buck_ around the module structure they depend on for fast deployment.

Going over all the tools Facebook uses, Infer got a mention as well. I head about this a year or so ago, but now that we at Nodes are beginning to integrate CI on client apps, this is super relevant. 

[Infer](http://fbinfer.com/) is a static code analyzer and will correct and point out issues and possible runtime crashes. Definitely something we want in our CI toolchain.

Fun side story at the lunch tables: Facebook apparently had so many commits on their repo that they had a hash collision between two commits.


### Day 2

__What's New in Android__ _by Chet Haase_

(Chet Haase is one of the main public facing Google employees and Lead on the Android UI Toolkit team)

This talk was kind of funny, not because Chet is a funny guy - but because Chet was _really_ pitching the Google Pixel phone. It almost felt like too much.

I also got the feeling he was told to do it.

Nevertheless, the Android 7.1 walk through was pretty good and it was good with some context around the different new features.


__Android Application Security, The Right Way__ _by Dario Incalza_

I didn't really intend to watch this one, I wanted to see the Spotify talk _"Breaking Spotify’s release cycle by using the backend to drive the UI and feature releases"_. 

I'm glad I did though, because it turned out to be the best talk around security this year. The talk was marked as a beginner talk, but gave so much info and reflection on every library, really valuable info.

I've been reading a lot of documentation on encryption via the KeyStore, but Dario gave a lot pros and cons about every API level and what it gives us.

In short (if I remember correctly):

*Android 7*: iOS level security (on the Google Pixel at least)

*Android 6*: Almost iOS level, but you cant besure that encryption keys are protected in hardware. Also new API's for file encryption/device protected storage are not available.

*Android 5*: First fingerprint authentication API and KeyStore API supporting user authentication.

__Radical RecyclerView__ _by Lisa Wray_

Most of the time we implement basic RecyclerViews as simple ListViews - and that tends to be a bit annoying. So it was kind of fun to see all the nifty stuff you can do with RecyclerViews.

We were also shown a few patterns around common use cases. Really surprised by this talk.

__Android Architecture Blueprints__ _by David Gonzalez & Jose Alcerreca_

MVP is all the craze and having the perfect architecture is the target these days. The guys have implemented a simple To Do-app in 7 different ways:

[https://github.com/googlesamples/android-architecture](https://github.com/googlesamples/android-architecture)

The actual talk was kind of quick, because David and Jose wanted to focus on questions and having a discussion around patterns in general - perfect.

Strong opinions were voiced and since David and Jose are funny guys, the talk ended up being the perfect closing for the conference for us.

Side note: Chet Haase were attending this talk, and the guys received a couple of very Google specific questions - like _"Is the platform team considering any of the new patterns?"_ - and everytime they were going to answer, they looked at Chet for confirmation. You probably had to be there.

###Summary

Great talks this year, and since it was located so close to our London office, we walked over there and watched the Apple MacBook keynote!

All the security talks kind of gave me the impression that we need a wrapper or a framework around the encryption/decryption on Android. We see more and more demand for it on client apps, and having all that code floating around on different projects is annoying.

I looked into facebook's conceal library - but it seems to priotize speed too much over security. We'll see, maybe material for another blog post :fire: