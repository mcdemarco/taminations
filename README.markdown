README : mcdemarco/taminations
======

This is a branch of my fork of bradchristie/taminations intended for use as an iOS web app.

In addition to the iOS-specific headers, it incorporates a beta version of jQuery Mobile,
some stylistic changes, and smaller image files.

***

To serve these files for offline use, you will need the included .htaccess file, 
or you will need to modify your webserver's mime type list to serve HTML5 appcaches.
You can test whether this configuration is working on your server by opening mobile.html
in Chrome, waiting for the cache to fill, then checking the following URL for the cache:

    chrome://appcache-internals/

***

To cache these files for offline use on your iOS device, you must:

1. Open the mobile.html page in Safari. The page must be served by a webserver.
2. Add the link to your home screen.
3. Open the page from the new link.
4. Remain connected long enough for the files to download.  (About 5MB.)
5. If asked, allow Safari to increase the offline storage limit beyond 5MB.

Other devices that support HTML5 offline caching should also work, but have not been tested.

***

See the [taminations page](http://tamtwirlers.org/tamination/info/index.html) for more information about taminations.  