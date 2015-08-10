# THE AMAZING iMAC SCROLL EFFECT

Version 1.0

This script reproduces a similar effect used by Apple in the iMac page of its website.

The images used for the demo are from Apple's website, [click here](http://en.geberele.com/show-cases/imac-scroll/index.html) to view the demo.

## How it is made
The image is an high resolution image, it is possible to zoom in and zoom out without loosing definition and keeping all the details of the original image.
To be able to maintain that high quality it has been used an HTML5 Canvas element created by 8 images that work in a similar way as in a puzzle where different pieces form the final one.
The Canvas has size 6500x4612px and each single unit is 1625x2306px.
After that the javascript functions replace the normal scroll events of the page with the zoom effect on the image.
