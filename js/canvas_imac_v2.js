/**
 * This script reproduces a similar effect used by Apple in the iMac page of its website.
 *
 * For the example the script uses the original iMac images:
 * - http://images.apple.com/v/imac-with-retina/a/images/overview/intro_large_r1_c1_2x_27.jpg
 * - http://images.apple.com/v/imac-with-retina/a/images/overview/intro_large_r1_c2_2x_27.jpg
 * - http://images.apple.com/v/imac-with-retina/a/images/overview/intro_large_r1_c3_2x_27.jpg
 * - http://images.apple.com/v/imac-with-retina/a/images/overview/intro_large_r1_c4_2x_27.jpg
 * - http://images.apple.com/v/imac-with-retina/a/images/overview/intro_large_r2_c1_2x_27.jpg
 * - http://images.apple.com/v/imac-with-retina/a/images/overview/intro_large_r2_c2_2x_27.jpg
 * - http://images.apple.com/v/imac-with-retina/a/images/overview/intro_large_r2_c3_2x_27.jpg
 * - http://images.apple.com/v/imac-with-retina/a/images/overview/intro_large_r2_c4_2x_27.jpg
 * - http://images.apple.com/v/imac-with-retina/a/images/overview/intro_fallback_xlarge.jpg
 */
var CanvasImac = (function () {

  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  var keys = {'37': 1, '38': 1, '39': 1, '40': 1};

  var width_image = 6500;
  var height_image = 4612;
  var min_top_position_mac = 190;
  var canvas;

  var sources = {
    r1_c1: {
      path: 'img/intro_large_r1_c1_2x_27.jpg',
      swidth: 0,
      sheight: 0
    },
    r1_c2: {
      path: 'img/intro_large_r1_c2_2x_27.jpg',
      swidth: width_image / 4,
      sheight: 0
    },
    r1_c3: {
      path: 'img/intro_large_r1_c3_2x_27.jpg',
      swidth: (width_image / 4) * 2,
      sheight: 0
    },
    r1_c4: {
      path: 'img/intro_large_r1_c4_2x_27.jpg',
      swidth: (width_image / 4) * 3,
      sheight: 0
    },
    r2_c1: {
      path: 'img/intro_large_r2_c1_2x_27.jpg',
      swidth: 0,
      sheight: height_image / 2
    },
    r2_c2: {
      path: 'img/intro_large_r2_c2_2x_27.jpg',
      swidth: width_image / 4,
      sheight: height_image / 2
    },
    r2_c3: {
      path: 'img/intro_large_r2_c3_2x_27.jpg',
      swidth: (width_image / 4) * 2,
      sheight: height_image / 2
    },
    r2_c4: {
      path: 'img/intro_large_r2_c4_2x_27.jpg',
      swidth: (width_image / 4) * 3,
      sheight: height_image / 2
    }
  };

  /**
   * Class constructor.
   * @constructor
   */
  function CanvasImac(options) {
    if (options !== undefined && options !== null) {
      this.setOptions(options);
    }
    canvas = document.getElementById('my-canvas');
    var context = canvas.getContext('2d');
    canvas.width = width_image;
    canvas.height = height_image;

    this.loadImages(
      sources,
      function (sources) {
        var src;
        for (src in sources) {
          if (sources.hasOwnProperty(src) && sources[src].image) {
            context.drawImage(sources[src].image, sources[src].swidth, sources[src].sheight, width_image / 4, height_image / 2);
          }
        }
      }
    );

    this.eventScroll();
  }

  /**
   * Override the default options.
   *
   * @param {object} options
   *   Custom options.
   */
  CanvasImac.prototype.setOptions = function (options) {
    if (options !== undefined && options.width_image) width_image = options.width_image;
    if (options !== undefined && options.height_image) height_image = options.height_image;
  };

  /**
   * Load the images used in the canvas.
   *
   * @param {array} sources
   *   Associative array with the image path.
   * @param {function} callback
   *   The function callback.
   */
  CanvasImac.prototype.loadImages = function (sources, callback) {
    var src;
    for (src in sources) {
      if (sources.hasOwnProperty(src)) {
        sources[src].image = new Image();
        sources[src].image.src = sources[src].path;
        sources[src].image.onload = function () {
          callback(sources);
        };
      }
    }
  };

  /**
   * Assign the 'listenScroll' event to the scroll.
   */
  CanvasImac.prototype.eventScroll = function () {
    // Older FF.
    if (window.removeEventListener) {
      window.removeEventListener('DOMMouseScroll', this.listenScroll, false);
    }
    // Modern standard.
    window.onmousewheel = document.onmousewheel = this.listenScroll;
    // Older browsers, IE.
    window.onwheel = this.listenScroll;
    // Mobile.
    window.ontouchmove = this.listenScroll;
    document.onkeydown = this.listenScroll;
  };

  /**
   * Scale the canvas according to the scroll up or down.
   */
  CanvasImac.prototype.listenScroll = function () {
    var el = document.getElementById("my-canvas"),
      mac = document.getElementById("mac"),
      macMarginTop = mac.offsetTop,
      macOffset = mac.getBoundingClientRect(),
      macOffsetTop = macOffset.top,
      windowTop = window.scrollY,
      scrollPercent = (macMarginTop - windowTop) / macMarginTop,
      scale = 'scale(' + scrollPercent + ')';

      el.style.transform = scale;

    if (macOffsetTop >= min_top_position_mac) {
      el.style.display = 'block';
    }
    else {
      el.style.display = 'none';
    }
  };

  return CanvasImac;
}());
