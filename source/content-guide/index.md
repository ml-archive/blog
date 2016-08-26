---
title: Content Guide
date: 2016-08-26 09:07:28
---
{% n_imagecaption https://images.unsplash.com/photo-1460500063983-994d4c27756c?crop=entropy&fit=crop&fm=jpg&h=1350&ixjsv=2.1.0&ixlib=rb-0.3.5&q=80&w=2575 '"title text"' '"alt text"' %}

# Github Flavored Markdown

## Supported Headings

```
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Paragraphs

```
Lorem ipsum dolor sit amet, consectetur...
```
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto aspernatur at dolore ea eligendi eum eveniet facilis fugit id incidunt, ipsa iure magni nobis officia praesentium quae quisquam quos reiciendis sed sequi tempore vel vitae voluptatem voluptates voluptatibus? Animi aperiam, assumenda aut beatae enim est et laborum minus nesciunt nihil nobis, officia sapiente sequi similique temporibus ut veritatis? A accusantium cupiditate distinctio earum in, inventore non odio quos reprehenderit sapiente! Assumenda autem esse facere fugiat in itaque obcaecati porro qui repudiandae, saepe tempore ullam vitae! Accusantium, atque, corporis facilis, molestiae nemo neque numquam optio perferendis perspiciatis quam quidem temporibus voluptate.

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto aspernatur at dolore ea eligendi eum eveniet facilis fugit id incidunt, ipsa iure magni nobis officia praesentium quae quisquam quos reiciendis sed sequi tempore vel vitae voluptatem voluptates voluptatibus? Animi aperiam, assumenda aut beatae enim est et laborum minus nesciunt nihil nobis, officia sapiente sequi similique temporibus ut veritatis? A accusantium cupiditate distinctio earum in, inventore non odio quos reprehenderit sapiente! Assumenda autem esse facere fugiat in itaque obcaecati porro qui repudiandae, saepe tempore ullam vitae! Accusantium, atque, corporis facilis, molestiae nemo neque numquam optio perferendis perspiciatis quam quidem temporibus voluptate.

## Emphasis
```no-highlight
Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~
```

Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

## Lists

(In this example, leading and trailing spaces are shown with with dots: ⋅)

```no-highlight
1. First ordered list item
2. Another item
⋅⋅* Unordered sub-list. 
1. Actual numbers don't matter, just that it's a number
⋅⋅1. Ordered sub-list
4. And another item.

⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

⋅⋅⋅To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅
⋅⋅⋅Note that this line is separate, but within the same paragraph.⋅⋅
⋅⋅⋅(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

* Unordered list can use asterisks
- Or minuses
+ Or pluses
```

1. First ordered list item
2. Another item
  * Unordered sub-list. 
1. Actual numbers don't matter, just that it's a number
  1. Ordered sub-list
4. And another item.

   You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

   To have a line break without a paragraph, you will need to use two trailing spaces.  
   Note that this line is separate, but within the same paragraph.  
   (This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

* Unordered list can use asterisks
- Or minuses
+ Or pluses

## Links

There are two ways to create links.

```no-highlight
[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links. 
http://www.example.com or <http://www.example.com> and sometimes 
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com
```

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links. 
http://www.example.com or <http://www.example.com> and sometimes 
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com

## Tables

Tables aren't part of the core Markdown spec, but they are part of GFM and *Markdown Here* supports them. They are an easy way of adding tables to your email -- a task that would otherwise require copy-pasting from another application.

```no-highlight
Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the 
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3
```

Colons can be used to align columns.

| Tables        | Are           | Cool |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell. The outer pipes (|) are optional, and you don't need to make the raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3

## Horizontal Rule

```
Three or more...

---

Hyphens

***

Asterisks

___

Underscores
```

Three or more...

---

Hyphens

***

Asterisks

___

Underscores

## Raw HTML

The markdown parser also supports raw html in your markdown files. This means that if you want to write &lt; / &gt; symbols and not have them parsed as html, you need to write them like this: `&lt;`/`gt;`. 

Example:

```
<input type="text">
```
<input type="text">

# Tag Plugins (the equivilant to Shortcodes in Wordpress)

## Block Quote

Perfect for adding quotes to your post, with optional author, source and title information.

**Syntax**
```
{% blockquote [author[, source]] [link] [source_link_title] %}
content
{% endblockquote %}
```

### Examples

**No arguments. Plain blockquote.**

```
{% blockquote %}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque hendrerit lacus ut purus iaculis feugiat. Sed nec tempor elit, quis aliquam neque. Curabitur sed diam eget dolor fermentum semper at eu lorem.
{% endblockquote %}
```

{% blockquote %}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque hendrerit lacus ut purus iaculis feugiat. Sed nec tempor elit, quis aliquam neque. Curabitur sed diam eget dolor fermentum semper at eu lorem.
{% endblockquote %}

**Quote with Author and Source**

```
{% blockquote David Levithan, Wide Awake %}
Do not just seek happiness for yourself. Seek happiness for all. Through kindness. Through mercy.
{% endblockquote %}
```

{% blockquote David Levithan, Wide Awake %}
Do not just seek happiness for yourself. Seek happiness for all. Through kindness. Through mercy.
{% endblockquote %}

**Quote from Twitter**

```
{% blockquote @DevDocs https://twitter.com/devdocs/status/356095192085962752 %}
NEW: DevDocs now comes with syntax highlighting. http://devdocs.io
{% endblockquote %}
```

{% blockquote @DevDocs https://twitter.com/devdocs/status/356095192085962752 %}
NEW: DevDocs now comes with syntax highlighting. http://devdocs.io
{% endblockquote %}

**Quote from an article on the web**

```
{% blockquote Seth Godin http://sethgodin.typepad.com/seths_blog/2009/07/welcome-to-island-marketing.html Welcome to Island Marketing %}
Every interaction is both precious and an opportunity to delight.
{% endblockquote %}
```

{% blockquote Seth Godin http://sethgodin.typepad.com/seths_blog/2009/07/welcome-to-island-marketing.html Welcome to Island Marketing %}
Every interaction is both precious and an opportunity to delight.
{% endblockquote %}

## Image

Inserts an image with specified size.

```
{% img [class names] /path/to/image [width] [height] [title text [alt text]] %}
```

{% img https://images.unsplash.com/photo-1460500063983-994d4c27756c?crop=entropy&fit=crop&fm=jpg&h=1350&ixjsv=2.1.0&ixlib=rb-0.3.5&q=80&w=2575 '"title text"' '"alt text"' %}

## Syntax Highlighting

Useful feature for adding code snippets to your post. Auto detection of code languages is not reliable and therefore you **must** define the language.

**Syntax**
```
{% codeblock [title] [lang:language] [url] [link text] %}
code snippet
{% endcodeblock %}
```

### Examples

**Basic Codeblocks**

```
{% codeblock lang:objc %}
#import <UIKit/UIKit.h>
#import "Dependency.h"

@protocol WorldDataSource
@optional
- (NSString*)worldName;
@required
- (BOOL)allowsToLive;
@end

@property (nonatomic, readonly) NSString *title;
- (IBAction) show;
@end
{% endcodeblock %}

{% codeblock lang:java %}
/**
 * @author John Smith <john.smith@example.com>
*/
package l2f.gameserver.model;

public abstract class L2Char extends L2Object {
  public static final Short ERROR = 0x0001;

  public void moveTo(int x, int y, int z) {
    _ai = null;
    log("Should not be called");
    if (1 > 5) { // wtf!?
      return;
    }
  }
}
{% endcodeblock %}
 
{% codeblock lang:javascript %}
function $initHighlight(block, cls) {
  try {
    if (cls.search(/\bno\-highlight\b/) != -1)
      return process(block, true, 0x0F) +
             ` class="${cls}"`;
  } catch (e) {
    /* handle exception */
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    if (checkCondition(classes[i]) === undefined)
      console.log('undefined');
  }
}

export  $initHighlight;
{% endcodeblock %}

{% codeblock lang:json %}
[
  {
    "title": "apples",
    "count": [12000, 20000],
    "description": {"text": "...", "sensitive": false}
  },
  {
    "title": "oranges",
    "count": [17500, null],
    "description": {"text": "...", "sensitive": false}
  }
]
{% endcodeblock %}

{% codeblock lang:php %}
require_once 'Zend/Uri/Http.php';

namespace Location\Web;

interface Factory
{
    static function _factory();
}

abstract class URI extends BaseURI implements Factory
{
    abstract function test();

    public static $st1 = 1;
    const ME = "Yo";
    var $list = NULL;
    private $var;

    /**
     * Returns a URI
     *
     * @return URI
     */
    static public function _factory($stats = array(), $uri = 'http')
    {
        echo __METHOD__;
        $uri = explode(':', $uri, 0b10);
        $schemeSpecific = isset($uri[1]) ? $uri[1] : '';
        $desc = 'Multi
line description';

        // Security check
        if (!ctype_alnum($scheme)) {
            throw new Zend_Uri_Exception('Illegal scheme');
        }

        $this->var = 0 - self::$st;
        $this->list = list(Array("1"=> 2, 2=>self::ME, 3 => \Location\Web\URI::class));

        return [
            'uri'   => $uri,
            'value' => null,
        ];
    }
}

echo URI::ME . URI::$st1;

__halt_compiler () ; datahere
datahere
datahere */
datahere
{% endcodeblock %}

{% codeblock %}
No language indicated, so no syntax highlighting. 
But let's throw in a <b>tag</b>.
{% endcodeblock %}
```

{% codeblock lang:objc %}
#import <UIKit/UIKit.h>
#import "Dependency.h"

@protocol WorldDataSource
@optional
- (NSString*)worldName;
@required
- (BOOL)allowsToLive;
@end

@property (nonatomic, readonly) NSString *title;
- (IBAction) show;
@end
{% endcodeblock %}

{% codeblock lang:java %}
package l2f.gameserver.model;

public abstract class L2Char extends L2Object {
  public static final Short ERROR = 0x0001;

  public void moveTo(int x, int y, int z) {
    _ai = null;
    log("Should not be called");
    if (1 > 5) { // wtf!?
      return;
    }
  }
}
{% endcodeblock %}
 
{% codeblock lang:javascript %}
function $initHighlight(block, cls) {
  try {
    if (cls.search(/\bno\-highlight\b/) != -1)
      return process(block, true, 0x0F) +
             ` class="${cls}"`;
  } catch (e) {
    /* handle exception */
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    if (checkCondition(classes[i]) === undefined)
      console.log('undefined');
  }
}

export  $initHighlight;
{% endcodeblock %}

{% codeblock lang:json %}
[
  {
    "title": "apples",
    "count": [12000, 20000],
    "description": {"text": "...", "sensitive": false}
  },
  {
    "title": "oranges",
    "count": [17500, null],
    "description": {"text": "...", "sensitive": false}
  }
]
{% endcodeblock %}

{% codeblock lang:php %}
/**
 * Generate a random string with our specific charset, which conforms to the
 * RFC 4648 standard for BASE32 encoding.
 *
 * @return string
 */
function noise()
{
    return substr(
        str_shuffle(str_repeat('abcdefghijklmnopqrstuvwxyz234567', 16)),
        0,
        32
    );
}
/**
 * @param DateTime $date Date that is to be checked if it falls between $startDate and $endDate
 * @param DateTime $startDate Date should be after this date to return true
 * @param DateTime $endDate Date should be before this date to return true
 * @return bool
 */
function isDateBetweenDates(DateTime $date, DateTime $startDate, DateTime $endDate): bool
{
    return $date > $startDate && $date < $endDate;
}
{% endcodeblock %}

{% codeblock %}
No language indicated, so no syntax highlighting. 
But let's throw in a <b>tag</b>.
{% endcodeblock %}

**Adding a caption to the code block**

```
{% codeblock Array.map %}
array.map(callback[, thisArg])
{% endcodeblock %}
```

{% codeblock Array.map %}
array.map(callback[, thisArg])
{% endcodeblock %}

**Adding a caption and a URL**

```
{% codeblock _.compact http://underscorejs.org/#compact Underscore.js %}
_.compact([0, 1, false, 2, '', 3]);
=> [1, 2, 3]
{% endcodeblock %}
```

{% codeblock lang:javascript _.compact http://underscorejs.org/#compact Underscore.js %}
_.compact([0, 1, false, 2, '', 3]);
=> [1, 2, 3]
{% endcodeblock %}

## jsFiddle

To embed a jsFiddle snippet:

```
{% jsfiddle shorttag [tabs] [skin] [width] [height] %}
```

{% jsfiddle //jsfiddle.net/blazeeboy/fNPvf %}

## Gist

To embed a Gist snippet:

```
{% gist gist_id [filename] %}
```

{% gist da6e223d2f98871b0073 %}

## YouTube

Inserts a YouTube video.

```
{% youtube video_id %}
```

## Vimeo

Inserts a Vimeo video.

```
{% vimeo video_id %}
```
