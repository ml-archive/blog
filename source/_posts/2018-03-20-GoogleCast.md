---
title: Google Cast
date: 2018-03-20 10:00:00
tags: ios,google,googlecast
authorIds:
- anho
categories:
- iOS
---
Today, on the App Store, you are able to find a rapidly increasing number of apps that will allow their users to watch video content. There might come a time when you will have to develop such an app, and functionality like Google Cast and AirPlay is not only nice to have, but also expected by the end user.

In this post we will tackle together the steps required in order to allow your users casting videos to a Google Cast device

## Let's get started
In order to be able to solely focus on integrating the Google Cast SDK to our app, I have created a demo project that you can use in order to follow along.

The project containts:

- Added Google Cast SDK via `CocoaPods` [Setup Instructions](https://developers.google.com/cast/docs/ios_sender_setup#xcode_setup)
- An `AVPlayer` that allows users to play video content locally

Furthermore you will need to register your application to Google Cast SDK Developer Console at: https://cast.google.com/publish/#/signup

You can download the demo project here: [Starter Project](https://github.com/nodes-projects/cast-nodes-ios/tree/cast-demo-start)


### Part 1: Connecting to a Google Cast device

To establish a connection with a device we need our app to:

- initialise the `GCKCastContext`
- create a `GCKSessionManager`
- add the `GCKUICastButton`

A recommendable way of achieving this, is to create a `CastManager`, a Singleton instance in our case.

In our manager we now create `func initialise()` where we will do the initial setup. Here we will call `func initialiseContext()` and `createSessionManager()`

Go ahead and declare your `sessionManager`, which will be in charge of handling the connection to a device, and create the functions as follows:

```
private var sessionManager: GCKSessionManager!

func initialise() {
    initialiseContext()
    createSessionManager()
}

//creates the GCKSessionManager
private func createSessionManager() {
    sessionManager = GCKCastContext.sharedInstance().sessionManager
}

//initialises the GCKCastContext
private func initialiseContext() {
    //application Id from the registered application
    let options = GCKCastOptions(discoveryCriteria: GCKDiscoveryCriteria.init(applicationID: "B21B9F3A"))
    GCKCastContext.setSharedInstanceWith(options)
    GCKCastContext.sharedInstance().useDefaultExpandedMediaControls = true
}
```

Now in your AppDelegate's `didFinishLaunchingWithOptions` call  `CastManager.shared.initialise()`

The last thing needed is a `GCKUICastButton`. For this we need to create a `Castable` protocol that contains a `UIBarButtonItem` for our `UINavigationBar`. This will allow us to get the `GCKUICastButton` and add it to our `UINavigationBar` with just one line of code.

```
import UIKit
import GoogleCast

protocol Castable {
    var googleCastBarButton: UIBarButtonItem! { get }
}

extension Castable where Self:UIViewController {
    var googleCastBarButton: UIBarButtonItem! {
        let castButton = GCKUICastButton(frame: CGRect(x: 0, y: 0, width: 24, height: 24))
        castButton.tintColor = .white
        return UIBarButtonItem(customView: castButton)
    }
}

```

Now go to our ViewControllers and add the following line inside `viewDidLoad`:

```
navigationItem.rightBarButtonItems = [googleCastBarButton]
```

You should be able at this stage to run the app and tap the `GCKUICastButton` to connect to a nearby Google Cast device. Just make sure you are on the same network as your device. When connected you should see the `GCKUICastButton` change to its active state.

### Part 2: Listening to `GCKSession` changes

Now that we are able to connect to a device, we need to inform our player that a connection is established and play the video content on the receiving device instead.

The steps required for this process are:

- create an enum called `CastSessionStatus` with possible `GCKSession` states
- add a `GCKSessionManagerListener`
- inform the player about the `GCKSession` changes

First we will create the `CastSessionStatus` enum. Here we will add all posible states for our `GCKSession`.

```
enum CastSessionStatus {
    case started
    case resumed
    case ended
    case failedToStart
    case alreadyConnected
}
```

In your `CastManager` declare a closure called `sessionStatusListener` that will be used to send changes back to the player. In order to initialise this we need to create the following:

```
private var sessionStatusListener: ((CastSessionStatus, String) -> Void)?

func addSessionStatusListener(listener: @escaping (CastSessionStatus, String) -> Void) {
    self.sessionStatusListener = listener
}
```

Inside our `Player` class add the following function and call it in the  `init(frame: CGRect)`:

```
private func listenForCastConnection() {
    let sessionStatusListener: (CastSessionStatus) -> Void = { status in
        print(status)
    }

    CastManager.shared.addSessionStatusListener(listener: sessionStatusListener)
}
```

Here we create the closure and pass it to our `CastManager`. In the next step we will use this to handle the connection states inside the `Player`.

### Part 3: Play video on receiving device

Now that we have an established connection and our player is aware that a connection is established, we can play a `MediaItem` on our receiving device.

To do so we need to cover the following steps:

- create `GCKMediaMetadata`
- create `GCKMediaInformation`
- start video on cast

In our `CastManager` add the following functions that together help create a `GCKMediaInformation`, containing `GCKMediaMetadata`, which will be send to the receiving device.

```
func buildMediaInformation(with title: String, with description: String, with studio: String, with duration: TimeInterval, with movieUrl: String, with streamType: GCKMediaStreamType, with thumbnailUrl: String?) -> GCKMediaInformation {
    let metadata = buildMetadata(with: title, with: description, with: studio, with: thumbnailUrl)

    let mediaInfo = GCKMediaInformation.init(contentID: movieUrl, streamType: streamType, contentType: "video/m3u8", metadata: metadata, streamDuration: duration, mediaTracks: nil, textTrackStyle: nil, customData: nil)

    return mediaInfo
}

private func buildMetadata(with title: String, with description: String, with studio: String, with thumbnailUrl: String?) -> GCKMediaMetadata {
    let metadata = GCKMediaMetadata.init(metadataType: .movie)
    metadata.setString(title, forKey: kGCKMetadataKeyTitle)
    metadata.setString(description, forKey: "description")
    
    let deviceName = sessionManager.currentCastSession?.device.friendlyName ?? studio
    metadata.setString(deviceName, forKey: kGCKMetadataKeyStudio)
    
    if let thumbnailUrl = thumbnailUrl, let url = URL(string: thumbnailUrl) {
        metadata.addImage(GCKImage.init(url: url, width: 720, height: 480))
    }

    return metadata
}
```

Now that we can create a `GCKMediaInformation` we need to create a function that will allow us to start a video on our connected receiver device.

For this add the following function in your `CastManager`:

```
func startSelectedItemRemotely(_ mediaInfo: GCKMediaInformation, at time: TimeInterval, completion: (Bool) -> Void) {
    let castSession = sessionManager.currentCastSession

    if castSession != nil {
        let options = GCKMediaLoadOptions()
        options.playPosition = time
        options.autoplay = true
        castSession?.remoteMediaClient?.loadMedia(mediaInfo, with: options)
        completion(true)

        sessionStatus = .alreadyConnected
    } else {
        completion(false)
    }
}
```

This will take the `GCKMediaInformation` we will create with the previous created functions and, if a cast session is available, load media on the remote client. Once this happens the completion will return true if a cast session exists and false if we can not send a the `GCKMediaInformation` because there is no active cast session at the moment.


Now that we have all the components to start streaming our first video go ahead and update your `listenForCastConnection` function in the `Player` class.

```
private func listenForCastConnection() {
    let sessionStatusListener: (CastSessionStatus) -> Void = { status in
        switch status {
        case .started:
            self.startCastPlay()
        deafult: break
        }
    }

    CastManager.shared.addSessionStatusListener(listener: sessionStatusListener)

}
```

Run your program, go to the `PlayerViewController` and start playing the video. Once the video is playing establish a connection with a cast device and see the video loading on the receiver. At this point our video will load on the receiver but our local player will continue playing the content as well. You guessed it, the fine tuning will be handled in the next part. :)

### Part 4: Tune player

Now that our app is capable of playing content remotely we need to let our local player now that this is happening and stop or start it accordignly.

Once again update your `listenForCastConnection` function in the `Player` class as follow:

```
private func listenForCastConnection() {
    let sessionStatusListener: (CastSessionStatus) -> Void = { status in
    switch status {
        case .started:
            self.startCastPlay()
        case .resumed:
            self.continueCastPlay()
        case .ended, .failedToStart:
            if self.playbackState == .playCast {
                self.playbackState = .pause
                //restart the video on local
            } else if self.playbackState == .pauseCast {
                self.playbackState = .play
                //stop the video on local
            }
        default: break
        }
    }

    CastManager.shared.addSessionStatusListener(listener: sessionStatusListener)
}
```

We will also need to create a few more functions to help us:

- pause the cast session (inside our `CastManager`)
- restart the cast session (inside our `CastManager`)
- play the local video if the cast session gets interruped or ended
- pause the local video if the cast session gets started or resumed

Lets add the functions needed to pause or restart the cast session in our `CastManager`. These will let us play or pause the video playing remotely at any time. As the `startSelectedItemRemotely` function does, the following will as well return true in their completion if the cast session is still active and false if there is no cast session active.

```
// MARK: - Play/Resume

func playSelectedItemRemotely(to time: TimeInterval?, completion: (Bool) -> Void) {
    let castSession = sessionManager.currentCastSession
        if castSession != nil {
            let remoteClient = castSession?.remoteMediaClient
        if let time = time {
            let options = GCKMediaSeekOptions()
            options.interval = time
            options.resumeState = .play
            remoteClient?.seek(with: options)
        } else {
            remoteClient?.play()
        }
        completion(true)
    } else {
        completion(false)
    }
}

// MARK: - Pause

func pauseSelectedItemRemotely(to time: TimeInterval?, completion: (Bool) -> Void) {
    let castSession = sessionManager.currentCastSession
    if castSession != nil {
        let remoteClient = castSession?.remoteMediaClient
        if let time = time {
            let options = GCKMediaSeekOptions()
            options.interval = time
            options.resumeState = .pause
            remoteClient?.seek(with: options)
        } else {
            remoteClient?.pause()
        }
        completion(true)
    } else {
        completion(false)
    }
}
```

### Challenge time!

Now that you have been following along for a while and that you can play/pause/resume video played on a remote session you will need to create some functionality in the `Player` class to handle the switch between the video playing locally and the video playing remotely on a cast session.

In order to do so you will need to stop the local video when a cast session starts, play the local video when a cast session ends, pause the remove video if the pause button is tapped while a session is active and restart the removed video if the play button is tapped when a session is active.

Good luck and do not worry if you don't manage to do so. You can check how this is done in the final version of the project.

### Part 5: Tracking Cast Video progress

Our app is now capable of playing videos both on cast and locally. You might notice though that playing the videos locally make the our `UISlider` and Current time `UILabel` update, but this doesn't happen when we are casting a video.

In order to receive information about the current time of the video casted we need to ask our remote client of the current stream possition. This can be done by calling `approximateStreamPosition()` on the remote client. Go ahead and create a function called `getSessionCurrentTime(completion: (TimeInterval?) -> Void)` which takes a closure parameter of `TimeInterval`, and add it to our `CastManager`.

```
func getSessionCurrentTime(completion: (TimeInterval?) -> Void) {
    let castSession = sessionManager.currentCastSession
    if castSession != nil {
        let remoteClient = castSession?.remoteMediaClient
        let currentTime = remoteClient?.approximateStreamPosition()
        completion(currentTime)
    } else {
        completion(nil)
    }
}
```

Now in our Player we just need to ask our `CastManager` for the session current time and update the slider's possition and the current time `UILabel`.

### Part 6: Adding `GCKUIMiniMediaControlsViewController`

Now that we can control a cast session from the player while we are presenting the `PlayerViewController`, we might also want to control the video playback as well if we have returned to the `FirstViewController`.

This is a quite simple process since most of the functionality is received together with the Google Cast SDK.

We just need to add a `UIView` which will play the role of a container for the `GCKUIMiniMediaControlsViewController` in our `FirstViewController` and add the `GCKUIMiniMediaControlsViewController` to it. As well we can be notified when should display the media controls by implementing the `GCKUIMiniMediaControlsViewControllerDelegate`.

After you have created the container `UIView` add the to it `GCKUIMiniMediaControlsViewController` as follows:

```
private func createMiniMediaControl() {
    let castContext = GCKCastContext.sharedInstance()
    miniMediaControlsViewController = castContext.createMiniMediaControlsViewController()
    miniMediaControlsViewController.delegate = self
    installViewController(miniMediaControlsViewController, inContainerView: mediaControlsContainerView)
}
```

For a more detailed implementation, including of how and when to present the `GCKUIMiniMediaControlsViewController` by animating it on screen you can check the full project.

Run the app, open a video and a cast session and play the video remotely. Now press the back button in the `UINavigationBar` and you should be able to see the `GCKUIMiniMediaControlsViewController` in the bottom of your `FirstViewController`.

### Part 7: Cutomise style of your default castViews

With our app's functionality now completed, we can now start thinking about matching our app's theme with the castViews provided by the SDK.

Since we would like our castViews to use the same pink color that we use all over out app, we can configure all the castViews to do the same by assining our color to the `GCKUIStyle` as follows.

```
private func style() {
    let castStyle = GCKUIStyle.sharedInstance()
    castStyle.castViews.backgroundColor = .white
    castStyle.castViews.bodyTextColor = UIColor.nodesColor
    castStyle.castViews.buttonTextColor = UIColor.nodesColor
    castStyle.castViews.headingTextColor = UIColor.nodesColor
    castStyle.castViews.captionTextColor = UIColor.nodesColor
    castStyle.castViews.iconTintColor = UIColor.nodesColor
    castStyle.apply()
}
```

Alternatively you can customise each castView individually the same way we are customising our miniController.

```
private func miniControllerStyle() {
    let castStyle = GCKUIStyle.sharedInstance()
    castStyle.castViews.mediaControl.miniController.backgroundColor = UIColor.nodesColor
    castStyle.castViews.mediaControl.miniController.bodyTextColor = .white
    castStyle.castViews.mediaControl.miniController.buttonTextColor = .white
    castStyle.castViews.mediaControl.miniController.headingTextColor = .white
    castStyle.castViews.mediaControl.miniController.captionTextColor = .white
    castStyle.castViews.mediaControl.miniController.iconTintColor = .white
    castStyle.apply()
}
```

You can add this functions in your `CastManager` and call them inside the `initialise` and voila, you will have all the cast views matching your app's theme.

To read more about this views you can go to [Google's documentation here](https://developers.google.com/cast/docs/ios_sender_styles)

## Final notes

You have now made it all the way to the end of this post, by the end of which, hopefully you will have a clear picture of how to implement and handle interaction to the Google Cast SDK.

Don't forget to download our final project and compare our results. :)

[Final Project](https://github.com/nodes-projects/cast-nodes-ios/tree/cast-demo-final)

Hope to see you next time!
