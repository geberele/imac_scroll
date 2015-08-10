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

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {'37': 1, '38': 1, '39': 1, '40': 1};

var width_image = 6500;
var height_image = 4612;
var width_max = 6500;
var width_min = 865;
var increase = 0.045;
var increase_grow = 0.0001;
var max_top_zoom_up = -1800;
var max_top_zoom_down = 500;
var final_top_position;
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
 *
 * @param {object} options
 *   Custom options.
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
      for (var src in sources) {
        if (sources.hasOwnProperty(src) && sources[src].image) {
          context.drawImage(sources[src].image, sources[src].swidth, sources[src].sheight, width_image / 4, height_image / 2);
        }
      }
    }
  );

  window.scrollTo(10, 10);
  this.disableScroll();
  this.initialPosition();
  this.scrollDown();
}

/**
 * Override the default options.
 *
 * @param {object} options
 *   Custom options.
 */
CanvasImac.prototype.setOptions = function (options) {
  if (options !== undefined && options.width_image) width_image = options.width_image;
  if (options !== undefined && options.width_max) width_max = options.width_max;
  if (options !== undefined && options.width_min) width_min = options.width_min;
  if (options !== undefined && options.height_image) height_image = options.height_image;
  if (options !== undefined && options.increase) increase = options.increase;
  if (options !== undefined && options.increase_grow) increase_grow = options.increase_grow;
  if (options !== undefined && options.max_top_zoom_up) max_top_zoom_up = options.max_top_zoom_up;
  if (options !== undefined && options.max_top_zoom_down) max_top_zoom_down = options.max_top_zoom_down;
};

/**
 * Set the initial position of the canvas.
 */
CanvasImac.prototype.initialPosition = function () {
  canvas.style.top = max_top_zoom_up + 'px';
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
  for (var src in sources) {
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
 * Disable the events linked to the scroll and add the custom functions.
 */
CanvasImac.prototype.preventDefault = function (e) {
  e = e || window.event;
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  if (delta > 0) {
    CanvasImac.prototype.scrollUp();
  }
  else {
    CanvasImac.prototype.scrollDown();
  }
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.returnValue = false;
};

/**
 * Disable the events linked to the keys.
 */
CanvasImac.prototype.preventDefaultForScrollKeys = function (e) {
  if (keys[e.keyCode]) {
    this.preventDefault(e);
    return false;
  }
};

/**
 * Enable the zoom on the canvas when the scroll goes up.
 */
CanvasImac.prototype.checkScroll = function (e) {
  e = e || window.event;
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  if (delta > 0) {
    var positions = canvas.getBoundingClientRect();
    if (positions.top <= Math.round(final_top_position) + 1
      || positions.top >= Math.round(final_top_position) - 1) {
      CanvasImac.prototype.disableScroll();
    }
  }
};

/**
 * Disable the scroll.
 */
CanvasImac.prototype.disableScroll = function () {
  // Older FF.
  if (window.addEventListener) {
    window.addEventListener('DOMMouseScroll', this.preventDefault, false);
  }
  // Modern standard.
  window.onwheel = this.preventDefault;
  // Older browsers, IE.
  window.onmousewheel = document.onmousewheel = this.preventDefault;
  // Mobile.
  window.ontouchmove = this.preventDefault;
  document.onkeydown = this.preventDefaultForScrollKeys;
};

/**
 * Enable the scroll.
 */
CanvasImac.prototype.enableScroll = function () {
  // Older FF.
  if (window.removeEventListener) {
    window.removeEventListener('DOMMouseScroll', this.checkScroll, false);
  }
  // Modern standard.
  window.onmousewheel = document.onmousewheel = this.checkScroll;
  // Older browsers, IE.
  window.onwheel = this.checkScroll;
  // Mobile.
  window.ontouchmove = this.checkScroll;
  document.onkeydown = this.checkScroll;
};

/**
 * Decrease the image size during the scroll down.
 */
CanvasImac.prototype.scrollDown = function () {
  var width = parseInt(canvas.style.width) || width_max;
  var new_width = Math.max(width_min, width - (width * increase));

  if (new_width > width_min) {
    increase = increase + increase_grow;

    var range = Math.abs(max_top_zoom_up) + Math.abs(max_top_zoom_down);
    var x = (new_width * 100) / width_max;
    var x_in_context = (x * range) / 100;
    var move_to_top = -(x_in_context - Math.abs(max_top_zoom_down));

    canvas.style.top = move_to_top + "px";
    canvas.style.width = new_width + "px";
    canvas.style.marginLeft = document.body.offsetWidth - (new_width / 2) + "px";
  }

  // Enable scroll when the image gets the minimum size.
  if (new_width == width_min) {
    final_top_position = parseInt(canvas.style.top);
    this.enableScroll();
  }
};

/**
 * Increase the image size during the scroll up.
 */
CanvasImac.prototype.scrollUp = function () {
  var width = parseInt(canvas.style.width) || width_max;
  var new_width = Math.min(width_max, width + (width * increase));

  if (width < new_width && new_width <= width_max) {
    increase = increase - increase_grow;

    var range = Math.abs(max_top_zoom_up) + Math.abs(max_top_zoom_down);
    var x = (new_width * 100) / width_max;
    var x_in_context = (x * range) / 100;
    var move_to_top = - (x_in_context - Math.abs(max_top_zoom_down));

    canvas.style.top = move_to_top + "px";
    canvas.style.width = new_width + "px";
    canvas.style.marginLeft = document.body.offsetWidth - (new_width / 2) + "px";
  }
};
