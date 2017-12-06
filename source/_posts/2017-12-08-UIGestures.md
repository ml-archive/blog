---
title:  UIGestures
date: 2017-12-08 13:00:00
tags: ios,accelerators,gestures
authorIds:
- roju
categories:
- iOS
---

Gestures are the magic behind those accelerators that can make your app more user friendly. We will show now a few examples on how to implement them in your code.

## [Swipe Gestures](https://developer.apple.com/documentation/uikit/uiswipegesturerecognizer)

You can have many accelerators build with the swipe gesture as it is discrete and you can have many combinations as you can select the direction of the swipe and the number of touches required. Even if we have the possibility to set up a high number of touches, a maximum of 3 is still user friendly. You should also make sure you keep some sort of consistency when defining the gestures, if swipe right with 2 fingers goes to the previous conversation in a messaging app, swiping left with 2 fingers should probably go to the next conversation.

### Using the storyboard

{% vimeo 244338896 %}

1. Search for the swipe gesture in the objects library
2. Drag it into your view controller
3. Set the view of your choice as a delegate to the swipe gesture recognizer (by pressing “Ctrl” on the keyboard and click-drag from the view to the swipe gesture recognizer and selecting Outlet Collections - `gestureRecognizers` )
4. Setup your gesture recogniser by selecting the direction and the number of touches required

{% vimeo 244338890 %}

5. Connect your Swipe Gesture Recognizer to the code by pressing “Ctrl” in your keyboard and click-drag from the gesture recognizer to the ViewController.
6. Chose the connection to be an action, name your action and implement the functionality you would want for this specific gesture. In this example we are simply printing in the console to test it all works well.

{% vimeo 244338872 %}

Remember that your view should be user interaction enabled. You can either do that from code by setting `view.isUserInteractionEnabled = true`, or from the storyboard editor - Attributes Inspector - making sure that the `User Interaction Enabled` is checked.

### Programmatic Swipe Gesture Recognizer

You can also make gesture recognizers fast only from the code as shown below:

```swift
let swipeGestureRecognizer = UISwipeGestureRecognizer(target: self, action: #selector(viewSwipedToLeft))
swipeGestureRecognizer.numberOfTouchesRequired = 2 //The number of fingers required (default is 1)
swipeGestureRecognizer.direction = .left // The direction of the swipe (default is right)
view.addGestureRecognizer(swipeGestureRecognizer)
```

## Other gestures
Besides the one mentioned above you can also take advantage of other gestures like:
### [Tap - UITapGestureRecognizer](https://developer.apple.com/documentation/uikit/uitapgesturerecognizer)
```swift
let tapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(viewTapped))
tapGestureRecognizer.numberOfTapsRequired = 2 // The number of taps required (default is 1)
tapGestureRecognizer.numberOfTouchesRequired = 2 // The number of fingers required (default is 1)
view.addGestureRecognizer(tapGestureRecognizer)
```
### [Pinch - UIPinchGestureRecognizer](https://developer.apple.com/documentation/uikit/uipinchgesturerecognizer)
```swift
let pinchGestureRecognizer = UIPinchGestureRecognizer(target: self, action: #selector(viewPinched))
view.addGestureRecognizer(pinchGestureRecognizer)
// You can get the scale factor relative to the points of the two touches on the screen (pinchGestureRecognizer.scale)
// and the velocity of the pinch in scale factor/second (pinchGestureRecognizer.velocity)
```
### [Rotation UIRotationGestureRecognizer](https://developer.apple.com/documentation/uikit/uirotationgesturerecognizer)
```swift
let rotationGestureRecognizer = UIRotationGestureRecognizer(target: self, action: #selector(viewRotated))
view.addGestureRecognizer(rotationGestureRecognizer)
// You can get the rotation in radians (rotationGestureRecognizer.rotation)
// and the velocity of the rotation in radians/second (rotationGestureRecognizer.velocity)
```
### [Pan (dragging) - UIPanGestureRecognizer](https://developer.apple.com/documentation/uikit/uipangesturerecognizer)
```swift
let panGestureRecognizer = UIPanGestureRecognizer(target: self, action: #selector(viewPanned))
panGestureRecognizer.maximumNumberOfTouches = 2 // Max number of fingers required (default is NSUIntegerMax)
panGestureRecognizer.minimumNumberOfTouches = 2 // Min number of fingers required (default is 1)
view.addGestureRecognizer(panGestureRecognizer)
```
### [Screen edge pan - UIScreenEdgePanGestureRecognizer](https://developer.apple.com/documentation/uikit/uiscreenedgepangesturerecognizer)
```swift
let screenEdgeGestureRecognizer = UIScreenEdgePanGestureRecognizer(target: self, action: #selector(edgePanGestureRecognized))
screenEdgeGestureRecognizer.edges = .left //The acceptable starting edges for the gesture (UIRectEdge)
view.addGestureRecognizer(screenEdgeGestureRecognizer)
```
### [Long press - UILongPressGestureRecognizer](https://developer.apple.com/documentation/uikit/uilongpressgesturerecognizer)
```swift
let longPressGestureRecognizer = UILongPressGestureRecognizer(target: self, action: #selector(longPressRecognized))
longPressGestureRecognizer.minimumPressDuration = 2 //The minimum period fingers must press on the view (in seconds, default is 0.5 seconds)
longPressGestureRecognizer.numberOfTouchesRequired = 2 // The number of fingers that must be pressed on the view (default is 1)
longPressGestureRecognizer.numberOfTapsRequired = 0 // The number of taps required (default is 0)
longPressGestureRecognizer.allowableMovement = 10 // The maximum movement of the fingers on the view measured in points (default is 10 points)
view.addGestureRecognizer(longPressGestureRecognizer)
```

## Links/Resources
* [Apple - Gesture guidelines](https://developer.apple.com/ios/human-interface-guidelines/user-interaction/gestures/)
* [Apple - Handing pinch gestures documentation](https://developer.apple.com/documentation/uikit/touches_presses_and_gestures/handling_uikit_gestures/handling_pinch_gestures)

