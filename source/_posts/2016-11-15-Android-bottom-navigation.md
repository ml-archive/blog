---
title: Android Bottom Navigation
date: 2016-11-15 10:31:21
tags: android, ui, ux
authorId: joal
categories:
- Android
---

This blog post will give a quick introduction on the new Android Bottom Navigation component, how to setup your project to use it and a few tips on how to use it to get the best results.

Desppite being part of the Material Design recommendations for a while, Google only recently introduced this on the version 25 of Design Support Library so you don't have to create your own custom implementations anymore.

I created a sample project on GitHub with all the source code for this sample. You can check it [here](https://github.com/jcmsalves/bottomNavigationSample) later if you want.

### 1. How and when to use the Bottom Navigation 

Let's start with a quick reminder on [Google and Material Design recommendations](https://material.google.com/components/bottom-navigation.html) when using the bottom navigation:

- Bottom navigation should be used to provide quick navigation between top-level views of an app.

- Three to five top-level destinations: this component shouldn't be used if you have less than 3 or more than 5 options to show.
	- 2 items: you should actually use a regular tab layout on the top of the page
	- 5+ items: you should probably use a navigation drawer instead, or as an alternative maybe have one of your 5 items being a *More* option that takes the user to a separate navigation screen

- Bottom navigation and tabs: think twice if you want to use both widgets at the same time. If you really have to, be carefull regarding navigation and animation or you can easily confuse the user

- Menu items style (this is how it works by default)
	- 3 items: if using 3 items all the items should be visible all time with Icon and Text
	- 3+ items: if using more than 3 items only the active item should have visible text

<table width="100%">
<tr>
<td align="center"><img src="https://d1gwekl0pol55k.cloudfront.net/image/nstack/default/3buttonsscreenshot1_XToNZrXuvc.png" width="300"></td>
<td align="center"><img src="https://d1gwekl0pol55k.cloudfront.net/image/nstack/translate_values/4buttonsscreenshot1_ePCWRdtsm9.png" width="300"></td></tr>
<tr><td align="center">3 menu items</td><td align="center">4 menu items</td></tr>
</table>

### 2. Now to the fun part. Let's build this

Now that we covered some of the most important recommendations let's get to the interesting part and actually use this in our app.

As with the other support libraries components you just need to add the dependency to your app Gradle file.

```gradle
compile ‘com.android.support:design:25.0.0’ 
```

Now we can start using it straigh away. A quick list on what we'll need:

- Add the widget to the layout file where we want to show it
- Create a menu layout file with our options
- Create a state drawable file to control the menu item different states
- Implement a listener to detect when we tap each item



####1. Add the bottom navigation widget:

  Let's add the widget as follows to the MainActivity layout file:
	
```xml
<android.support.design.widget.BottomNavigationView
        android:id="@+id/bottomNavigation"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:itemBackground="@color/colorPrimary"
        app:itemIconTint="@drawable/menu_item_selector"
        app:itemTextColor="@drawable/menu_item_selector"
        app:menu="@menu/bottom_navigation_menu">
    </android.support.design.widget.BottomNavigationView>
```

Remember you have to make it aligned at the bottom of the screen. You can check the full layout file [here](https://github.com/jcmsalves/bottomNavigationSample/blob/master/app/src/main/res/layout/activity_main.xml) for reference.
	
As you can see, there are some properties on the widget. Let's take a look at them in a bit more detail:

- **app:itemBackground -** the background colour you want to use in the bottom navigation widget. In our case the Nodes pink.
- **app:itemIconTint -** the tint to be used in the menu item icons
- **app:itemTextColor -** the colour to be used in the menu item text
- **app:menu -** reference to the menu layout file that we're creating on the next step

####2. Create a menu layout:

  No tricks here, we can just create a menu file like for any other Android menu with id, a reference for the drawable and the text to display.

```xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:id="@+id/action_home"
        android:enabled="true"
        android:icon="@drawable/ic_home_white_24dp"
        android:title="@string/menu_item_home" />
    <item
        android:id="@+id/action_car"
        android:enabled="true"
        android:icon="@drawable/ic_directions_car_white_24dp"
        android:title="@string/menu_item_car" />
    <item
        android:id="@+id/action_bike"
        android:enabled="true"
        android:icon="@drawable/ic_directions_bike_white_24dp"
        android:title="@string/menu_item_bike" />

    <item
        android:id="@+id/action_walk"
        android:enabled="true"
        android:icon="@drawable/ic_directions_walk_white_24dp"
        android:title="@string/menu_item_walk" />
</menu>
```

Easy right?

####3. Create a state drawable:
Now, at this stage we would have a functional bottom navigation but we all care about good looking UI and nice UX so let's make it better.

Right now all the icons and corresponding text are the same color, no matter if they are selected or not.

You probably noticed that in the Widget xml definition on part 1 there was already a reference for ```@drawable/menu_item_selector``` in the itemIconTint and itemTextColor properties.

So, we just need to create this to make everything work as expected. Create the file with the following content:

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:color="@color/colorWhite" android:state_checked="true" />
    <item android:color="@color/colorPrimaryDark" android:state_checked="false" />
</selector>
```
 
As you can see it's a really simple selector just returning 2 different colours for state checked and non-checked. Feel free to extended it to cover other states.

####4. Implement NavigationItemSelected listener:

To complete our sample we just need to listen to the tap events on each menu item. The activity layout from the sample contains just a simple Frame Layout with a centered text view emulating the Fragment title.
 
Add this code to your Activity:

```java
BottomNavigationView bottomNavigationView = (BottomNavigationView)
                findViewById(R.id.bottomNavigation);

        final TextView fragmentNameTv = (TextView)
                findViewById(R.id.fragmentName);

        fragmentNameTv.setText(getResources().getString(R.string.fragment_home_title));

        bottomNavigationView.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {

                switch (item.getItemId()) {
                    case R.id.action_home:
                        fragmentNameTv.setText(getResources().getString(R.string.fragment_home_title));
                        break;

                    case R.id.action_car:
                        fragmentNameTv.setText(getResources().getString(R.string.fragment_car_title));
                        break;

                    case R.id.action_bike:
                        fragmentNameTv.setText(getResources().getString(R.string.fragment_bike_title));
                        break;

                    case R.id.action_walk:
                        fragmentNameTv.setText(getResources().getString(R.string.fragment_walk_title));
                        break;
                }
                return false;
            }
        });
```

First we get references to the BottomNavigation Widget and the TextView from the layout.

Then we add the OnNavigationItemSelectedListener to the widget and just use a switch to detect with menu item was tapped and update the TextView with the corresponding fragment title.

And it's done. Super simple right? Here's the final result with all the animations given for free:

<table width="100%" style="border:0px">
<tr>
<td align="center"><img src="https://d1gwekl0pol55k.cloudfront.net/image/nstack/translate_values/3buttonsgif_VtILFZWqWD.gif" width="300"></td>
<td align="center"><img src="https://d1gwekl0pol55k.cloudfront.net/image/nstack/translate_values/4buttonsgif_n1Avgls13h.gif" width="300"></td></tr>
<tr><td align="center">3 menu items</td><td align="center">4 menu items</td></tr>
</table>
Having implemented a custom bottom navigation view myself in previous projects I can say this is a really nice addition to the support library. The amount of benefits you get from free and boilerplate code you don't have to do is quite good.

So if you don't have any specific requirements or some custom UI you need to implement, give it a try and you'll see how quickly it is to implement.

-----

Take a look at some of our Android Libraries [here](https://github.com/nodes-android)
