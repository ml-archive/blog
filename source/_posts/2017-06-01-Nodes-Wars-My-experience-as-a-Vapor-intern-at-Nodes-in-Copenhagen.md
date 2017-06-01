---
title: Nodes Wars: My experience as a Vapor intern at Nodes in Copenhagen
date: 2017-06-01 12:00:00
tags: swift,vapor,nodes,agency,spain,git,opensource,testing,intern,internship
authorIds:
- vaga

categories:
- Vapor
---

Hello! My name is Valen, I am studying in Spain and the last subject of my training consist in an internship in a company. They gave me the chance to do this abroad and it seemed like a good opportunity. So, here I am, in [Nodes](https://www.nodesagency.com/), a digital agency in Copenhagen where I am staying for three months to do backend development in Swift using [Vapor](https://vapor.codes/).
They asked me to talk about my experience as an intern so, here I go:

## Episode 1: The Mac menace

My first day was a day of discoveries. I was new to everything; new to working in a company, new to using a Mac, new to Swift and new to Vapor. At this point, it became very apparent to me that I had much to learn.  
It didn't take much time until I had acquired my first major lesson. A piece of knowledge that would accompany me for the rest of this journey I call "internship": how to use the coffee machine.

## Episode 2: Attack of the code

Vapor is an interesting framework to work with. From the perspective of a newbie in backend-development it felt friendly and somehow "easy" to learn. The best thing is that you don't need to be an expert in Swift to make your first website using Vapor (example below).
![](http://isaced.qiniudn.com/FodLnmcMmvwEKTygu1CqOgqA8v8Z)
After grabbing a few coffees, watching tons of tutorials from the internet and reading documentation, I was finally ready to start my first project: a "Rocket League" tournament system.  

Once the name of the project was settled (just took me two hours), I started with the famous `vapor new scorecket`

![](https://pbs.twimg.com/media/CjeXpZQXEAA0pS9.png)

I started by doing the authentication and saving users into the database. Doing this with Vapor is really easy. You just need to have a Model, initialize it with the values you need and then save it:  
```swift
try user.save()
```
So all I had to do was to get the data from the form to create a user and then save it. Just like that. Easy, right?
Because I didn't like the default HTML style, I added this tool called [skeleton](http://getskeleton.com/#examples). A lightweight CSS framework that helped me make my app more stylish. Here are how things look so far.

![](http://i66.tinypic.com/op440z.png)


Now, we have added users, but what should they do?  
Well, the next step was to create Teams and to allow users to enroll in a team or to create their own. Also, to add the ability for a team to signup for a tournament.

![](http://i63.tinypic.com/alosol.png)

Tournaments can only be created and started by the admin. And, once started, it will create all of the games automatically, with their respective dates and teams. After that, all that is left is for a user of one of the teams to introduce the results of the game. Following, the adversary team will get a message, asking to confirm the results of the game. Once accepted, the score of both teams will be updated.  

![](http://i66.tinypic.com/nmb2ja.png)

The project was really fun to work on and gave me a chance to learn the basics of Vapor. Giving me a better understanding of how websites work. Including the relationship between all of their components.

You can see all the full code [@Github](https://github.com/valen90/scoreket)

## Episode 3: Revenge of the bug

While working on this project, I found something strange. I used one of the functions in the [Sugar](https://github.com/nodes-vapor/sugar) package to generate the foreign keys for my database, but, when trying to reference the same table twice, an error appeared. So, Steffen (Lead Vapor developer at Nodes and the one responsible for giving me work to do and withstanding all the intern's incessant questions) told me to "fix that and submit a PR." That was a great idea! It made perfect sense. But... There was, at that moment, one major problem: I didn't know what a PR was.

Previously, I had only used Github to upload  projects for my teachers to grade. I didn't really know anything about these pull requests (PRs), merging and branching. Luckily, my team helped me a lot and I finally managed to make the pull request. I can only describe the feeling of a pull request being merged as... addictive.

![](http://i64.tinypic.com/339niw7.png)

That wasn't enough. I wanted more. I began adding features to some of the packages and fixing bugs that I found along the way. But then something unexpected happened.

## Episode 4: A new version

[Vapor 2](https://github.com/vapor/vapor/tree/master) was released and that meant that all of the packages needed to be updated. It seemed like a good exercise for me to improve, so I got the task of updating some of them. Once you update one you start to see that the same things are repeated in the others. Because of this, I got better-and-better at updating these packages. That being said, some of them weren't that simple and required more time and effort. Of course, more help from my teammates and their infinite patience.  
Here is the list of some of the packages that I worked on:
- [sugar](https://github.com/nodes-vapor/sugar)
- [error-extended](https://github.com/nodes-vapor/error-extended)
- [paginator](https://github.com/nodes-vapor/paginator)
- [meta](https://github.com/nodes-vapor/meta)
- [flash](https://github.com/nodes-vapor/flash)
- [bugsnag](https://github.com/nodes-vapor/bugsnag)
- [aws](https://github.com/nodes-vapor/aws)
- [nstack](https://github.com/nodes-vapor/nstack)
- [gatekeeper](https://github.com/nodes-vapor/gatekeeper)
- [storage](https://github.com/nodes-vapor/storage)
- [data-uri](https://github.com/nodes-vapor/data-uri)
- [sanitized](https://github.com/nodes-vapor/sanitized)
- [push-urban-airship](https://github.com/nodes-vapor/push-urban-airship)
- [stacked](https://github.com/nodes-vapor/stacked)  

After some updates and pull requests into GitHub (108 contributions :grin:), I became the first Swift programmer in my city. So, yeah, I am kind of a legend now.

![](http://i65.tinypic.com/r9rds8.png)

Ok, ok, there are just five people in the ranking. But! It still counts!

## Episode 5: The test strikes back

>Tests? I don't write tests. Only people who write bad code write tests - Brett

I start this episode with a joke from Brett (developer at the Vapor team and also winner of the "teasing the intern" award).

Not only updating, but also writing tests to check that the code is correct is an important part of development. Also, I think that it gives you the chance to really know how the program works and to think about where the errors could appear. It's a good exercise to learn.

![](http://i63.tinypic.com/vxdw1j.png)

In order to cover as much code as possible, I started to add some test to the existing projects,. It is sometimes hard to write tests because you want to avoid all of the external influences. To achieve this, you need to make these simulated objects, that mimic the behavior of real objects, called Mocks. This way, you can test everything in a more controlled, hopefully stateless, way.

After making the Mock Objects and thinking about how to test the different functions, if everything went well, you should get something that looks like this:

![](http://i68.tinypic.com/1043vx1.png)

## Episode 6: Return of the Intern

This internship only lasts for three months. So, sadly, I have to say goodbye. I want to say thanks to all the backend team for always giving a moment to helping me out, even with the stupidest questions. And thanks to the whole company for treating me like one of their own, trying to speak in Spanish sometimes, not just treating me like the "intern" and for making this experience an unforgettable one.

I will leave Copenhagen with some experience. Having learned something about Swift and Vapor; how to use a Mac; how to contribute to bigger projects making branches,  forks and pull requests; how to make tests with as much coverage as possible and, of course, how to open a beer with just a lighter.

If you are considering doing an internship here at Nodes, I cannot imagine a better place to learn, to collaborate on real projects used by lots of people and be surrounded by people always willing to help you out. Not only inside, but also outside the working environment. Oh, have I mentioned the free coffee?

Well, that is all! I hope you enjoyed reading this post!

So long and thanks for all the fish.