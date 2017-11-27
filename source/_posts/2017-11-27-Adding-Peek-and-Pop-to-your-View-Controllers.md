---
title:  Adding Peek and Pop to your View Controllers
date: 2017-11-22 10:10:57
tags: ios,peek,pop,3dtouch,forceTouchCapability
authorIds:
- dori
categories:
- iOS
---

With iOS 9, new iPhone models add a third dimension to the user interface.

A user can now press your Home screen icon to immediately access functionality provided by your app.
Within your app, a user can now press views to see previews of additional content and gain accelerated access to features.

## Peek and Pop

iOS 9 lets you configure view controllers for the user features of peek, which provides a preview of additional content when a user presses on a specified view, and pop, which commits to viewing that content and navigates to it.

This interaction proceeds through three phases.

1. Indication that content preview is available
2. Display of the preview—known as a peek—with options to act on it directly—known as peek quick actions
3. Optional navigation to the view shown in the preview—known as a pop

## Setup

Lets imagine that we have 2 `UIViewControllers` in our app. One has a `UICollectionView` as its main UI, for example to show a list of images, we shall call it ImageViewController. The 2nd one is a detail view controller that will be presented if one of the images is pressed. This should a very common scenario in most apps.

If we want to use Peek and Pop we first have to check wether 3D touch is supported and if it is, register the previewing delegate.

```
class ImageViewController: UIViewController {

  override func viewDidLoad() {
      super.viewDidLoad()

      // Do your usual setup
      ...

      // Register peek and pop if available
      guard traitCollection.forceTouchCapability == .available else { return }
      registerForPreviewing(with: self, sourceView: view)
    }   
}
```

## Implement The Delegate

Next we need to implement the above registered delegate, called `UIViewControllerPreviewingDelegate`. This delegate has 2 methods, 1 for peeking and 1 for popping.

```
class ImageViewController: UIViewController {
    ...
}

// MARK: - UI View Controller Previewing Delegate

extension ImageViewController: UIViewControllerPreviewingDelegate {

    /// Peek
    func previewingContext(_ previewingContext: UIViewControllerPreviewing, viewControllerForLocation location: CGPoint) -> UIViewController? {

      // Get the index path of the cell we are force touching on
      guard let indexPath = collectionView.indexPathForItem(at: location) else { return nil }

      // Get the actual cell instance for the index path
      guard let cell = collectionView.cellForItem(at: indexPath) else { return nil }

      // Instantiate the detail view controller
      guard let detailVC = storyboard?.instantiateViewController(withIdentifier: "DetailViewController") as? DetailViewController else { return nil }

      // Update the detail view controllers data source
      let image = images[indexPath.row]
      detailVC.image = image

      // Set the content size for the detail view controller when peeking
      detailVC.preferredContentSize = CGSize(width: 0, height: 300)

      // Set the source rect of the previewing context
      previewingContext.sourceRect = cell.frame

      // Return the view controller for peeking
      return detailVC
    }

    /// Pop
    func previewingContext(_ previewingContext: UIViewControllerPreviewing, commit viewControllerToCommit: UIViewController) {
        showViewController(viewControllerToCommit, sender: self)
    }
}
```

For peeking the logic is almost similar to using Segues. We need to get a reference to the cell we are touching and instantiate the DetailViewController and update its data source. We also need to set a preferred content size of the detail view controller and finally we need to set the sourceRect of the previewing context to the frame of the cell we are touching.

Popping on the other hand is very straightforward, simply show the view controller that your are peeking at.

## Previewing Actions

If you now run your app and you force touch on an image you should be able to get a preview of the detail view controller.

<p align=center>
<img src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/peek-pop_PgLJZtnHgg.jpg?width=280 style=";margin:20px;">


At this stage we can also add some custom button actions to this view, for example a like or delete action. This allows a user to do some action in the DetailViewController while peeking without actually navigating to the ViewController.

Implementation of these actions are also very easy. Go to your DetailViewController and add your actions. Its quite similar to using `UIAlertController`.


```
class DetailViewController: UIViewController {
    ...
}

// MARK: - UI Preview Action Items

extension DetailViewController {

      override var previewActionItems: [UIPreviewActionItem] {

          let likeAction = UIPreviewAction(title: "Like", style: .default) { (action, viewController) in
              // add some like logic
            }

          let deleteAction = UIPreviewAction(title: "Delete", style: .destructive) { (action, viewController) in
              // add some delete logic
          }

          return [likeAction, deleteAction]
      }
}
```

<p align=center>
<img src=https://cdn-laravel.vapor.cloud/image/nstack/translate_values/peek-previewaction-2_uG9NQSv7Pg.jpg?width=280 style=";margin:20px;">

## Conclusion

That is all there is to peek and pop. Its a very powerful feature that should dramatically improve the flow of an app that implements it. It allows you to use the app in such a way where you can get glances and previews of screens without having to actually navigate those screens. This should make any app more productive, efficient and thus is a feature that should be supported by all app makers.

## Resources

* https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/Adopting3DTouchOniPhone/3DTouchAPIs.html#//apple_ref/doc/uid/TP40016543-CH4-SW1
* https://the-nerd.be/2015/10/06/3d-touch-peek-and-pop-tutorial/
