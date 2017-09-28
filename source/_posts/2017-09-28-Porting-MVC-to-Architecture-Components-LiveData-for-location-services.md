---
title: Porting MVC to Architecture Components LiveData for location services
date: 2017-09-28 17:00:00
tags: android, architecture, livedata, location
authorIds:
- joni
categories:
- Android
---
# Objective

Exploring the new Android Architecture Components library in Nodes, we decided to investigate how some project with a typical MVC architecture could benefit from using [LiveData](https://developer.android.com/reference/android/arch/lifecycle/LiveData.html) for location services.

# Implementation

[LiveData documentation](https://developer.android.com/topic/libraries/architecture/livedata.html) is very straight forward and it came out that it was also based on Location, although it does not use FuseLocation. 

Investigating a bit more we found [Ian Lake's article](https://medium.com/google-developers/lifecycle-aware-data-loading-with-android-architecture-components-f95484159de4) where he modifies a previous implementation of FusedLocationApi to use LiveData. This implementation works well as an initial step to showcase LiveData potential, but we considered that it can be improved separating the LiveData and LocationManager responsibilities in two different classes. 

Therefore, instead of modifying our LocationManager to behave as LiveData, we decided to create a completely new LocationLiveData object that could act as a LocationListener for our LocationManager. This lead to the following change in our LocationManager:

```java
public class LocationManager implements LocationListener {
```
to

```java
public class LocationManager {
```

with the associated simplification on it as we are moving the listener responsibility to LocationLiveData class:

```java
import android.arch.lifecycle.LiveData;
import android.location.Location;
import android.support.annotation.MainThread;

import com.google.android.gms.location.LocationListener;

public class LocationLiveData extends LiveData<Location> implements LocationListener {

    private static LocationLiveData sInstance;

    @MainThread
    public static LocationLiveData getInstance() {
        if (sInstance == null) {
            sInstance = new LocationLiveData();
        }
        return sInstance;
    }

    @Override
    protected void onActive() {
        if (LocationManager.getInstance().isLocationPermission()
                && !LocationManager.getInstance().isLocationModeOff()
                && (!LocationManager.getInstance().isConnecting()
                && !LocationManager.getInstance().isConnected())) {
            LocationManager.getInstance().buildGoogleApiClient();
        }
    }

    @Override
    protected void onInactive() {
        LocationManager.getInstance().disconnect();
    }

    @Override
    public void onLocationChanged(Location location) {
        setValue(location);
    }
}
```

Other interesting thing to point out is that our LocationLiveData is a [singleton](https://en.wikipedia.org/wiki/Singleton_pattern). This gives us two main advantages:

- We can use the same LiveData object all across our app and it will notify any observer
- We do not need to pass it as a parameter to the LocationManager so if we want to stop receiving updates we can just use the following in the LocationManager:

```java
LocationServices.FusedLocationApi.removeLocationUpdates(googleApiClient, LocationLiveData.getInstance());
```

In our app the LocationManager is used to:

- start the GoogleApiClient
- get last location
- listen to location updates (only under specific circumstances)

The first two of them were not tied to lifecycle events in the app. For the third one location updates were send using a broadcast receiver. As this is registered an unregistered programmatically it is tied to the lifecycle.

Nevertheless, the advantage of using LiveData is that we can observe the location changes. Therefore, we do not need the broadcast receiver anymore.

According to this, we discarded it but we need to think about the new observer that we have added. Naturally, we would need to unregister and register it again when needed. After all, it seems that we still have an element that is tied to the lifecycle and here it is where we can see some of the magic of LiveData.

According to the official LiveData documentation:

> Adds the given observer to the observers list within the lifespan of the given owner. The events are dispatched on the main thread. If LiveData already has data set, it will be delivered to the observer.
>
> The observer will only receive events if the owner is in STARTED or RESUMED state (active).
>
> If the owner moves to the DESTROYED state, the observer will automatically be removed.
>
> When data changes while the owner is not active, it will not receive any updates. If it becomes active again, it will receive the last available data automatically.
>
> LiveData keeps a strong reference to the observer and the owner as long as the given LifecycleOwner is not destroyed. When it is destroyed, LiveData removes references to the observer & the owner.
>
> If the given owner is already in DESTROYED state, LiveData ignores the call.

In other words, we are fully covered and we do not need to worry about unregister the observer or register it again as per lifecycle events. LiveData would handle that for us seamlessly.

Nice! But, what about the location updates? We should be calling requestLocationUpdates and removeLocationUpdates, and that should also be tied to the lifecycle. Here we find a bit more magic in LiveData.

Notice that the [observe method](https://developer.android.com/reference/android/arch/lifecycle/LiveData.html#observe(android.arch.lifecycle.LifecycleOwner,%20android.arch.lifecycle.Observer%3CT%3E)) of LiveData requires a [LifecycleOwner](https://developer.android.com/reference/android/arch/lifecycle/LifecycleOwner.html) and a [lifecycle Observer](https://developer.android.com/reference/android/arch/lifecycle/Observer.html) as parameters. Also, when implementing LiveData we will implement two key methods: onActive and onInactive. 

Depending on the state of our LifeCycleOwner the LiveDataObject will call onActive or onInactive methods. Because of this we can now, for example, call removeLocationUpdates in onInactive rather than in our activity onPause method. Additionally, it will serve the updates to the observer or not depending on the state of the LifecycleOwner. 

# Conclusion

With little effort and a few lines of code: 

- We have written a simple and small LocationLiveData class that would notify the observers. Note that getting the last location does not require of listening and can be requested to the Location Manager without LiveData. 
- A Broadcast Receiver has become unnecesary and therefore got to simplify our code
- Register and unregister for location updates in our lifecycle method calls is not longer necessary. 
- Our LocationManager has been simplified as it is not acting anymore as a LocationListener.
