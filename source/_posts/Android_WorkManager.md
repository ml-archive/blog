# Android WorkManager

## Introduction

`WorkManager` is a new API in Android Architecture Components introduced in the Google I/O 2018. It simplifies and makes it much easier to do work on background threads. The `WorkManager` schedules tasks as instances of the `Worker` class. It can schedule these workers based on certain conditions which you can set by using the provided `Constraints` class. Examples of conditions you can set from `Constraints` class can be things like available internet/wifi connection or if a charger is connected. The `WorkManager` can also schedule all `Worker` instance you have to launch in any order you wish.

</br> </br>Also a very important note about `WorkManager`: </br> *“WorkManager is intended for tasks that require a guarantee that the system will run them even if the app exits...”* 1


## How to use it

First you have to add the dependency in your `build.gradle` file: </br>
`implementation "android.arch.work:work-runtime:1.0.0-alpha02"`

To demonstrate how to use `WorkManager` we will start by establishing a made-up user story.
In our imaginary app QuickSnapper, we press a shutter button and the app will take a picture and apply some stickers on it and upload it all in one automatic process thanks to the WorkerManager.

So let's split up the user story in 3 use cases:

- 1 The user takes a photo (We want to compress it here) 
- 2 The app adds weather and location information on the picture after step 1 (GPS and Internet must be available)
- 3 The app uploads the image immediately after step 1-2  (Internet must be available) 


For each use case we will make a `Worker` class. To do that we need to make a class and extend `Worker` which requires us to implement a `doWork()` method with a return type of a `WorkerResult` that can either be `WorkerResult.SUCCESS` or `WorkerResult.FAILURE`

#### 1) Here is the first Worker which compress our image into a smaller size and returns either WorkerResult.SUCCESS or WorkerResult.FAILURE. 

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


#### 2) The second Worker is the one which add some weather and location stickers on the image:
```java
class AddStickersTask extends Worker {
   @NonNull
   @Override
   public WorkerResult doWork() {
       if(IsGpsEnabled()){
       return WorkerResult.SUCCESS;
       }else{
        WorkerResult.FAILURE
       }
   }
}
```


#### 3) And the last Worker is the one which upload our image to a server
```java
class UploadImageTask extends Worker {
   @NonNull
   @Override
   public WorkerResult doWork() {
       return WorkerResult.SUCCESS;
   }
}
```

### Creating Constraints for workers

Now we have created 3 `Worker` classes and can chain them together so they run when each previous `Worker` has returned `WorkerResult.SUCCESS`. The `WorkManager` won't proceed if any of the `Worker` instances returns `WorkerResult.FAILURE`.

But first we have to make our `Constraints` for our `Worker` instances, so the `Worker` only runs if the conditions we have set in the `Constraints` class is met. 

```java
Constraints constraint = new Constraints
       .Builder()
       .setRequiredNetworkType(NetworkType.CONNECTED)
       .build();
```


GPS requirement is not yet supported in the `Constraints` class but we will instead check for enabled GPS in the `AddStickersTask` and if it’s not enabled we will return `FAILURE` and the next `WorkManager` won’t proceed to the next `Worker`

### Putting everything together 

Now lets create new instances of our 3 `Worker` classes: 

```java
OneTimeWorkRequest imageCompressionTask = new OneTimeWorkRequest.Builder(ImageCompressionTask.class).build();
OneTimeWorkRequest AddStickersTask = new OneTimeWorkRequest.Builder(AddStickersTask.class).setConstraints(constraint).build();
OneTimeWorkRequest UploadImageTask = new OneTimeWorkRequest.Builder(UploadImageTask.class).setConstraints(constraint).build();
```

We make them as `OneTimeWorkRequest` because we only want these `Worker` to execute once. `PeriodicWorkRequest` can be used in cases where you want a `Worker` for some repetitive work which can run in intervals you can set.

Now we feed our `WorkManager` with our `Worker` instances in the order as described in our user story and we done!

```java
WorkManager.getInstance().beginWith(imageCompressionTask).then(AddStickersTask).then(UploadImageTask).enqueue();
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


Tags: WorkManager, Android, Jetpack, Asynchronous.
