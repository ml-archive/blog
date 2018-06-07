# Android WorkManager

## Introduction

`WorkManager` is a new API in Android Architecture Components introduced in the Google I/O 2018. It simplifies and makes it much easier to schedule tasks in background threads. The `WorkManager` can schedule task only if certain conditions you have set is met, which for example can be conditions like available internet/wifi connection or if a charger is connected and it can also schedule tasks to run in a certain order. 
</br> </br>Also a very important note about `WorkManager`: </br> *“WorkManager is intended for tasks that require a guarantee that the system will run them even if the app exits...”* 1


## How to use it

First we have to add the dependency in your `build.gradle` file: </br>
`implementation "android.arch.work:work-runtime:1.0.0-alpha02"`

To demonstrate how to use `WorkManager` we will start by establishing a made-up user story.
In our imaginary app QuickSnapper, we press a shutter button and the app will take a picture and apply some stickers on it and upload it all in one automatic process thanks to the WorkerManager.

So let's split up the user story in 3 use-cases:

- 1 The user takes a photo (We want to compress it here) 
- 2 The app adds weather and location information on the picture after step 1 (GPS and Internet must be available)
- 3 The app uploads the image immediately after step 1-2  (Internet must be available) 


For each use case we will make a `Worker` class which represent a task that we want to run in a background thread.
To do that we need to make a new class and extends `Worker` which requires us to implement a `doWork()` method with a return type of a `WorkerResult`

#### 1) Here is the first Worker Task which compress our photo into a smaller image and returns either WorkerResult.SUCCESS or WorkerResult.FAILURE. 

```java
 class ImageCompressionTask extends Worker {

   private Bitmap bitmap;

   public ImageCompressionTask(Bitmap bitmap) {
       this.bitmap = bitmap;
   }

   @NonNull
   @Override
   public WorkerResult doWork() {
       Bitmap newBitmap;
       try {
           newBitmap = Bitmap.createScaledBitmap(bitmap, 500, 500, false);
           return WorkerResult.SUCCESS;
       } catch (IllegalArgumentException e) {
           return WorkerResult.FAILURE;
       }
   }
}
```


#### 2) The second task is the one which add some weather and location stickers on the image:
```java
class AddStickersTask extends Worker {
   @NonNull
   @Override
   public WorkerResult doWork() {
       return WorkerResult.SUCCESS;
   }
}
```


#### 3) And the last task is the one which upload our image to a server
```java
class UploadImageTask extends Worker {
   @NonNull
   @Override
   public WorkerResult doWork() {
       return WorkerResult.SUCCESS;
   }
}
```


Now we have created 3 `Worker` tasks and want to chain them together so they run after each previous is completed. 

But first we have to add our conditions for our tasks before they can run. To do that the `WorkManager` API provides us with a `Constraints` class which we can use to set different requirements for each Worker Task. 

```java
Constraints constraint = new Constraints
       .Builder()
       .setRequiredNetworkType(NetworkType.CONNECTED)
       .build();
```


GPS requirement is not yet supported in the `Constraints` class but we will instead check for enabled GPS in the `AddStickersTask` and if it’s not enabled we will return `FAILURE` and the next `WorkManager` won’t proceed to the next `Worker`

Then we just create a new instance of our `Worker` classes like the following:
```java
OneTimeWorkRequest imageCompressionTask = new OneTimeWorkRequest.Builder(ImageCompressionTask.class).build();
OneTimeWorkRequest AddStickersTask = new OneTimeWorkRequest.Builder(AddStickersTask.class).setConstraints(constraint).build();
OneTimeWorkRequest UploadImageTask = new OneTimeWorkRequest.Builder(UploadImageTask.class).setConstraints(constraint).build();
WorkManager.getInstance().beginWith(imageCompressionTask).then(AddStickersTask).then(UploadImageTask).enqueue();
```
## When should you use it?
The `WorkManager` is very useful for tasks running in asynchronously background threads and for tasks which need to fulfill certain conditions before they can run or automated tasks running in a certain order.

#### Some example of when WorkingManager also can be really useful

- Uploading data
- Download data
- Bitmap Compression work
- GPS real time location logging.
- Chat apps
- Playlists apps 




Tags: WorkManager, Android, Jetpack, Asynchronous.
