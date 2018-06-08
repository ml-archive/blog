# Android WorkManager

## Introduction

`WorkManager` is a new API in Android Architecture Components introduced in the Google I/O 2018. It simplifies and makes it much easier to do work on background threads. The `WorkManager` schedules tasks as instances of the `Worker` class and can schedule these workers based on certain conditions which you can set by using the provided The `Constraints` class. Examples of conditions you can set from the `Constraints` class, can be things like available internet/wifi connection or if a charger is connected. The `WorkManager` can also schedule all `Worker` instance to launch in any order and pass data from one `Worker` to another `Worker` via its `inputData` and `outputData` objects.
</br>
</br>Also a very important note about [`WorkManager`](https://developer.android.com/topic/libraries/architecture/workmanager): </br> *“WorkManager is intended for tasks that require a guarantee that the system will run them even if the app exits...”*


## How to use it

First you have to add the dependency in your `build.gradle` file: </br>
`implementation "android.arch.work:work-runtime:1.0.0-alpha02"`

### User story 

To demonstrate how to use `WorkManager` we will start by establishing a made-up user story.
In our imaginary app QuickSnapper, we press a shutter button and the app will take a picture and apply some stickers on it and upload it all in one automatic process thanks to the WorkerManager.

So let's split up the user story in 3 use cases:

- 1 The user takes a photo (We want to compress it here) 
- 2 The app adds weather and location information on the picture after step 1 (GPS and Internet must be available)
- 3 The app uploads the image immediately after step 1-2  (Internet must be available) 


For each use case we will make a `Worker` class. To do that we need to make a class and extend `Worker` which requires us to implement a `doWork()` method with a return type of a `WorkerResult` that can either be `WorkerResult.SUCCESS` or `WorkerResult.FAILURE`

### Creating Workers

#### 1) The first Worker compress our Bitmap into a smaller size, convert the Bitmap to ByteArray passes it in the WorkManager's outputData object and then we return WorkerResult.SUCCESS or WorkerResult.FAILURE.

```kotlin
    class ImageCompressionTask(val bitmap: Bitmap?) : Worker() {
        override fun doWork(): WorkerResult {
            val newBitmap: Bitmap?
            try {
                //Create a compressed bitmap
                newBitmap = Bitmap.createScaledBitmap(bitmap, 500, 500, false)
                //Save it to the WorkManager's outPutData
                outputData = Data.fromByteArray(getBitmapByteArray(newBitmap))
                return WorkerResult.SUCCESS
            } catch (e: IllegalArgumentException) {
                return WorkerResult.FAILURE
            }
        }

        fun getBitmapByteArray(bitmap: Bitmap?): ByteArray {
            val outputByteArray = ByteArrayOutputStream()
            bitmap?.compress(Bitmap.CompressFormat.PNG, 0, outputByteArray)
            return outputByteArray.toByteArray()
        }
    }
```


#### 2) In the second Worker we retrive the Bitmap from the Workers inputData object and adds some weather and location stickers on the image
```kotlin
    class AddStickersTask : Worker() {
        override fun doWork(): WorkerResult {
            try {
                val bitmapByteArray = Data.toByteArray(inputData)
                val bitmap = BitmapFactory.decodeStream(ByteArrayInputStream(bitmapByteArray))
                //Adding stickers on the bitmap...
                outputData = Data.fromByteArray(getBitmapByteArray(bitmap))
                return WorkerResult.SUCCESS
            } catch (e: Exception) {
                return WorkerResult.FAILURE
            }
        }

        fun getBitmapByteArray(bitmap: Bitmap?): ByteArray {
            val outputByteArray = ByteArrayOutputStream()
            bitmap?.compress(Bitmap.CompressFormat.PNG, 0, outputByteArray)
            return outputByteArray.toByteArray()
        }
    }
```


#### 3) In the last Worker we just upload our Bitmap to our server
```kotlin
    class UploadImageTask : Worker() {
        override fun doWork(): WorkerResult {
            //Retrive bitmap and upload work here
            return WorkerResult.SUCCESS
        }
    }
```

### Creating Constraints for workers

Now we have created 3 `Worker` classes and can chain them together so they run when each previous `Worker` has returned `WorkerResult.SUCCESS`. The `WorkManager` won't proceed if any of the `Worker` instances returns `WorkerResult.FAILURE`.

But first we have to make our `Constraints` for our `Worker` instances, so the `Worker` only runs if the conditions we have set in the `Constraints` class is met. 

```kotlin
val constraint = Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build()
```


GPS requirement is not yet supported in the `Constraints` class but we will instead check for enabled GPS in the `AddStickersTask` and if it’s not enabled we will return `FAILURE` and the next `WorkManager` won’t proceed to the next `Worker`

### Putting everything together 

Now lets create new instances of our 3 `Worker` classes: 

```kotlin
val imageCompressionTask = OneTimeWorkRequest.Builder(ImageCompressionTask::class.java).build()
val addStickersTask = OneTimeWorkRequest.Builder(AddStickersTask::class.java).setConstraints(constraint).build()
val uploadImageTask = OneTimeWorkRequest.Builder(UploadImageTask::class.java).setConstraints(constraint).build()
```

We make them as `OneTimeWorkRequest` because we only want these `Worker` to execute once. `PeriodicWorkRequest` can be used in cases where you want a `Worker` for some repetitive work which can run in intervals you can set.

Now we feed our `WorkManager` with our `Worker` instances in the order as described in our user story and we done!

```kotlin
WorkManager.getInstance().beginWith(imageCompressionTask).then(addStickersTask).then(uploadImageTask).enqueue()
```

## When should you use it?
The `WorkManager` is very useful for tasks running in background threads and for tasks which need to fulfill certain conditions before they can run or automated tasks running in a certain order.

#### Some example of when WorkingManager also can be really useful

- Uploading data
- Download data
- Bitmap Compression work
- GPS location logging.
- Chat apps
- Playlists apps
- Repetitive work that needs to run on background threads 


### Links

A more detailed and advanced tutorial on how to work with WorkMananger from Google:
https://codelabs.developers.google.com/codelabs/android-workmanager/#0

More about WorkManager:
</br>
https://developer.android.com/topic/libraries/architecture/workmanager



<sub>Tags: WorkManager, Android, Jetpack, Asynchronous.</sub>
