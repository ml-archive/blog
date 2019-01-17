---
title: A Guide to Google Home Integrations
date: 2019-01-14 10:00:00
tags: server,google,home,ai,api,cloud,serverless
authorIds: 
- brto
categories:
- Vapor
---

Within the trend of IoT, Google Home is amongst the most popular. Thankfully, Google has made the development of actions quite approachable. To get an overview of the process, let's create a weather integration together.

## Actions on Google
Creating your Google Home integration starts with Actions on Google (AoG). Quoting Google: 
> Actions on Google is the platform for developers to extend the Google Assistant. Join this emerging ecosystem by developing actions to engage users on Google Home, Pixel, and many other surfaces where the Google Assistant will be available.


Now, it's time to create your action. Under the _Build_ section, click _ADD ACTION_ and finally select _Custom intent_. After creating the action, Google will redirect you to their [Dialogflow](http://dialogflow.com) service.

## Dialogflow
Dialogflow is Google's intuitive natural language processing (NLP) tool. Here is where you train the AI to recognize intents. This is by far the smoothest part of creating a Google Home integration. Create an intent and just type in a few example phrases to train the AI.

- How's the weather today?
- What's the weather?
- How's the weather in `Copenhagen`?

After configuring the training phrases, make sure to check the box _Enable webhook call for this intent_. Doing so allows you to add fulfillments programmatically.

### Fulfillment
A fulfillment is a response to an intent. Programmatic fulfillments allow you to do many things: present a card with information, prompt a user for more information or show an error. Fulfillments use the webhook REST API and can be served through cloud functions or self hosting.

#### Cloud Functions
In the _Fulfillment_ tab on Dialogflow you have the option to edit a fulfillment and deploy it to Google Cloud Functions all within the inline editor. If you're short on time or your project isn't that large, this is by far the simpler option of the two.

#### Self-hosting
If you're working on a larger project or cloud functions aren't your thing, you can host your server and configure Dialogflow to fulfill all requests using your server. As most major programming languages have a fulfillment library, you have a much wider choice in what to develop your fulfillment in.

## Testing
After developing and deploying your fulfillment, it's time to test. On the Dialogflow website, go to the _Integrations_ section and then click on _INTEGRATION SETTINGS_. At the bottom of the dialog, you should see the button _TEST_. If clicking the button gives you the error `there was an error completing your request` make sure Google selected the correct user in the upper-right corner.

You should now be in the `Simulator` where you can test all of your actions and intents. As a bonus, all supported Google devices linked to the same email will be able to test your actions.

Try it out!

> Ok Google, ask My Test App about the weather

### Conclusion 
Creating a Google Home integration and fulfillment is an intuitive and relatively easy process. There is some friction with the integration between the different Google services, but overall everything works nicely.

#### Key takeaways
- Setting up a Google Action is very easy
- Intents have to be trained manually for every single language your application supports
- Localization of fulfillments will take a bit of effort
- NodesJS and Go seem to be the most supported languages
- You can only address your app explicitly. Ex. “Okay Google, ask … about the weather”