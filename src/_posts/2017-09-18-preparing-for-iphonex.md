---
title: Preparing for iPhone X 
date: 2017-09-19 13:00:00
tags: [ios,iphonex,iphone,apple,layout,ui]
categories:
- iOS
authorIds:
- chco
---


# Preparing for iPhone X

iPhone X was announced on September 12, 2017, and with that came a lot of questions about how apps will look and behave with this new phone. We as iOS developers are now accustomed to supporting a variety of screen sizes, but there are still some new challenges to face. 

When the new phone launches in early November, all apps that have not been linked against the iOS 11 SDK will be displayed in a letterboxed layout, so they will continue to function as normal and look the same as they always have. Linking against the iOS 11 SDK enables the full-screen layout, which is when you will want to make sure that your app still looks great on the new screen. 

<p align=center>
<img src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/letterboxPortrait_7xOrDIE9HO.png?width=200 style=";margin:20px;">
<img src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/letterboxLandscape_GDBO2iIboy.png?height=200 style=";margin:20px;"></p>

Note that linking against an older SDK is not a simple process, so if you need more time before optimizing for iPhone X, it would be best to continue working in Xcode 8. Also note that if you develop in Swift, you cannot link to an older SDK in Xcode 9. 



## What to plan for

All but the simplest of apps will likely need some optimization to be displayed properly. Here are some of the most common issues:

<p align=center>
<img align=right src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/fullPortrait_feEUZoUYRr.png?width=150 style="margin:20px;float:right"></p>

#### Rounded corners
Due to the edge-to-edge screen, the corners of applications are now rounded. Important data or UI elements should be inset properly to account for less space in the corners. The top corners will generally be occupied by the new status bar, but if your app has content in the bottom, you will need to pay attention to the corners. 

#### Bottom Indicator
A new swipe indicator now sits at the bottom of the screen. If your app has content there as well, it will be covered by the indicator. 

#### Top status area
The status bar is larger on iPhone X than other phones, so ensure that your app is not relying on a hardcoded status bar size. Also, if you present custom views that do not have default UINavigationBars, your fullscreen content will likely be cut off by the status bar area. 

#### Landscape support
If your app supports landscape orientation, you will notice that your app tends to be cut off by the notch area, and possibly not extend all the way to the other side of the screen. 

<p align=center>
<img src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/fullscreenPortrait_C5LfF0zicC.png?width=200 style="margin:20px;">
<img src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/fullscreenLandscape_HGYRbZ5q81.png?height=200 style="margin:20px;"></p>

### Enter Safe Area Layout Guide
You can solve all of the above issues by adhering to margins and the new "Safe Area" layout guides in autolayout. If your content was previously constrained to `superview`, it should now be constrained to `safeAreaLayoutGuide`. The safe area layout guide is essentially the rectangle of space that does not interfere with any of the corners or indicators. 

<p align=center>
<img src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/fixedMain_zoBzp8sQl9.png?width=200 style="margin:20px;">
<img src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/fixedDetail_r47iRUBbKM.png?width=200 style="margin:20px;"></p>

**Note:** Safe area layout guide is a new feature of iOS 11. Apps targeting older versions of iOS will still use the top and bottom layout guides. Storyboards are backwards compatible and can support safe areas in older iOS versions, *however*, this only extends to iOS 9. If your app supports versions older than 9.0, you can not use safe areas in Storyboards. 


### Other issues

- Custom toolbars, fake navigation bars, and similar elements will need to be updated so that their layout matches the behavior of the native elements. 

- The safe area layout guides define a sub-rectangle within the screen, so you will need to ensure that backgrounds extend beyond the safe area, otherwise you will have empty white space around your app. In the above example, the Details top bar had to be extended so that it fills out the status bar area.

- Full screen images will need letterboxing, pillarboxing, or cropping to fit properly in the new aspect ratio. 

#### A note about Face ID
This is not layout related, but the new Face ID feature will work right away the same as Touch ID does. Face ID is included in the `deviceOwnerAuthenticationWithBiometrics` authentication policy, so no code change is required. 

If your app needs to be aware of specifically which authentication method is being used, there is a new `LABiometryType` enum. 
