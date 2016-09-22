---
title: Continuous Integration With Deployment to TestFlight and HockeyApp
date: 2016-08-26 10:00:00
tags: ios,ci,continuous integration,fastlane,
authorId: doha
categories:
- iOS
---


# Continuous Integration With Deployment to TestFlight and HockeyApp


We've recently revised our development process on the iOS team and set up a continuos integration server to make and deploy our builds faster, easier and more consistently. This post should shed some light on what we chose and how we set it up.


## The Requirements

Being an agency doing client work only, distributing test builds internally and to clients has always been a challenge. 


For many years, we have exclusively used [HockeyApp](http://hockeyapp.com). As we're juggling an overwhelming amount of client Apple Developer Accounts, it's impractical to gather UDIDs from all of our clients and do new builds every time someone new wants to test an app. This is why we have been using our enterprise account to sign the Hockey builds we make with a [wildcard In-House provisioning profile](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/DistributingEnterpriseProgramApps/DistributingEnterpriseProgramApps.html).

The drawback of this approach is that all Apple services like push notifications, iCloud or in-app purchases won't work. In order to get those working, you need to create an app identifier with a dedicated provisioning profile; and if you want to release the app on the App Store, this means that you will have to use a different bundle ID than the live app otherwise Apple won't allow you to create the app identifier.

We've chosen to use a combination of [HockeyApp](http://hockeyapp.com) and [Testflight](https://developer.apple.com/testflight/) for our beta distribution.

Testflight gives us the most accurate representation of how the app will behave when in production, but the delay between uploading and it being available to test can be pretty big. This is why we opted for a model that uploads to both platforms simultaneously. The client only ever tests on Testflight, but HockeyApp is very handy for quickly making a new build available for internal testing by Q/A and Project Managers. 

<p align=center><img src="https://d32wt9uxwfssua.cloudfront.net/tech-blog/uploads/ci_circle.png" /></p>

The main requirements or features of a CI server are usually the same for any platform:

* Verifying if the project builds
* Running unit tests *(future requirement as only our frameworks are tested at the moment)*
* Deployment

Other reasons are very dependent on what kind of work you do either alone or as a company. Making one app for 5 years and deploying tens or hundreds of different apps every day will result in completely different needs.

Apart from those common requirements, we wanted to setup the CI system so that it keeps our deployment consistent and also save time. 
(Who likes to stare at the screen for 15 minutes while Xcode is archiving?)


Most likely, you will run into a discussion about how customizable the system should be. Good thing to keep in mind is, that the more customizable the system will be, the more time-consuming it will be to set up each project. We wanted to be able to use a CI system that would give us quick per project setup with minimum manual work needed and some fair amount of customizability. This, of course results in a longer initial setup time of the actual CI system. 

## Options

An [increasing number of CI solutions](https://en.wikipedia.org/wiki/Comparison_of_continuous_integration_software) is becoming available and it feels like there is a new one showing up every day. It makes choosing the right one more difficult and you will usually have to experiment with multiple before you find one that has features you need and actually saves you time. 

The current trend seems to be a one-click solution that *magically* does everything for you. This usually means very low customizability and proprietary source code. We didn't want to go this way because we like to know what is going on under the hood and how it can be improved or augmented. Also, when **magic** breaks, you're in for hours and hours of a total nightmare!

## How did we choose?

![Jenkins](https://d32wt9uxwfssua.cloudfront.net/tech-blog/uploads/jenkins_logo.png)

Since a few of us had experience with **Jenkins** it was an obvious first choice and we got our prototype version running in a few days. Jenkins is the king of customizability and features and the industry standard for large projects with complex configurations. 

We were quite happy with our setup, only major issues were the initial setup time for each project and overall *scariness* of the user interface. **It was important that everybody could customize their project without feeling like they are launching a nuclear missile.**

![GitLab](https://d32wt9uxwfssua.cloudfront.net/tech-blog/uploads/gitlab.png)

We wanted to choose something that would be easy to understand even for our interns or junior developers and since we recently updated our installation of GitLab to the latest version, we've been intrigued to try **GitLab's Pipelines** which are specifically meant for continuos integration.

Rewriting of some of the scripts from Jenkins was needed, but worth the result. We've achieved an extremely easy project setup (just adding one file to the repo) and it's easy to understand for everyone. For more complex projects we allow overriding the build scripts per project, again by just putting them in the repo.

**TL;DR:** GitLab's Pipelines won for us. Jenkins is scary.

## Our Setup

### Commit Message Trigger

We figured out that the simplest way of triggering a CI build for us will be some magic words in a commit message. We still need to manually incerment build and version numbers of our apps, and that's the perfect commit where to make the CI build the project.

First, we tell the CI where it should deploy the app after building and then the environment the should should be set and used when building the app. 

```
738af0 Fixed stuff [ci testflight staging]
```

To maintain consistency we always make a HockeApp build if you select a Testflight build, but in case uploading to Testflight fails for some reason we do support `testflight_only` option, which is especially handy when iTunes Connect API fails as it often does.

### .gitlab.yml (GitLab Pipelines Config)  
Used by Gitlab Pipelines to detect if a build/deploy should be done and what exactly should be done. Very similar to how you would configure Travis.
  
When run, the YAML file sets project specific environment variables, for example a bundle id or Slack channel name and copies template files, custom ruby scripts and fastlane configuration files into the repository.

```sh
stages:
  - build

build_project:
  stage: build
  script:
    - export
      DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer"
      FL_SLACK_CHANNEL="ios-ci"
      SIGH_APP_IDENTIFIER="com.nodes.app"
      FASTLANE_ITC_TEAM_NAME="Nodes ApS"
      FASTLANE_ITC_TEAM_ID="123456"
      HOCKEY_APP_ID="123456eabfc1234e456a34565e41e35e41"
      MAIN_PLIST_PATH="./YourApp/Info.plist"

    - git clone --depth 1 git@yourgitserver.com:ios/ci-template.git
    - ruby ./ci-buildtools/nodes-build/nodes-build.rb

  tags:
    - ios
```

Worth noting is that the copying step only happens if those files don't already exist in the repository, this way we can override actual build steps for complex projects by including modified version of those files in the repository.

As the last step, it runs the main Ruby file to start the build.

### Ruby Scripts & Gems

We are using one custom script and two gems we made to be able to set up and start a build. 


**[hockeyver](https://github.com/nodes-ios/hockeyver)** is a small gem that fetches last uploaded version and build from HockeyApp given that you provide an API token and app ID. We use this to be able to fail fast and early as all our Testflight builds have a corresponding build on Hockeyapp so we can check if that version already exists before even starting to build.

```bash
$ hockeyver --app_id YOUR_APP_ID -t YOUR_TOKEN
26

# Later when used in fastlane
ERROR [2016-08-30 17:12:09.04]: Build failed! Version already exists on hockey.
```

**[carthage_cashier](https://github.com/nodes-ios/carthage_cashier)**  is another gem which provides an extra layer of caching on top of a  dependency manager we use in most projects - Carthage. It caches all the built products, based on their version and also compiler version, so that we can load from cache when we need it, instead of building all dependencies again. This saves us a lot of time and is useful especially for CI builds, where dependencies rarely change.

```bash
$ carthage_cashier .
Copied dependencies from cache: ["Alamofire", "Reachability"]
Following dependencies not cached, bootstrapping them now: ["Serializable", "Blobfish"]
...
All dependencies loaded.
```

### Fastlane

[Fastlane](https://fastlane.tools/) is a newer tool meant for automating various tasks during the development of mobile applications. Think Makefiles on steroids with some nice extra features for iOS. It consists of many different small tools like `gym`, `sigh`, `spaceship` and more that handle all your regular tasks, from (re)signing, deployment to publishing metadata and taking simulator screenshots.

All is configured in one main file, called the `fastfile` in **lanes**, which are just separate steps which you can execute. What we decided to do was to create a template fastfile where all the lanes and commands are preconfigured, so that it wouldn't require any additional setup from the developer on a project. Of course, we made sure it still is possible to provide your own fastfile in projects which would require additional setup.

```bash
$ bundle exec fastlane test_flight api_env:staging changelog:"Something fixed."
DEBUG [2016-08-21 16:32:29.23]: Using api_env: staging
DEBUG [2016-08-21 16:32:29.23]: Using changelog: Something fixed.
....
INFO [2016-08-21 16:33:55.01]: Starting with ipa upload to HockeyApp... this could take some time.
....
INFO [2016-08-21 16:44:17.10]: fastlane.tools just saved you 12 minutes! 🎉
```

## Summary

Continuous integration is awesome and you should be using it. After all, it not only makes it easy, fast and consistent to make builds, but also gives you a point on the [Joel Test](http://www.joelonsoftware.com/articles/fog0000000043.html)!

<p align=center><img src="https://d32wt9uxwfssua.cloudfront.net/tech-blog/uploads/caveman.jpg" /></p>

If you can't afford an in-house computer to set up as a build server or you prefer an all-in-one solution in the cloud, then your best bet would be [BuddyBuild](https://buddybuild.com/), which offers a tonne of features and has great support where you can communicate directly with the developers! 

On the other hand, if you are producing many apps each with specific requirements you can't always use a simple solution like that. There might also be legal reasons and non-disclosure agreements preventing you from having an external server clone your repository. Or you just prefer to have your own dedicated servers in your own office, which start builds immediately and give you full control.

We are still iterating and improving our current setup, but hopefully, this article has at least made you think about having your own CI up and running.