---
title:  Getting Stack Traces in Swift on Linux
date: 2017-08-16 13:00:00
tags: vapor,swift,linux,stack,trace,swift4
authorIds:
- brto
categories:
- Vapor
---

[Bugsnag](https://www.bugsnag.com) is a convenient service for reporting and catching bugs and crashes that Nodes has been using for a long time. When we moved our backend stack over to Swift, we noticed that there was not a Linux-friendly package. So, we built [our own](https://github.com/nodes-vapor/bugsnag)! Doing so led us down quite a deep rabbit hole: stack traces.

From our stack traces, we wanted a system with clean output that gracefully handles the differences between macOS and Linux. We started our search with Foundation.

Foundation in Swift provides a convenient `Thread.callStackReturnAddresses()`, but, like most things in Foundation, this API is not available on Linux. To get around this, we have to write the implementation in C and then expose the implementation to Swift using a [module map](https://clang.llvm.org/docs/Modules.html). Doing so is not that complicated, but we ended up hitting a few roadblocks on the Linux side.

We started out the implementation by taking advantage of [backtrace(3)](http://man7.org/linux/man-pages/man3/backtrace.3.html) that's available to *nix systems. Backtrace is a convenient function that just takes a buffer and its size and spits out an array of pointers that is `<= BUFF_LEN` in length. There is even an equally convenient function `backtrace_symbols ` that can take this array of pointers and translate them into strings. The downside of `backtrace_symbols` is that its output is not defined by the standard. So, the resulting stack traces aren't the same across all implementations. On top of that, the output contains a lot of extra noise, such as address and offset information.

## Getting a stack trace

Our implementation of `backtrace_symbols` is relatively straightforward. We just map over the buffer using [dladdr(3)](http://man7.org/linux/man-pages/man3/dladdr.3.html) to get information about the address. If there is no metadata for the given symbol, the name defaults to `???`. The implementation could be more performant by iterating over the collection twice and using the first pass to calculate how much memory we need and then allocate a single buffer big enough to fit all of this information. Then iterate over the buffer again `memcpy`ing the strings into our pool. We did not use this approach because extracting strings from a single, pool-allocated, buffer is much more involved than extracting them from a nested pointer.

```C
char ** get_symbols_for_backtrace(void * const *buffer, int size) {
    int i;
    char ** result;
    
    result = malloc(sizeof(char *) * size);
    if (result == NULL) return NULL;
    
    for (i = 0; i <= size; ++i) {
        Dl_info info;
        dladdr(buffer[i], &info);
        
        char *name = "???";
        if (info.dli_sname) {
            name = (char *)info.dli_sname;
        }

        result[i] = strdup(name);
    }
    
    return result;
}
```

On Linux the symbol `dladdr` is a non-standard extension; therefore, it is only exposed by the feature test macro `_GNU_SOURCE`. Sadly, Swift imports glibc before you have the opportunity to define it ([SR-328](https://bugs.swift.org/browse/SR-328)). This can be worked around by invoking the Swift compiler with `-Xcc -D_GNU_SOURCE`. We ran into some issues when trying defining this macro on some versions of Linux and decided to build the stack trace library independent of the Swift package and then dynamically link it.

## Distributing our stack trace library

We started building the dynamic library by pulling the stack module out of SPM and gave it its own git repo. Then, we added a [simple Makefile](https://github.com/nodes-vapor/stack/blob/master/Makefile) that has a target for both macOS and Linux. Now that we are able to build stack independent of the Swift module, we need to distribute the binaries we just built and a header. We use APT to distribute on Debian-based systems and Homebrew on macOS. By default Homebrew does not install the libraries and headers in a place that is in Swift's search path. To resolve this, we added a [pkg-config](https://en.wikipedia.org/wiki/Pkg-config) on the macOS target that points to Homebrew's install location.

Now we are ready to get our first stack trace!

## Demangling symbols

**And...**

`__T04Core15BuiltinFunctionC4makeACSS_SayAA4Type_pG2inAF3outSb10isVariadic4LLVM7IRValue_pAC_SayAA4Expr_pGAA11IRGeneratorVztc3genAaE_pAA7CheckerVz_AA4CallCtcSg02onP5ChecktFZfA4_`

![eek!](https://www.filepicker.io/api/file/P0yc1BheSwgKi6GE6Iys)

She's a beauty, ain't she?

What you are looking at is a mangled symbol. It is a common way for modern languages/features to disambiguate names and preserve a symbol's meta-information. Here is an example of a simple struct and how it and its members are mangled.

```swift
$ xcrun swiftc -o example -
struct User {
	let name: String

	func kick() -> Bool { return true }
}
^D
$ nm example | grep example
00000001000010a0 t __T07example4UserV4kickSbyF
0000000100001070 t __T07example4UserV4nameSSfg
...
0000000100001160 t __T07example4UserVwxx
```

> If you wish to learn more about mangling in programming languages, check out [this](https://en.wikipedia.org/wiki/Name_mangling) wikipedia article.

The process of extracting metadata from a mangled symbol is known as demangling ([Swift Name Demangling](https://mikeash.com/pyblog/friday-qa-2014-08-15-swift-name-mangling.html)). The way Swift mangles symbols is not well documented and is subject to change across versions of Swift. Matt Gallagher [translated](https://github.com/mattgallagher/CwlDemangle) Swift's internal version of the mangler to Swift and open-sourced it. This tool works quite well for Swift 3, but Swift 4 changed the way most of the mangling works. For Swift 4 support we moved to the internal implementation using a [little linker hack](https://github.com/nodes-vapor/stacked/pull/12) (thanks [@harlanhaskins](https://twitter.com/harlanhaskins)). This implementation is quite brittle, but, until we get a version that is exposed to Swift, it is our only option.

Now, when we try to run again, we are faced with another issue.

## Swift symbols not being exported on Linux

By default, dynamic symbols are not exported on Linux. That means that all Swift functions in the stack trace will not have their name displayed, just like in the table below.

|      | Symbol                                   | Address        |
| ---- | ---------------------------------------- | -------------- |
| 0    | .build/release/libFrameAddress.so(get_stack_trace+0x2d) | 0x7f03ad5ca6ad |
| 1    | .build/release/App()                     | 0x7f17b0       |
| 2    | .build/release/App()                     | 0x7fb3fa       |
| ...  |                                          |                |

```c
libFrameAddress.so(get_stack_trace+0x2d)
```

`libFrameAddress.so` is a C binary and `get_stack_trace` is our stack trace implementation.

```
App()
```

`App` is the Swift binary and the name and address of the function are missing. In order to export this information, we need to pass the following flag to the linker:

`-Xlinker --export-dynamic`

We now have our beautiful stack traces!

|      | Symbol                                   |
| ---- | ---------------------------------------- |
| 0    | get_stack_trace                          |
| 1    | static Stacked.FrameAddress.getStackTrace(maxStackSize: Swift.Int) -> Swift.Array<Swift.String> |
| 2    | StackedTests.StackedTests.anotherExample() -> Swift.Array<Swift.String> |
| 3    | StackedTests.StackedTests.testExample() -> () |
| 4    | @objc StackedTests.StackedTests.testExample() -> () |

## Conclusion

Getting stack traces in Linux was much more involved than we had expected. We ended up touching nearly every part of the system and were plagued with issues. That being said, it was worth the effort and will greatly ease debugging. Hopefully Foundation and Vapor will add native support for stack traces and remove the burden of having to install a 3rd party repository and passing in build flags on Linux. If you are interested in getting stack traces in your Swift application, check out our [Stacked](https://github.com/nodes-vapor/stacked) package. As for bug reporting with server-side-Swift, check out our [Bugsnag](https://github.com/nodes-vapor/bugsnag) package.
