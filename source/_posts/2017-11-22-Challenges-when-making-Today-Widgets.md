---
title:  Challenges when making Today Widgets
date: 2017-22-21 10:10:57
tags: ios,widgets,today,extension
authorIds:
- dori
categories:
- iOS
---

Apple introduced the Today extension in iOS 9, more commonly called widgets.

Apple describes widgets like so:

Widgets give users quick access to information that’s important right now. For example, users open the Today view to check current stock prices or weather conditions, see today’s schedule, or perform a quick task such as marking an item as done. Users tend to open the Today view frequently, and they expect the information they’re interested in to be instantly available.

## Setup

Setting up a Today extension in your iOS app is fairly straight forward. In your xCode project click File->New->Target and select today extension.

Make sure your widget bundle id is not the same as your apps bundle id. So if your apps bundle is “com.yourcompany.yourappname” the widgets bundle id could/should look like this “com.yourcompany.yourappname.widget”

This will create a new target in your app and a new folder. The content of this folder should be familiar with any iOS developer. It contains

1. TodayExtensionViewController.swift
2. Storyboard file
3. Plist
4. Asset catalogue

I like to rename the files from TodayExtension to Widget as that makes more sense to me.

## Widget Creation

Creating the UI for a widget should also be very simple for any developer that has used storyboards and auto-layout before.
Just add the UI elements you wish to use to the storyboard and create the necessary outlets in the ViewController.

This is what the storyboard could look like.

<p align=center>
<img src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/ScreenShot2017-11-22at104935_5ahcPXPuRk.png?width=280 style=";margin:20px;">

## NSWidgetProviding

After you have set up your outlets we need to add some logic to our WidgetViewController. This comes mainly in the form of the NCWidgetProviding delegate. This delegate has 1 method which handles the logic of when to update the widget.

This is what it could look like.

```
extension WidgetViewController: NCWidgetProviding {

    func widgetPerformUpdate(completionHandler: @escaping (NCUpdateResult) -> Void) {
        // Perform any setup necessary in order to update the view.
        // If an error is encountered, use NCUpdateResult.failed
        // If there's no update required, use NCUpdateResult.noData
        // If there's an update, use NCUpdateResult.newData


        // Make sure we have new data for the widget
        guard isRequiredToUpdate else {
            completionHandler(.noData)
            return
        }

        // Update UI
        updateUI() // just a method that updates the widgets labels etc.

        // Return completion handler with new data
        completionHandler(.newData)
    }
}
```
The isRequiredToUpdate is a simple boolean that I use to see whether the widget needs to be updated with new data (see Implementing Widget Data Manager).
If there is no new widget data than we should return the completion handler with .noData. Otherwise if we have new data we should return it with .newData after we have updated the UI.

## Use ViewWillAppear

I like to use ViewWillAppear in the WidgetViewController to manually push an UI update, as I was sometimes having issues with the widget not updating immediately.

```
override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)

    updateUI()
}
```

## Deep Linking

Widgets can even have buttons that for example will launch the app when pressed. This can be achieved very easily with the following line

```
private func didPressButton() {
    guard let url = URL(string: “yourappURL://“) else { return }
    extensionContext?.open(url)
}
```

## Moving Data Between Targets (the slightly challenging part)

There is basically 2 ways to provide widgets with data.

1. Treat them as individual entities, which means they have their own logic to fetch data from a service, update a model and present the UI.

2. More commonly use data that is coming from your iOS target.

The main challenge with widgets is moving existing data across your targets.
Even though an app extension bundle is nested within its containing app’s bundle, the running app extension and containing app have no direct access to each other’s containers.

## App Groups

So how do we move data between the two targets?. The answer is app groups and NSUserDefaults.

To set up app groups for both targets we need to do the following

1. Click on your Xcode iOS target and go to capabilities. Turn on app groups and give it a unique identifier. Also make sure the checkbox is selected. For best practices the identifier should look something like this “group.yourcompany.yourappname”.

2. Repeat step 1 but this time for your widget target. Make sure you use the same app group identifier created above and that its checkmark is also selected.

## Widget Data Manager

I like to create a basic WidgetDataManager that I can use to share my data between targets. Create a new swift file and call it whatever you would like. Make sure that it has both iOS and TodayExtension/Widget selected as its target membership.

The actual logic and coding style is up to you but this is how it could look. Lets imagine our widget only has 1 UILabel for simplicity sake.

```
enum WidgetDataManager {

    private static let userDefaults = UserDefaults(suiteName: “group.yourcompany.yourappname”)

    static var label1Text: String {
        get { return userDefaults?.value(forKey: .label1) as? String ?? "-" }
        set { userDefaults?.setValue(newValue, forKey: .label1) }
    }
}

// MARK: - Keys

private extension String {
    static let label1 = "WidgetLabel1"
}
```

You first need to create a new UserDefault object. As you probably noticed we cannot use the default singleton instance, we have to create a custom suite instance for this to work correctly. The name is what you have set up in your app group.
I than simply added a getter/setter property to set/fetch the latest string from this UserDefault object.

## Implementing Widget Data Manager

Remember the isRequiredToUpdate property from the NSWidgetProviding step above? The actual logic for this boolean would be the following

```
final class WidgetViewController {

    @IBOutlet private weak var label1: UILabel!

    /// Check if update is needed
    private var isRequiredToUpdate: Bool {
        return label1.text != WidgetDataManager.label1Text
    }
}

extension WidgetViewController: NCWidgetProviding {
    …
}
```
I am simply checking if the text of the widgets label(s) matches the data from the WidgetDataManger and if they don’t it means we need to update the widget.

## Update Widget Data Manager

The last step is to make sure that every time you are changing data that is to be displayed in your widget that you update the WidgetDataManager.

For example in a game you might want to show the latest score in the widget. So in your code where you update the score

```
GameDataManager.score = newScore
```

simply update the WidgetDataManager as well.

```
GameDataManager.score = newScore
WidgetDataManager.label1Text = newScore
```

## Full Sample Code

```
final class WidgetViewController {

    // MARK: - Properties

    /// Outlets  
    @IBOutlet private weak var label1: UILabel!

    /// Check if update is needed
    private var isRequiredToUpdate: Bool {
        return label1.text != WidgetDataManager.label1Text
    }

    // MARK: - View Controller Life Cycle

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        updateUI()
    }
}

// MARK: - NC Widget Providing

extension WidgetViewController: NCWidgetProviding {

    func widgetPerformUpdate(completionHandler: @escaping (NCUpdateResult) -> Void) {
        // Perform any setup necessary in order to update the view.
        // If an error is encountered, use NCUpdateResult.failed
        // If there's no update required, use NCUpdateResult.noData
        // If there's an update, use NCUpdateResult.newData


        // Make sure we have new data for the widget
        guard isRequiredToUpdate else {
            completionHandler(.noData)
            return
        }

        // Update UI
        updateUI()

        // Return completion handler with new data
        completionHandler(.newData)
    }
}

// MARK: - Update UI

private extension WidgetViewController {

    func updateUI() {
        label1.text = WidgetDataManager.label1Text
    }
}

```

## Conclusion

Widgets are a great addition to any iOS app. They are very easy to setup and use and most applications should support them in some form or the other.

<p align=center>
<img src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/IMG_02842_4tRqdM5GAQ.jpg?width=280 style=";margin:20px;">


## Resources

* https://developer.apple.com/library/content/documentation/General/Conceptual/ExtensibilityPG/Today.html
* https://www.raywenderlich.com/150953/today-extension-tutorial-getting-started
