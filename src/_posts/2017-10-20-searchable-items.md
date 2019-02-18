---
title: Searchable Items
date: 2017-10-20 16:00:00
tags: [corespotlight,nsuseractivity,searchable,spotlight]
categories:
- iOS
authorIds:
- jmje
---

## Motivation
App search has been here since iOS9. This feature seems to go largely unused. Maybe this is because both developers and people selling features have forgotten it exists. This is a quick guide for less technical people, and a semi quick guide for developers.
## What you need to know (TL;DR for everyone)

* #### An app can index content in your app, such that it will show up in search results when the user searches in spotlight
  * Content in the app can either be indexed by user activity (e.g. opening an article or detail page of a contact), by indexing fetched data (e.g. a newsfeed), or combining the two.

  * For an app that has a web counterpart it is possible to add markup to the website, such that the marked items may show up in Spotlight on your phone. This in conjunction with Universal Links, can add the ability to deep link to content in your app without ever having opened the app or manually indexed any content (Not described further here)
  * There are several ways of displaying these search results e.g. they can come with a call button if you're displaying an entity that has a phone number (e.g. people)
  * Items can be deleted again from index or be set to expire. They expire after one month per default.
  * When user taps search results appropriate action should be taken, which usually means taking the user to the detail view of the object displayed in the search. This navigation has to be manually implemented, but can likely be reused for deep linking from pushes.
* #### Real world examples:

  * Making favorite employees searchable when favoriting -> Clicking employee in Spotlight search takes user to Employee detail view

  * Indexing the main feed to make items searchable and deep link to detail page

  * Making an article searchable when opening detail view from list -> Clicking article in spotlight search takes user to the article (Called UserActivity)
    * This use case comes with handoff to web almost for free, provided the app has the URL to the content. This means that if you have the article open on your phone, you can continue reading on your mac

    <p align=center>
    <img src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/SimulatorScreenShot-iPhoneX-2017-10-31at102233_clWkOWGxvQ.png?width=180 style=";margin:20px;">
    <img src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/SimulatorScreenShot-iPhoneX-2017-10-31at103135_WElQkNH0XO.png?width=180 style=";margin:20px;">
    <img src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/SimulatorScreenShot-iPhoneX-2017-10-31at103934_YrsevZcwRv.png?width=180 style=";margin:20px;">


## Implementation details

#### Indexing data without user interaction (CSSearchableItem)

1. Make CSSearchableAttributeSet. I did it in an extension to the entity I wanted to make searchable to have data on hand.
```
extension MySearchableStruct {
    public var attributeSet: CSSearchableItemAttributeSet {

       let attributeSet = CSSearchableItemAttributeSet(
           itemContentType: kUTTypeText as String)
       attributeSet.title = name
       attributeSet.contentDescription = abstract
       attributeSet.keywords = [ticker, name, description]
       return attributeSet
   }
}
```
2. Make Domain identifier. This makes it possible to wipe a whole type of entries at once.

```
extension MySearchableStruct {
  public static let domainIdentifier = "com.TheCompany.TheApp.MySearchableStruct"
}
```
3. Make a unique identifier for the searchableItem. This is used for getting the exact item if you need to deep link or delete it again. I also put this in the extension

```
extension MySearchableStruct {
  public var uniqueSearchIdentifier: String {
    return MySearchableStruct.domainIdentifier + ":" + String(identifier)
  }
}
```
4. Index your data. Done by creating a CSSearchableItem and adding it to index, like so:
```
 let item = CSSearchableItem(uniqueIdentifier: mySearchableStructInstance.uniqueSearchIdentifier,
   domainIdentifier: MySearchableStruct.domainIdentifier,
   attributeSet: mySearchableStructInstance.attributeSet)

CSSearchableIndex.default().indexSearchableItems([item], completionHandler: nil)
```
5. Remember to set thumbnailData for your CSSearchableItemAttributeSet if you have a specific image for the entity you're making searchable. If you are loading image data asynchronously, it seems you need to wait until data is done loading to add the item to the index. I had to add multiple at once, this is a full implementation using DispatchGroup:
```
func addItemsToIndex(dataItems: [MySearchableStruct]) {

        let group = DispatchGroup()
        var searchableItems = [CSSearchableItem]()

        for dataItem in dataItems {

            group.enter()

            let attributeSet = dataItem.attributeSet
            let searchableItem = CSSearchableItem(uniqueIdentifier: dataItem.uniqueSearchIdentifier,
                                                  domainIdentifier: MySearchableStruct.domainIdentifier,
                                                  attributeSet: attributeSet)
            searchableItems.append(item)

            // Load the image data in the background
            DispatchQueue.global(qos: .background).async {

                let data = imageData(fromUrlString: dataItem.thumbnailUrlString)

                DispatchQueue.main.async {

                    // Set the image data and notify DispatchGroup
                    attributeSet.thumbnailData = data
                    group.leave()

                }
            }
        }

        // When all images have loaded add all searchable items to index
        group.notify(queue: .global()) {
            CSSearchableIndex.default().indexSearchableItems(searchableItems, completionHandler: nil)
        }
    }
   ```
```
// Helper image data method

func imageData(fromUrlString urlString: String) -> Data? {
   if let url = URL(string: urlString) {
       do {
           let data = try Data.init(contentsOf: url)
           return data
       } catch {
           return nil
       }

   }
   return nil
}
```
  #### Indexing data from user activity

  1. Again in an extension to the data item make a NSUserActivity. Make sure isEligibleForSearch is set to true.

  * contentAttributeSet is the attributeSet variable already created in the extension from before.

  * **Only** set the relatedUniqueIdentifier for the attributeSet **if you already indexed the item e.g. from the feed api call**. Otherwise the userActivity won't be indexed. The relatedUniqueIdentifier is to avoid duplicates when using both the CSSearchableIndex api and NSUserActivity
  * webpageURL is for handoff to other devices
  * userInfo is for deeplinking to the desired object

  ```
  extension MySearchableStruct {
      public var userActivity: NSUserActivity {
          let activity = NSUserActivity(activityType: MySearchableStruct.domainIdentifier)
          activity.title = name
          activity.userInfo = ["id": someUniqueIdentifierOfTheDataEntity]
          activity.keywords = [ticker]
          activity.isEligibleForSearch = true
          activity.contentAttributeSet = attributeSet
          activity.webpageURL = websiteLink.flatMap({ URL(string: $0) })
          activity.contentAttributeSet = attributeSet
          activity.contentAttributeSet?.relatedUniqueIdentifier = uniqueSearchIdentifier
          return activity
      }
  }
  ```
  2. To get the activity indexed your activity needs to 'become current'. Would happen e.g. when showing the detail view for an entity. This happens in either of two ways. If you have your data object on hand in your UIViewController or another class that inherits from UIResponder, the instance has a variable 'userActivity'. Set it like so:
  ```
  userActivity = myDataItemInstance.userActivity
  ```
  The item is now searchable
  If you don't have a UIResponder at hand you need to make a userActivity variable yourself, as a strong reference is needed to add the activity to the indexed
  ```
  var userActivity: NSUserActivity?
  ```
  And when showing the data in your view:
  ```
  self.userActivity = mySearchableItemInstance.userActivity
  self.userActivity.becomeCurrent()
  ```
  The item is now searchable and as a bonus handoff is now also activated for the item.
  Remember to make the activity resign current to turn off handoff for the item when leaving the detail view:
  ```
  self.userActivity?.resignCurrent()
  ```
  #### Implement callback for click on searchable item in Spotlight

1. Searchable item clicks are caught in the AppDelegate, in the continueUserActivity callback.
*  Items that were indexed without user interaction have the userActivity type CSSearchableItemActionType. To get the uniqueSearchIdentifier of the CSSearchableItemActionType, access the dictionary userActivity.userInfo with key `CSSearchableItemActivityIdentifier`

* NSUserActivity has the type it was init'ed with, which in this case was `MySearchableStruct.domainIdentifier`. To get the uniqueSearchIdentifier of the userActivity, look in the userInfo dictionary with the key for the identifier for the UserActivity created earlier, in this case 'id'
```
func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([Any]?) -> Void) -> Bool {

        switch userActivity.activityType {
        case CSSearchableItemActionType:

            guard let identifier = userActivity.userInfo?[CSSearchableItemActivityIdentifier] as? String,
                identifier.contains(":"), let type = identifier.split(separator: ":").first,
                let id = identifier.split(separator: ":").last,
                type != id else { return false }

            switch String(type) {

            case MySearchableStruct.domainIdentifier:
                showDetail(forItemWith: Int(id))
                return true
            default:
                return false
            }

        case MySearchableStruct.domainIdentifier:

            if let id = userActivity.userInfo?["id"] as? Int {    
                showDetail(forItemWith: Int(id))
                return true
            }

        default:
            return false
        }
        return false
    }
```

## Links

[App search guide by Ray Wenderlich](https://www.raywenderlich.com/116608/ios-9-app-search-tutorial-introduction-to-app-search)

[Apple documentation](https://developer.apple.com/library/content/documentation/General/Conceptual/AppSearch/index.html#//apple_ref/doc/uid/TP40016308-CH4-SW1)


[Hacking with Swift search tutorial](https://www.hackingwithswift.com/read/32/4/how-to-add-core-spotlight-to-index-your-app-content)
