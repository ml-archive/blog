---
title:  Making a Presentation Application with Google Nearby Messages & Firebase
date: 2018-01-05 13:00:00
tags: ios,google,firebase,googlenearbymessages,presentations
authorIds:
- anll
categories:
- iOS
---

Here at Nodes, we regularly run events and give presentations. We wanted to use technology to make these more accessible and enhance these events for people who attend. Smooth out the event process entirely the only way we know how, making applications!

Although we have many ideas for what this application could behold, I decided to focus on the presentation process and in particular, presenting slideshows. I set out to make an application that could display slideshows and "broadcast" them to other local devices running the same application, while making the process as simple for a user as possible. I have developed a prototype application that allows users to give presentations while letting other users view the same presentation on their own devices, while it automatically follows along at real time with the presenter. I’m going to explain how this was made possible by using two mobile platforms from Google, [Firebase](https://firebase.google.com/) & [Nearby Messages](https://developers.google.com/nearby/).

The application currently works with PDFs; using a `UIImage` extension, it takes PDF files and turns pages into images. I then use a `UIPageViewController` to create the required number of ViewControllers and display each pdf page in a separate view controller allowing the user to flick through them. In this blog, I want to focus more on the Google platforms. The project including this code is available here. [github/nodes-presenter-iOS](https://github.com/nodes-projects/nodes-presenter-ios/tree/PresentationApp_Development).

All libraries need to be added to your project which can be done using Cocoapods. Google provide simple tutorials in setting these libraries up online.


## The First Step: Getting two local devices to communicate
The first step was always going to get two devices to communicate locally. I wanted this to be all triggered by the applications ran in near proximity to any device running the same application. No logging in, no long sign up process, all automatically handled by the application as soon as you take your seat at the event.

My first thought was to look through the Apple Libraries to see if anything would suffice. The framework, [MultipeerConnectivity](https://developer.apple.com/documentation/multipeerconnectivity) very much did what I wanted to a high standard but there was one factor that restricted me using this. I wanted the application to also have the possibility of working together with Android devices. Something that was not possible using this. So from that moment I searched for other options.

I then explored the Google Nearby Messages API. This was perfect for what I needed, offering a way of publishing payloads to subscribers with the cross platform support I was searching for. You can find out more about this API [here](https://developers.google.com/nearby/messages/overview). Using a combination of Bluetooth and near-ultrasonic audio, the library requires Microphone & Bluetooth permissions so I was sure to add these to the applications permission requirements.

When first initialising Google Nearby Messages, you will need to initalise the `GNSMessageManager` with an API Key that you can get from Google. It will also take a parameterBlock with some error handlers for when the required permissions are not correctly configured. You will also have to set the `GNSPermission` to granted once the user has done so. I have chosen to hold these managers in a single manager class. Below you can see the setup being complete in the initialisation of that class.

````swift
override init() {

super.init()

// Enable debug logging to help track down problems.
GNSMessageManager.setDebugLoggingEnabled(false)
GNSPermission.setGranted(true)

// Create the message manager, which lets you publish messages and subscribe to messages
// published by nearby devices.
messageMgr = GNSMessageManager(apiKey: kMyAPIKey,
paramsBlock: {(params: GNSMessageManagerParams?) -> Void in
guard let params = params else { return }

// This is called when microphone permission is enabled or disabled by the user.
params.microphonePermissionErrorHandler = { hasError in
if (hasError) {
print("Nearby works better if microphone use is allowed")
}
}
// This is called when Bluetooth permission is enabled or disabled by the user.
params.bluetoothPermissionErrorHandler = { hasError in
if (hasError) {
print("Nearby works better if Bluetooth use is allowed")
}
}
// This is called when Bluetooth is powered on or off by the user.
params.bluetoothPowerErrorHandler = { hasError in
if (hasError) {
print("Nearby works better if Bluetooth is turned on")
}
}
})
}
````

When the application is first opened the user is provided with the option to be a presenter or an observer. Lets look closer at how we handle these states.

#### The Presenter

When ‘presenter' is selected, the application generates a random id. This ID will be a reference to this event. We then can simply start sharing the event id with local devices running the same application (known using the Google API Key), like below. Currently I’m just sharing a string, but its possible to share JSON objects if required. I simply create a message (`GNSMessage`) using the string’s data and publish it by the messageManager publication function. To stop publishing this message, you must release the publication object.

```swift
func startSharing(withEventId eventId: String) {
stopSharing()
if let messageMgr = self.messageMgr {

// Publish the name to nearby devices.
let pubMessage: GNSMessage = GNSMessage(content: eventId.data(using: .utf8,
allowLossyConversion: true))
publication = messageMgr.publication(with: pubMessage)
print("\(UIDevice.current.name) sent \(eventId)")
}
}
```
### The Observer

The observer works with the same initialisation as the presenter. What it differs in is, instead of creating an event id, it will listen for local devices publishing and set the event ids from any results it finds. Any messages found are then handled in the completion block. Initially I believed this would be sufficient to do all I required, send presentation objects with names and slide numbers where observers could update their data on receiving nearby messages. I found nearby messages to be a little slow and unreliable, some messages would occasionally drop and didn’t seem efficient enough to send each slide update via this API. Because of this, I have added implementation of Firebase. That was required for what would be the next step...

```swift
func subscribeToMessages() {
guard let messageMgr = self.messageMgr else { return }

// Subscribe to messages from nearby devices and display them in the message view.
subscription = messageMgr.subscription(messageFoundHandler: {[unowned self] (message: GNSMessage?) -> Void in

guard let message = message else { return }
let str = String(data: message.content, encoding: .utf8)!

print("\(UIDevice.current.name) recieved \(str)")
self.eventId = str
self.subscribeToFirebase()

}, messageLostHandler: {[unowned self](message: GNSMessage?) -> Void in
guard let message = message else { return }
let str = String(data: message.content, encoding: .utf8)!
print("\(UIDevice.current.name) lost \(str)")
})
}
```

## The Second Step: Real-time updates between the connected devices

Using Firebase is pretty straight forward and pretty powerful. It’s impressively quick and works incredibly well with situations like this. The first step is to setup a reference to the Firebase database. I simply hold a reference to that in my manager class like so and initialise it where required.

```swift
var databaseReference: DatabaseReference!
databaseReference = Database.database().reference()
```

As a Presenter application, we want to update the database with what it is currently displaying. We use the event ID as the tracker so if you want to move to a different slideshow that is also possible. We simply call this method using a delegate overtime the presenter, turns to a different slideshow or name and it will update the database with these properties. Please note; this is with the database set as public meaning anyone can read/write to the database. You can learn more about [Firebase Database Authourization here](https://firebase.google.com/docs/database/security/quickstart?authuser=0)

```swift
//Update Firebase database with current presentation state (for Presenter applications)
func sharePresentationProgressToFirebase(with presentaionName: String, page: String) {

guard self.mode == .present else { return }
self.databaseReference.child(eventId).setValue(["presentationName" : presentaionName, "pageNumber": page])
}
```

##### Example of a Firebase data entry
```
EVENT:NJ8WVJlpdygj1nqhry8aPDZbvkDFiMieuCuD1V3u {
pageNumber: "4";
presentationName: "PresentationExampleName"
}
```


For observers, once the event id is retrieved, we set up observers for the firebase database. The database is handled by application id, (you provide this when setting Firebase up), so all builds of the application will run on the same database. We can then run handlers for every time data is added or changed for that event ID like so. The code below simply displays a delegate which can make your application do what is required. For example this could be, turn the presentation to a new page, fetch a new presentation from an api, etc.

```swift
//Add Firebase Observers and call required changes via the delegate when they are hit
func subscribeToFirebase() {
self.databaseReference.observe(DataEventType.childChanged) { (dataSnapshot) in

if dataSnapshot.key == self.eventId {
let dictionary = dataSnapshot.value  as? [String : AnyObject] ?? [:]
if let pageNumber = dictionary["pageNumber"] as? String {
self.delegate?.slideChanged(manager: self, slideName: pageNumber)
}
}
}

self.databaseReference.observe(DataEventType.childAdded) { (dataSnapshot) in

if dataSnapshot.key == self.eventId {
let dictionary = dataSnapshot.value  as? [String : AnyObject] ?? [:]
if let pageNumber = dictionary["pageNumber"] as? String {
self.delegate?.slideChanged(manager: self, slideName: pageNumber)
}
}
}
}
```
## What's next
I've only recently started exploring the possibilites with these mobile platforms but I've been very impressed. Currently the application I've built only uses a local PDF for testing purposes but it would be really great in the future if we can build a backend where users can upload PDFs and then observers can fetch them from the backend if required & turn to the slide, all triggered by someone else device. There are many more possibilities with this I’m yet to explore but this proof of concept shows that we can use an application in a controlling mode to display and control data on other devices without observer devices having to do anything.


## Code
Check out the github of the project here:
* [Presentation App](https://github.com/nodes-projects/nodes-presenter-ios/tree/PresentationApp_Development)



