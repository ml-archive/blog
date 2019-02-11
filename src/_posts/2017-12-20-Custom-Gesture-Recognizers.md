---
title: Custom Gesture Recognizers
date: 2017-12-20 13:00:00
tags: ios,accelerators,gestures
authorIds:
- roju
categories:
- iOS
---

If you want to implement a gesture that is not already provided by Apple you can customise your own. However, they recommend using the standard gestures because users are already familiar with them, so take some time to consider if a custom gesture is the right way to go. Custom gestures are usually more present in games so those might be a great place to add your creative gesture recognizers.

There are 2 types of custom gesture recognisers you can define yourself:

* **Discrete** - when your gesture involves a specific pattern of events. Examples: recognising a checkmark, a circle or a chevron (see example below). Those are easier to implement than the continuous ones because of the number of states they can have. 
* **Continuous** - when your gesture does not follow a predefined pattern, when you want to gather user input and there are no failure cases. Example: recognising a user’s drawings on a screen. This usually requires a bit more effort to implement.

## Discrete Gesture Recognizer example
For learning purposes we chose a simple example of recognising a right chevron and open the photo library. In real apps, you might want to look into other standard gestures for an accelerator for opening the photo library.

### State machine
Before we get into it we should understand the state machine. This will be a recognizer for a discrete gesture (a specific pattern) so we will look into how we manage transitions for this case only. If you want to learn more about the state machine for continuous gestures you can check out [Apple's documentation](https://developer.apple.com/documentation/uikit/touches_presses_and_gestures/implementing_a_custom_gesture_recognizer/implementing_a_continuous_gesture_recognizer).

A gesture recognizer always starts in the **possible** state, that tells us that we are ready to process events. Based on the user's input we can end up in a **failed** (unsuccessful) state or **ended** (successful) state. You have to check if the user is following your pattern and at any deviation from that you should set the state to failed. If the user did indeed follow the expected pattern, UIKit will call the action method associated to the target object.

We also have the **cancelled** state that occurs when the current event is interrupted by a system event like receiving a phone call. You can also customise the cancel situations that can happen in your app. This is to make sure that we don't perform tasks that the user didn't intend.

It is also important to implement a **reset()** method that will make sure we are ready to process new event sequences by returning to starting values.

<p align=center><img width=50%; src="https://docs-assets.developer.apple.com/published/eedc7ffb40/922db1b2-9860-4618-8226-699b360701b3.png"/></p>

*[Image source](https://developer.apple.com/documentation/uikit/touches_presses_and_gestures/implementing_a_custom_gesture_recognizer/about_the_gesture_recognizer_state_machine)*

### Custom gesture recognizer
The more conditions you have for a gesture to be successful the more precise it will be. For this example we expect that the user will use only one finger for the gesture, makes a down stroke from left to right followed by a down stroke from right to left. Those conditions are leaving open possibilities for edge cases but for the sake of this example we won't look too much into that.

What we have to do is first create the custom gesture recogniser and then add it to our view. 

**1. Making the custom gesture recognizer**

Create a new swift file and import `UIKit` and `UIKit.UIGestureRecognizerSubclass` which is a header file that defines the methods and properties we must override to implement our custom gesture recognizer.

```swift
import UIKit
import UIKit.UIGestureRecognizerSubclass
```
In our case we will have to implement `touchesBegin`, `touchesMoved`, `touchesEnded`, `touchesCancelled` and `reset`.

To keep track of the phase of the chevron we can use an `enum` that we define before the custom gesture recogzizer class. In most cases you would also want to have a `notStarted` and `initialPoint` and then you can define the other phases based on your own gesture recognizer. For the chevron we will have a `rightDownStroke` and a `leftDownStroke`.

```swift
enum SymbolPhase {
    case notStarted
    case initialPoint
    case rightDownStroke
    case leftDownStroke
}
```

Then we start defining our class. We need to declare a `strokePhase` which has an initial state of `notStarted`, an initial touch point, which is zero for now and a `trackedTouch` of type `UITouch`. UITouch is an object that represents the location, size, movement and force of the touch occurring on the screen, and is an important part of our custom festure recognizers.

```swift
// Start of the class
class CustomGestureRecognizer : UIGestureRecognizer {
    var strokePhase : SymbolPhase = .notStarted
    var initialTouchPoint : CGPoint = CGPoint.zero
    var trackedTouch : UITouch? = nil
    //Continue below
 ```
The first function we override is the `touchesBegan`, here we check that we only start our gesture recognizer if there is only a finger on the screen. If there is, then we change the strokePhase to `initialPoint` and we save the location of the tracked touch into our `initialTouchPoint`. 

```swift
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent) {
        super.touchesBegan(touches, with: event)
        if touches.count != 1 {
            self.state = .failed
        }
        // Capture the first touch and store some information about it.
        if self.trackedTouch == nil {
            self.trackedTouch = touches.first
            self.strokePhase = .initialPoint
            self.initialTouchPoint = (self.trackedTouch?.location(in: self.view))!
        } else {
            // Ignore all but the first touch.
            for touch in touches {
                if touch != self.trackedTouch {
                    self.ignore(touch, for: event)
                }
            }
        }
    }
    //Continue below
   ```
Next we implement the `touchesMoved` which holds the main logic of our gesture tracking. We make sure we are only tracking the first touch and we save the new point and the previous point so we can compare them. We know that after the `initialPoint` state we should continue with a `rightDownStroke`, and after the `rightDownStroke` we should have a `leftDownStroke`. So we check in what state we are in and if the stroke followed the rules. If it did, we can continue to the next state. You can already see from the code that every time we have a deviation from the rules the state should be set to `failed`.

```swift
    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent) {
        super.touchesMoved(touches, with: event)
        let newTouch = touches.first
        // There should be only the first touch.
        guard newTouch == self.trackedTouch else {
            self.state = .failed
            return
        }
        let newPoint = (newTouch?.location(in: self.view))!
        let previousPoint = (newTouch?.previousLocation(in: self.view))!
        
        if self.strokePhase == .initialPoint {
            // Make sure the initial movement is down and to the right.
            if newPoint.x >= initialTouchPoint.x && newPoint.y >= initialTouchPoint.y {
                self.strokePhase = .rightDownStroke
            } else {         
                self.state = .failed
            }
        } else if self.strokePhase == .rightDownStroke {
            // Make sure the initial movement is down and to the left.
            if newPoint.y >= previousPoint.y {
                if newPoint.x <= previousPoint.x {
                    self.strokePhase = .leftDownStroke
                }
            }  else {
                self.state = .failed
            }
        }
    }
    //Continue below
```

Then we implement what should happen when the touch ended. We verify that the last stroke phase was `leftDownStroke` and that the final points is below the initial point. If all is good, we set the state to `recogznied`, if not to `failed`.

```swift
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent) {
        super.touchesEnded(touches, with: event)
        let newTouch = touches.first
        // There should be only the first touch.
        guard newTouch == self.trackedTouch else {
            self.state = .failed
            return
        }
        let newPoint = (newTouch?.location(in: self.view))!
        // If the stroke was down up and the final point is
        // below the initial point, the gesture succeeds.
        if self.state == .possible &&
            self.strokePhase == .leftDownStroke &&
            newPoint.y > initialTouchPoint.y {
            self.state = .recognized
        } else {
            self.state = .failed
        }
    }
    //Continue below
 ```
 
 Finally we implement the reset function which sets everything back to initial values so the app can be ready to recognize a new gesture. In the case of a cancelled touch, we reset the values and set the state to `cancelled`.
 
 ```swift
     override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent) {
        super.touchesCancelled(touches, with: event)
        self.state = .cancelled
        reset()
    }
    
    override func reset() {
        super.reset()
        self.initialTouchPoint = CGPoint.zero
        self.strokePhase = .notStarted
        self.trackedTouch = nil
    }
    
  } //End of class
   ```
 
 
**2. Add it to the view**

```swift
view.addGestureRecognizer(CustomGestureRecognizer(target: self, action: #selector(openPhotoLibrary)))
```
<p align=center><img width=40%; src = "https://cdn-laravel.vapor.cloud/image/nstack/translate_values/custom-gesture-simulator_8LPWcpLqKA.gif"/></p>

## Links/Resources
* [Apple - Gesture Recognizer State Machine](https://developer.apple.com/documentation/uikit/touches_presses_and_gestures/implementing_a_custom_gesture_recognizer/about_the_gesture_recognizer_state_machine)
* [Apple - Implementing a Discrete Gesture Recognizer](https://developer.apple.com/documentation/uikit/touches_presses_and_gestures/implementing_a_custom_gesture_recognizer/implementing_a_discrete_gesture_recognizer)
* [Apple - Implementing a Continuous Gesture Recognizer](https://developer.apple.com/documentation/uikit/touches_presses_and_gestures/implementing_a_custom_gesture_recognizer/implementing_a_continuous_gesture_recognizer)
* [Apple - UITouch](https://developer.apple.com/documentation/uikit/uitouch)

If you are looking for more inspiration you might want to check out those other custom gesture recogniser tutorials:
* [Checkmark tutorial from Apple](https://developer.apple.com/documentation/uikit/touches_presses_and_gestures/implementing_a_custom_gesture_recognizer/implementing_a_discrete_gesture_recognizer)
* [Tickle tutorial from raywenderlich.com](https://www.raywenderlich.com/162745/uigesturerecognizer-tutorial-getting-started)
* [Circle tutorial from raywenderlich.com](https://www.raywenderlich.com/104744/uigesturerecognizer-tutorial-creating-custom-recognizers)
