---
title: Going to ServerSide.swift 2018
date: 2018-10-26 18:00:00
tags: vapor,swift,linux,swift4,vapor3,serversideswift,backend
authorIds:
- stso
- re
- sikk
categories:
- Vapor
---

## The first conference in the world to focus on server-side Swift
We (the Vapor team at Nodes) were excited when we heard that a conference focusing on server-side Swift was announced. We did get the news a bit early since the conference is run by [Tim Condon](https://twitter.com/0xtim), [Martin Lasek](https://twitter.com/martinlasek) and [Steffen D. Sommer](https://twitter.com/steffendsommer) where Martin and Steffen both work at Nodes. Before this conference, we would look at conferences focused around Swift or more traditional "backend" conferences which most likely would focus on another language than Swift. Being able to go to a conference that mixes backend together with our programming language of choice is ideal to us.

The whole Vapor team at Nodes met up in Berlin to participate in the conference and with this blog post we wanted to share a couple of highlights from the conference as well as give some feedback on the conference in case any readers are considering to go next year.

## Quick facts
Some quick facts about ServerSide.swift 2018:
- September 12-14 in Berlin (Adlershof)
- One day of workshops. Four half-day workshops to choose from, with two running in parallel before lunch and two more running in parallel after lunch. This meant that you would be able to attend two at most.
- Two days of talks. 8 talks per day and 18 speakers in total.
- September 13 had a panel discussion after the last talk with five people from the community in the panel.
- Website: [http://serversideswift.info](http://serversideswift.info) - videos should be available soon at the time of writing this post.

## Talk highlights
With 16 talks in total there has been a lot of knowledge to digest. Here are some highlights from the different talks we heard:

### Vapor State Of The Union (Tanner Nelson)
Since we at Nodes spend a lot of time using Vapor we were of course interested in the state of the union talk by Vapor's founder, Tanner Nelson. The talk went through the biggest changes from Vapor 2 to Vapor 3, being 1) how we deal with configs (read: no more JSON files), 2) how codable removes a lot of boiler plate code for us and 3) how Vapor is now built on top of SwiftNIO, making it possible for the Vapor team to delete a lot of code. The talk also gave a quick overview of the different packages that exist within the Vapor ecosystem and it provided a sneakpeak into what can be expected from Vapor Cloud 2 which [launched in alpha recently](https://medium.com/vapor-cloud/vapor-cloud-2-public-alpha-2d9ee14d0688). Lastly, the talk also touched upon the [Swift Server Work Group](https://swift.org/server/) and the [Swift Forums](https://forums.swift.org/c/development/server).

### From Idea to Production at ING (Ian Partridge and Pim Stolk)
It is always a good idea to have the finger on the pulse regarding alternative tools, and this split venture talk from Pim from [ING](https://www.ing.com) (Dutch bank) and Ian from [IBM and Kitura](https://www.kitura.io) provided just that.

ING is a bank in The Netherlands where Kitura (an alternative framework to Vapor) is playing a big role in their tech stack. The first part of the talk was given by Pim from ING and, besides presenting ING to the crowd, it revolved around the thoughts behind choosing Kitura, bringing innovative solutions into the banking world.

Ian's talk focused on Kitura and presented how the latest version has evolved from `2.0` to current `2.5`. A key takeaway was how they managed to integrate [OpenAPI](https://www.openapis.org/) in Kitura by automating their API documentation using auto-generated Swagger documentation and examples. This is a feature that would be welcomed by any API developer.

### Microservices (Ralph Küpper and Marcin Kliks)
There were two talks about microservices and the topic was mentioned several more times in other talks and in the hallways. This approach of splitting up backends into several dedicated subsystems that each have a very specific role is a hot topic in serverland in general and server-side Swift is no exception.

In his talk, Ralph Küpper explored microservices from an architectural approach and gave examples of how he is using it in his company [Skelpo](https://www.skelpo.com) to create apps for their clients. He provided a balanced view, listing both advantages (e.g. being able to tailor approaches to the setup of each component in terms of language and framework and advantages in terms of team allocation) and disadvantages (it is hard to do right and there is an overhead in terms of time and money).

Marcin Kliks works for [_allegro_](https://allegro.pl), an e-commerce platform in Poland, and he gave an example of a specific microservice that he had developed that took care of one thing: compressing images. Their site is based heavily around images and they were experiencing slow response times. In order to deal with the influx of new images they needed a fast system that was also memory-efficient due to the already high memory load inherent to image optimization. He demonstrated how he was able to call into MozJPEG's C API from Swift and could debug both languages in Xcode at the same time.

### Microservers (AKA SwiftNIO on Raspberry Pi by Helge Heß)
As one of the last talks of the conference, this talk was full of surprises, both in terms of content and as well in terms of delivery. Watching Helge demonstrate the powers of the small and efficient but fast device in action running SwiftNIO was both highly informative and entertaining.
He showed step by step how to get a simple server up and running using a small wrapper around SwiftNIO, some Xcode templates, and a Docker deploy script. A [community-maintained](https://www.uraimo.com) port of Swift for ARM processors and a small Docker hosting [operating system](http://hypriot.com) were used to get it all working.
Helge also demonstrated a more complex setup where the Raspberry Pi hosted both an HTTP + WebSocket and an IRC server making it possible to send commands to the little powerhouse over a web-based IRC client that caused messages to display on a small attached text-display. It served as a great demonstration for the flexibility of the Raspberry Pi and its potential to run Swift thanks to its speed and low memory consumption.
All this potential for cheap and plentiful dedicated cores has some real world uses as well. [Scaleway](https://www.scaleway.com) is a hosting platform that offers ARM based servers. Due to the compactness and low heat they are able to get around 8000 cores in a single server rack.

## Last remarks
Although coming from different backgrounds and using different frameworks, the attendees shared an enthusiasm for Swift on the server and it was great to experience the sense of community in real life, outside the chat servers. Bridges were built between the subcommunities and experiences and knowledge were shared.

On Thursday there was an open bar (sponsored by [Swiftengine](https://swiftengine.io)) which allowed us to mingle and meet speakers and fellow attendees in a relaxed atmosphere. Among the attendees were two people from the SwiftNIO team ([Cory Benfield](https://twitter.com/Lukasaoz) and [Johannes Weiss](https://twitter.com/johannesweiss)). They are not just very approachable and active in their support on the Vapor Discord server (and other frameworks) but equally so in real life and this conference provided a great opportunity to meet some of the minds behind the awesome project that is SwiftNIO.

There were over 80 participants and surely many more would have liked to come but couldn't because of travel or lack of time. It was the first conference focused on server-side Swift but it clearly will not be the last since this topic is very popular. The conference was well-organized - even though the organizers were new at it - and the quality of the talks was very high so we're looking forward to next year's edition!