# StrongLoop Training

This application hosts presentation content for StrongLoop training, conference
talks, workshops, usergroup talks, and anything else of that nature. The application
instructions for adding presentations is below.

> _**NOTE** Any changes merged into `master` will be **automatically deployed**._

This means you should be careful not to push any breaking changes as it may affect
presentations already up!

## Presenting from this Site

If you are delivering content from this site you should be able to simply pull up
the URL with your presentation slug, for example:
http://training.strongloop.com/my-cool-talk (where `my-cool-talk` is the slug). If
you want to remove the "download PDF" link that appears by default while presenting
(this is the default for markdown presentations) then simply add `?no-pdf` to the
URL pattern above.

You can open the presenter console (which includes speaker notes) after loading your
presentation using the `s` key. Slides may be navigated using the four arrow keys, or
just `n` for "next" and `p` for "previous". Be sure to run through your slides before
your talk to confirm all of the content is as you expect!

### Speaker & Meta Info

Some presentations will allow the presentater to add meta information to the slides
using query parameters. This would look like: `![{{speaker}}]()` in the slide markdown
(only supported in the markdown slides). To use this feature, simply add a query string
to your URL with the specified piece of data, prefixed with "meta-". For example, if
your presentation were located at `training.strongloop.com/my-talk` then you could use:

`training.strongloop.com/my-talk?meta-speaker=Jordan | @jakerella`

Note that the element in the markdown file will be replaced with this content (as text
only, no HTML tags allowed). Any email addresses or links will be automatically
converted to links!


## Adding a New Presentation

Presentations can be hosted in markdown, HTML, or PDF format. In any case, an entry
must be added to the manifest file at `/server/_manifest.json` and the content added
to the `/public/presentations/` directory.

### Adding the Manifest Entry

Each presentation must include a manifest entry to be routed to properly. Open the
file and add a new block in the root of the JSON object. Below is the format:

```
[url-slug]: {                // the URL slug will be off of the root
    "title": [string],       // appears in the window title for markdown presentations
    "description": [string], // used in the meta description tag
    "slides": [string],      // path to the slide content file (.md, .html, or .pdf)
    "footer": [boolean],     // only used for markdown, whether to include the StrongLoop logo footer
    "auth": {                // optional if you want to enable basic HTTP auth for this presentation
        "user": [string],
        "pass": [string]
    },
    "reveal": {              // override the application's default Reveal.js settings
        "controls": true     // Note: some dependencies are pre-loaded: classList, marked/markdown, notes
    }                        //       Use straight HTML if you need to alter these.
}
```

After creating the manifest entry, create the content for the presentation itself.
This should be a markdown (.md), HTML, or PDF document in the `/public/presentations/`
directory. Note that markdown files should only content slide content, everything else
is created for you. HTML documents should include all necessary tags, scripts,
stylesheets, etc.

### Presentation Meta Info

You (the presentation author) may decide to allow the presentater to add meta
information to the slides at presentation time using query parameters. Simply add an
empty image markdown block anywhere in your slides:

`![{{speaker}}]()`

This will result in an empty image tag since there is no URL and the "alt" text will
be the meta tag to be used by the presenter. The client-side JavaScript will **remove
this empty image tag if not specified by the presenter**. The presenter simply adds a
query string to the URL with the specified piece of data, prefixed with "meta-". For
example, if the presentation were located at `training.strongloop.com/my-talk` then
they could use:

`training.strongloop.com/my-talk?meta-speaker=Jordan | @jakerella`

Note that the image tag in the rendered HTML will be replaced with this content (as
text only, no HTML tags allowed). **Any email addresses or links will be automatically
converted to links!**

A few pieces of information are available without the presenter using the query string:

* `![{{url}}]()` - The current URL (minus the query string)
* `![{{date}}]()` - The current date (m/d/Y)
* `![{{title}}]()` - The presnetation title (from the manifest)

### Examples

There are three examples in the manifest for you to explore if you need them. Those
presentations are hosted at `/demo`, `/demo-html`, and `/demo-pdf`. **Please do not
delete these examples!** Others may need to refer to them when creating their first
presentations.


## Development and Deployment of This Application

The `master` branch of this repository is automatically deployed to a Heroku instance
managed by StrongLoop. When editing code on this system, please first develop in a
feature branch and submit a PR. For presentation content updates, feel free to merge
on your own (unless you want a review). For application code updates, please have at
least one other set of eyes on the changes.

> _**NOTE** Any changes merged into `master` will be **automatically deployed**._

This means you should be careful not to push any breaking changes as it may affect
presentations already up and possibly being delivered soon (or at that same moment)!

The live site is located at http://training.strongloop.com

### Application Structure

The application is very basic Express system, with only a few routes (with the
presentations each being a dynamically created route). Almost all code is in the
`/server` directory, with a bit of client-side JavaScript embedded in the
`/views/**/*.jade` files.

There are currently no tests, but you can run `npm test` to run jshint on your files.
