---
title: URLComponents
date: 2018-03-05 10:00:00
tags: [ios,urlcomponents]
authorIds:
- pebo
categories:
- iOS
---
When writing mobile apps, more often than not we have to communicate with a backend to get some data to present to the user.

The shared language between frontend and backend is usually URLs combined with either a POST body or maybe some URL query parameters, depending on what the backend offers.

In this post we will look at [URLComponents](https://developer.apple.com/documentation/foundation/urlcomponents), a small but very useful helper that will become your new best friend when composing or decomposing URLs (we promise!)

But before we look at `URLComponents`, lets first look at a world without `URLComponents` just to make you extra grateful that such a thing exists.

## Setting the Stage
OK, lets assume that we need to use a backend service for searching and showing details about TV shows.

### Searching
 Our hard working backend developing friends have made a service for us to use. The base URL looks like this:

`https://showsknownfrom.tv/search`

(no...it doesn't exist)

And it offers the following query parameters:

- q: A query string we would like to search for
- order (optional parameter): Do we want the search results ascending or descending
- number (optional parameter): Max number of search results to return

### Showing Details
To see details about a TV show, we get a URL to a HTML page from the backend which we then present in a WebView.

The URL looks like this:

`https://showsknownfrom.tv/12345678`

And can have an optional URL parameter called `featured`. If featured is present and is true, we would like to show a flashing red `UILabel` with the caption "FEATURED" over our `WebView` (note: this feature has not been cleared with the designer yet!)

## Composing and Decomposing URLs - The Hard Way
### Composing URLs for Searching
The stage is set and we are ready to look at how to call our search service in our pre-URLComponents world.

To generate a `URL` in our iOS app, we could write some code like this:

```swift
func searchURL(with q: String, optionalParameters: [String: String] = [:]) -> URL? {
    var urlString = "https://showsknownfrom.tv/search"

    //Append query
    urlString.append("?q=\(q)")

    //Append parameters if any
    optionalParameters.forEach({key, value in
        urlString.append("&\(key)=\(value)")
    })

    return URL(string: urlString)
}
```

Granted, it could be worse, but note that we have to know about a "magic" `?` if this is the first parameter and `&` if it is any other parameters.

Lets take it for a spin:

```swift
if let url = searchURL(with: "Sopranos") {
    print(url) //gives us: https://showsknownfrom.tv/search?q=Sopranos
}

if let url = searchURL(with: "Sopranos", optionalParameters: ["order" : "desc", "number" : "100"]) {
    print(url) //gives us: https://showsknownfrom.tv/search?q=Sopranos&number=100&order=desc
}
```

By now you might be thinking "Hey!! What gives! Why are those morons hyping `URLComponents` so hard? This clearly works!"

OK, lets look at another example:

```swift
if let url = searchURL(with: "Halt and Catch Fire", optionalParameters: ["order" : "desc", "number" : "100"]) {
    print(url)
} else {
    print("no URL") //We end up here
}
```

That didn't work, why?

Yes, you're right, the query contains spaces!

We need to [Percent Encode](https://en.wikipedia.org/wiki/Percent-encoding) our query, so lets do that before we try to use it. We add this to the top of our function:

```swift
//Append query
guard let encodedQuery = q.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) else { return nil }
urlString.append("?q=\(encodedQuery)")
...
```

And now we get `https://showsknownfrom.tv/search?q=Halt%20and%20Catch%20Fire&number=100&order=desc`

Great! Our function seems to be working as expected now, but it took some time and some tries to get here.

### Decomposing URLs
Now, lets look at another example.

Remember the details page and the `featured` parameter?

Here is how we could fetch that from the URL in our iOS app:

```swift
func receivedURL(_ url: URL, contains parameter: String) -> String? {
    let urlString = url.absoluteString

    //add = to parameter
    let parameterNameWithEqual = "\(parameter)="

    guard let rangeOfParameterName = urlString.range(of: parameterNameWithEqual) else {
        return nil
    }

    //create a substring starting after the parameter name
    let parametersAfterParameterName = String(urlString[rangeOfParameterName.upperBound...])

    //check if we have more parameters after the one we're looking for
    guard let rangeOfNextAmpersand = parametersAfterParameterName.index(of: "&") else {
        //we did not, just return the value then
        return parametersAfterParameterName
    }

    //cut the substring where the next parameter starts
    return String(parametersAfterParameterName.prefix(upTo: rangeOfNextAmpersand))
}

//test
if let url = URL(string: "https://showsknownfrom.tv/shows/12345678?featured=true"),
   let parameter = receivedUrl(url, contains: "featured") {
    print("found \(parameter)")
} else {
    print("not found")
}
```

Granted, it works but...wow! So much going on here, magic values and String gymnastics galore.

We could probably make this prettier but...why should we, when something as beautiful as `URLComponents` exists.

## Composing and Decomposing URLs - The Easy Way
By now you should be more than ready for `URLComponents` so lets dive in.

### URLComponents - An Introduction
`URLComponents` was introduced in iOS 7.0 and macOS 10.9 so it has been around for some time.

To create a `URLComponents` object you can use either a `String` or a `URL`, in both cases you'll end out with an optional `URLComponents` object.

Just a quick note about the `init` method if you are using a `URL`. As it says in the [documentation](https://developer.apple.com/documentation/foundation/urlcomponents/1780039-init):

> If resolvingAgainstBaseURL is true and url is a relative URL, the components of url.absoluteURL are used. If the url string from the URL is malformed, nil is returned.

To create a new `URLComponents` object we can write something like this:

```swift
let urlString = "https://showsknownfrom.tv/search?q=Sopranos&order=desc"

guard var urlComponents = URLComponents(string: urlString) else {
    return nil
}
```

Now we have access to all parts of the `URL` and can probe them as we see fit.

Here are some examples:

```
urlComponents.host   //gives us: showsknownfrom.tv
urlComponents.scheme //gives us: https
urlComponents.query  //gives us: q=Sopranos&order=desc
```

But the best part is this one:

```swift
urlComponents.queryItems
```

Which gives us back an array of `URLQueryItem` objects, where `URLQueryItem` objects are basically just key/value objects for the individual query items (documented [here](https://developer.apple.com/documentation/foundation/urlcomponents/1779966-queryitems)).

Oh joy! That makes it so much easier for us to append query parameters, or check if a URL contains a query parameter.

### Composing URLs for Searching
Armed with our new knowledge, lets now look at how we can use `URLComponents` to build a `URL` with parameters for us:

```swift
func searchURL(with q: String, optionalParameters: [String: String] = [:]) -> URL? {
    let urlString = "https://showsknownfrom.tv/search"

    guard var urlComponents = URLComponents(string: urlString) else {
        return nil
    }

    var queryItems: [URLQueryItem] = [URLQueryItem(name: "q", value: q)]

    let optionalURLQueryItems = optionalParameters.map {
        return URLQueryItem(name: $0, value: $1)
    }
    queryItems.append(contentsOf: optionalURLQueryItems)

    urlComponents.queryItems = queryItems

    return urlComponents.url
}
```

First we use the `urlString` to create a new `URLComponents` object. (Note that we create the `urlComponents` as a `var` as we'll need to write to it later on.)

Next we create an array of `URLQueryItem` objects and append our only required parameter, the `q` parameter.

Then we loop through our `optionalParameters` dictionary, map the elements to `URLQueryItem` objects and append them to our existing array.

Finally, we ask `URLComponents` to try and return a `URL` for us.

Simple and beautiful, all the hard work has been delegated onwards to `URLComponents` and we don't even have to worry about whether to use `?` or `&` any more.

Lets see how it works:

```swift
if let url = searchURL(with: "Sopranos") {
    print(url) //gives us: https://showsknownfrom.tv/search?q=Sopranos
}

if let url = searchURL(with: "Sopranos", optionalParameters: ["order" : "desc", "number" : "100"]) {
    print(url) //gives us: https://showsknownfrom.tv/search?q=Sopranos&number=100&order=desc
}

if let url = searchURL(with: "Halt and Catch Fire", optionalParameters: ["order" : "desc", "number" : "100"]) {
    print(url) //gives us: https://showsknownfrom.tv/search?q=Halt%20and%20Catch%20Fire&number=100&order=desc
} else {
    print("no URL")
}
```

Perfect!

### Decomposing URLs
Remember our example from before?

Now that we know about `URLQueryItem`s, checking if a query parameter exists is soooo much easier:

```swift
func receivedURL(_ url: URL, contains parameter: String) -> String? {
    guard
        let urlComponents = URLComponents(url: url, resolvingAgainstBaseURL: true),
        let queryItems = urlComponents.queryItems
    else {
        return nil
    }

    let items = queryItems.filter { $0.name == parameter }
    return items.first?.value
}

//test
if let url = URL(string: "https://showsknownfrom.tv/shows/12345678?featured=true"),
   let parameter = receivedUrl(url, contains: "featured") {
    print("found \(parameter)")
} else {
    print("not found")
}
```

Pretty, right? At least compared to the initial version.

## Composing and Decomposing URLs - The Easier Way
Well, we made it this far! But can we do better? Of course we can!

Lets write an `extension` to `URL` so we can append query parameters and also ask if a URL contains a query parameter:

```swift
extension URL {
  func append(queryParameters: [String: String]) -> URL? {
      guard var urlComponents = URLComponents(url: self, resolvingAgainstBaseURL: true) else {
          return nil
      }

      let urlQueryItems = queryParameters.map {
          return URLQueryItem(name: $0, value: $1)
      }
      urlComponents.queryItems = urlQueryItems
      return urlComponents.url
  }

  func value(forParameter name: String) -> String? {
    guard let urlComponents = URLComponents(url: self, resolvingAgainstBaseURL: true),
        let queryItems = urlComponents.queryItems else {
            return nil
    }
    let items = queryItems.filter { $0.name == name }
    return items.first?.value
  }
}
```

Poetry, no less!

Lets test it out:

```swift
if let url = URL(string: "https://showsknownfrom.tv"),
   let appendedURL = url.append(queryParameters: ["q": "Halt and Catch Fire", "order" : "desc", "number": "100"]) {
        print(appendedURL) //gives us: https://showsknownfrom.tv?q=Halt%20and%20Catch%20Fire&number=100&order=desc
}

if let url = URL(string: "https://showsknownfrom.tv/shows/12345678?featured=true&test=1"),
   let value = url.value(forParameter: "featured") {
     print("found \(value)") //gives us: found true
}
```

Fantastic. We've composed two simple functions that makes our daily work so much easier when working with URL parameters.

## Composing and Decomposing URLs - The Easier Way
Now you might be thinking "Urgh!! Extensions!! Why should I write code myself if I can download something from the internet, written by complete strangers instead!!"

If that is you, then good news pal!

We have made a collection of helper methods and extensions called [CodeMine](https://github.com/nodes-ios/Codemine). Next to other nuggets of gold you'll find [two extension methods](https://github.com/nodes-ios/Codemine/blob/master/Codemine/Extensions/NSURL%2BUtilities.swift) to `URL` that looks awfully familiar by now:

`public func value(forParameter name: String) -> String?`

which will return the value for a query parameter in a `URL` (if it exists).

And:

`public func append(queryParameters: [String: String]) -> URL?`

which will append a `String: String` dictionary to an already existing `URL` and return a new `URL` with the query parameters appended and paramter encoded.

So, if you're into Cocoapods, add this to your `podfile`:

`pod 'Codemine', '~>1.0.0'`

And if you're more of a Carthage person, add this to your `Cartfile`

`github "nodes-ios/Codemine" ~> 1.0`

Update and you're done, you can now check if your `URL` object contains specific query parameters or you can build your own `URL` and append parameters easily.

Hey...you're welcome :)

## Parting Words
Whew, we made it!

We started out writing a lot of error prone code ourself for managing URLs more or less as expected.

That was then replaced with `URLComponents` that does all the hard work for us, and finally we made our own `extension` to add some building blocks to make our daily work easier.

If you didn't already know about `URLComponents` we hope to have convinced you that it is an awesome little helper to add to your toolbelt for when you need to work with `URL`s.

Thank you for reading along.
