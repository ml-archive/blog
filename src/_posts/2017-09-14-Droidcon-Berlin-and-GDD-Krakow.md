---
title: Droidcon Berlin and GDD Krakow
date: 2017-09-14 17:00:00
tags: [android, conference, architecture, kotlin]
authorIds:
- joni
categories:
- Android
---

Being one of the biggest Android conferences in Europe, this was my first time in Berlin. The conference was taking part in partnership with IFA Berlin. As a perk Droidcon tickets also allowed access to it. The downside was the big amount of people commuting to the venue and particularly the accommodation prices during those days.

### Keynote: How to be an Android Expert
by Chiu-ki Chan

A very eye-opening talk where Chiu-ki shared her views on what an Android expert is and how to become one by sharing knowledge on different ways and tips and tricks to become an Android Expert including how to take sketch notes in a talk or how to write a blog post efficiently. Find the slides [here](https://www.slideshare.net/chiuki/how-to-be-an-android-expert-droidcon-berlin).

### Data Persistence in Android: There’s Room for Improvement
by Florina Muntenescu

One of the talks that I was more interested about. Unfortunately, the “Room” in this case was too small for the number of people who wanted to attend so I could not enjoy it this time. Nevertheless, I had another chance as you will see below.

### Flutter – 60fps UI of the Future
by Pascal Welsh and Albrecht Noll

[Flutter](https://flutter.io) is a new mobile SDK which aim is to build modern and beautiful UIs for both Android and iOS. Pascal and Albrecht gave an excellent intro to Flutter that even seems capable of running smoothly at 120fps. Impressive!
Flutter is currently in alpha version and open source with Google working actively on it. It provides a thin layer of C/C++ code and requires to use Dart for implementing the UI. All elements in Flutter are considered widgets that connect in a Matryoshka type hierarchy and uses Composition over Inheritance.
For more info on the presentation check out the [slides](https://speakerdeck.com/passsy/flutter-60-fps-ui-of-the-future). Also, if you want to try an app build using Flutter, you can try Hamilton ([Android](https://play.google.com/store/apps/details?id=com.hamilton.app), [iOS](https://itunes.apple.com/us/app/hamilton-the-official-app/id1255231054?mt=8)).

### Home Improvement: Architecture & Kotlin
by Jorge D. Ortiz-Fuentes

Being Android Architecture Components and Kotlin the two biggest announcements in the last Google I/O this was one of my top picks for day one. Interestingly, I had the chance to meet Jorge early in the morning before the opening keynote.
During the talk, Jorge shared some insight of real and relevant scenarios where he explained how to improve our apps using Kotlin. Similarly to Florina Muntenescu’s talk, the room was not big enough, but this time I managed to get a sweet spot.

### Keynote: Designing for Trust: User Experience + Privacy
by Ame Elliott

Ame is Design Director at [Simply Secure](https://simplysecure.org), a nonprofit organisation that provides professional education for user experience designers, researchers, and developers working on privacy, security, transparency, and ethics. She structured her talk into three different main topics: Understand the risks to users, Lead through design and Practical advice.
Check the slides [here](https://simplysecure.org/resources//Elliott-DroidCon-UXandPrivacy.pdf).

#### Developing a Streaming Android App for TV in Minutes
by Mario Viviani

I had the pleasure of meeting Mario at my first Android meetup in London back in 2015. He is a Technology Evangelist at Amazon and former GDE, so I was looking very forward to attending his talk and learning more about everything that Amazon is doing. 
I was particularly impressed to see how things have evolved during the last years and how they have listened to the developers to make things easier with integrations that are incredibly simple and straight forward.

### Reactive, Clean Architecture and Android Architecture Components, a Solid Formula for a MVVM Based Architecture
by Lucia Payo

My top pick for the day. Here again, I had the opportunity to meet Lucia before her talk as she was in N26 stand. We had the chance to discuss the new Android Architecture Components library and share different views on MVP and MVVM.
In the talk, she presented a clean and well-structured reactive architecture based on MVVM. I would recommend having a look at her latest articles [here](https://mag.n26.com/reactive-clean-architecture-with-android-architecture-components-685a6682e0ca) and [here](https://mag.n26.com/practical-example-using-reactive-clean-architecture-approach-8a2436ea76b4).

# Google Developer Days Europe - Krakow

This event overlapped in its first day with day two in Droidcon Berlin, so I missed the first half of it. Still, it was a very nice event. The ICE Congress Center in Krakow is a four floors event space, and with so many things going on at the same time in different areas it was easy to miss something.

My day started meeting for breakfast with some of the Android students at Udacity that I have been mentoring during the last few months. During the day I continuously meet many more as there were around 150 of them in the conference.

### Day 2 Keynote
by Ewa Macias, Behshad Behzadi, Mícheál Ó Foghlú

Probably the most impressive part of the keynote was the demo on Artificial Intelligence and Google Assistant. We had the opportunity to see in action some of the most complex interactions with the Assistant that are still in the works including an incredible understanding in noisy environments.

### Architecture Components
by Florina Muntenescu

Finally, I had the chance to attend Florina’s talk. There she talked about Architecture and best practice. She also introduced some of the latest additions to the Android Architecture Components library such as the new Paging library that is not yet released by the time I am writing these lines.
I also had the chance to talk with Florina about architecture with MVP, MVVM and how the new ViewModel works with different architectures plus some insights in Room. Overall, an outstanding and valuable know-how for our future projects.

### Deep dive into Constraint Layout
by Dan Galpin

Training sessions during the event were completely packed, and some people found that there was not space enough for such high demand. For this one, I had the pleasure to be invited to help Dan as a TA solving questions and doubts from the attendees. If you feel interested in playing with Constraint Layout this is the [code lab](https://codelabs.developers.google.com/codelabs/constraint-layout/index.html) that we used for the session.

### Modularizing Your App
by Ben Weiss

During his talk, Ben showed how to improve our app discoverability using Instant Apps where the key is modularising our apps. The primary constraint here seems to be the size of our modules which should be smaller than four megabytes. Also recommended tools to deal with this are the apk analyzer and configuration splits on top of the usual minification, shrinking and proguard obfuscation.

# Final thoughts

Droidcon Berlin was great to find out more about a wide range of topics related to Android and meet interesting people. GDD Krakow was a very big event where I have the opportunity to help in a training session, meet some of my mentees at Udacity and discuss different topics with Google Developer Advocates. 

Taking three flights for two conferences in a row in different countries is probably as tiring as it seems. Nevertheless, it was an awesome experience and I could not be happier about it.