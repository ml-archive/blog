---
title:  Haptic Feedback makes you vibrate!
date: 2017-04-10 10:10:57
tags: ios,haptic,feedback,vibrate
authorIds: 
- maco
categories:
- iOS
---

The iPhone could vibrate ever since it was launched. And so did almost all the other phones, even from before smartphones were a thing. But Apple took this function further than anyone else, by introducing the Taptic Engine in the Apple Watch, and afterwards in many other products, like the new MacBooks and iPhones. The Taptic Engine provides haptic feedback, more similar to real-life touches than standard vibration.

Together with iOS 10, Apple introduced an API for the Taptic Engine, which the developers can use to give haptic feedback to their users. To fully experience the haptic feedback you need an iPhone 7, 7 Plus or newer. Even though the API is introduced in iOS 10, it's only the iPhone 7 and iPhone 7 Plus that support this. On all previous devices, nothing happens when you try to do that. 

## How to create haptic feedback

Using the new API is super easy. With the `UIFeedbackGenerator` you can create haptic feedback with only two lines of code. 

There are 7 different types of haptic feedback a developer can use. The only difference between those 7 types of feedback is the vibration pattern. Some of them are subtle, like the selection change, and others are more powerful, like the notification error. 

The `UIFeedbackGenerator` has 3 subclasses, `UISelectionFeedbackGenerator`, `UIImpactFeedbackGenerator` and `UINotificationFeedbackGenerator`, and those are the ones a developer should work with. We will showing how to use them further below.

Due to the inherent difficulties of showing vibrations through a blog post, we are using the official videos of each type of feedback from Apple's Human Interface Guidelines. You can also run the code [from this repo](https://github.com/mariusc/Vibrate) on your iPhone 7 or iPhone 7 Plus to try it out.

### Selection

This one can be used when the user has to select from multiple discrete values, as he/she scrolls through them. For example, it's used in the `UIPickerView`. It feels like a light tap with each selection change. This is not to be used for example when selecting one of 4 radio button choices.

<video width="400" controls>
  <source src="http://nodesmanager.io/haptic/selection.mp4" type="video/mp4">
  Your browser does not support HTML5 video.
</video>

```swift
let selectionFeedbackGenerator = UISelectionFeedbackGenerator()
selectionFeedbackGenerator.selectionChanged()
```

### Impact

The impact type of feedback is to be used to enhance a visual experience. For example, it can be used in a game when a collision occurs. I couldn't find this documented, but I'm almost sure that Impact - heavy is the type of feedback that the user feels when a peeked view pops full screen.

**Light**

<video width="400" controls>
  <source src="http://nodesmanager.io/haptic/impact_light.mp4" type="video/mp4">
  Your browser does not support HTML5 video.
</video>


```swift
let lightImpactFeedbackGenerator = UIImpactFeedbackGenerator(style: .light)
lightImpactFeedbackGenerator.impactOccurred()
```

**Medium**

<video width="400" controls>
  <source src="http://nodesmanager.io/haptic/impact_medium.mp4" type="video/mp4">
  Your browser does not support HTML5 video.
</video>

```swift
let mediumImpactFeedbackGenerator = UIImpactFeedbackGenerator(style: .medium)
mediumImpactFeedbackGenerator.impactOccurred()
```

**Heavy**

<video width="400" controls>
  <source src="http://nodesmanager.io/haptic/impact_heavy.mp4" type="video/mp4">
  Your browser does not support HTML5 video.
</video>

```swift
let heavyImpactFeedbackGenerator = UIImpactFeedbackGenerator(style: .heavy)
heavyImpactFeedbackGenerator.impactOccurred()

```

### Notification

The notification type of feedback should be used to indicate to the user that a task has completed. Depending on the outcome of the task (success, error, warning), the feedback pattern differs.

**Success**

<video width="400" controls>
  <source src="http://nodesmanager.io/haptic/success.mp4" type="video/mp4">
  Your browser does not support HTML5 video.
</video>

```swift
let successNotificationFeedbackGenerator = UINotificationFeedbackGenerator()
successNotificationFeedbackGenerator.notificationOccurred(.success)
```

**Warning**

<video width="400" controls>
  <source src="http://nodesmanager.io/haptic/warning.mp4" type="video/mp4">
  Your browser does not support HTML5 video.
</video>

```swift
let warningNotificationFeedbackGenerator = UINotificationFeedbackGenerator()
warningNotificationFeedbackGenerator.notificationOccurred(.warning)
```

**Failure**

<video width="400" controls>
  <source src="http://nodesmanager.io/haptic/error.mp4" type="video/mp4">
  Your browser does not support HTML5 video.
</video>

```swift
let errorNotificationFeedbackGenerator = UINotificationFeedbackGenerator()
errorNotificationFeedbackGenerator.notificationOccurred(.error)
```


Using the `UIFeedbackGenerator` may have a little latency. If you want to use it to match some sound or visual effects, you can call the `prepare()` method on the generator to put the Taptic Engine in a prepared state and reduce the latency. It will stay prepared a few seconds, or until the next feedback is triggered.


## When to use haptic feedback

We saw that creating haptic feedback is super easy. However, the complicated part is knowing when and where to use it.

As usual, Apple helps with this, by adding a section on it to the [Human Interface Guidelines](https://developer.apple.com/ios/human-interface-guidelines/interaction/feedback/). And we can also learn a lot by looking at where the haptic feedback is used across iOS. 

We all know by now that the Home button isn't an actual button anymore, it's just some very smartly done and well-placed haptic feedback. But that specific pattern doesn't come by default with the new `UIFeedbackGenerator`. Other parts of iOS though use the exact types of feedback that the developers can access through the new APIs. 

For example, when you set an alarm or a timer, you'll notice a light tap whenever the selected time changes. Or when you type, and you hold down a letter on the keyboard to get to the various accents, the same light tap will inform you when you selected a different character.

Some controls, such as the `UIRefreshControl` have the feedback built in, and you will feel a small "knock" when you pull to refresh a scroll view. Same for zooming in or out a `UIScrollView` - zooming too much (either in or out) will also create a "knock".

If you dig deeper, you'll find even more creative use cases of the haptic feedback. For example, sending or viewing an iMessage with fireworks effects will send create "thuds" for every exploding firework.

To do haptic feedback right, you need to use it together with some animation or sound effects. Haptic feedback alone will probably feel out of place most of the time. Imagine getting a `UINotificationFeedbackType.error` feedback when you show an alert saying that the password you entered is wrong. That would be weird. 

The Taptic Engine, together with the haptic feedback API has huge potential, and we are looking forward to seeing more creative usages of it.

### Resources
* [iOS Human Interface Guidelines](https://developer.apple.com/ios/human-interface-guidelines/interaction/feedback/)
* [UIFeedbackGenerator API Reference](https://developer.apple.com/reference/uikit/uifeedbackgenerator)
* [Demo project](https://github.com/mariusc/Vibrate)
