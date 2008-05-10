//
// Copyright (c) 2008 Paul Duncan (paul@pablotron.org)
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//

/**
 * Easer: namespace for Easier class and methods.
 * @namespace
 */
Easing = (function () {
  // return namespace
  var E       = {};

  // import math functions to speed up ease callbacks
  var abs     = Math.abs,
      asin    = Math.asin,
      cos     = Math.cos, 
      pow     = Math.pow,
      sin     = Math.sin, 
      sqrt    = Math.sqrt,
      PI      = Math.PI,
      HALF_PI = Math.PI / 2;

  E = {
    VERSION: '0.1.0',

    DEFAULTS: {
      type: 'linear',
      side: 'none'
    },

    VALID: {
      type: { 
        linear:     true, 
        bounce:     true,
        circular:   true,
        cubic:      true,
        elastic:    true,
        exp:        true,
        quadratic:  true,
        quartic:    true,
        quintic:    true,
        sine:       true 
      },

      side: { 
        none: true, 
        'in': true, 
        out:  true, 
        both: true 
      }
    } 
  };

  /**
   * Easing.Easer: Easing class.
   * @class Easing class.
   */
  E.Easer = function(o) {
    var key;

    // set defaults
    for (key in E.DEFAULTS)
      this[key] = E.DEFAULTS[key];

    this.reset(o);
  };

  E.Easer.prototype.reset = function(o) {
    var key, name, type, side, err;
    for (key in o)
      this[key] = o[key];

    // get/check type
    type = (this.side != 'none') ? this.type : 'linear';
    if (!E.VALID.type[type])
      throw new Error("unknown type: " + this.type);

    // get/check side
    side = (type != 'linear') ? this.side : 'none';
    if (!E.VALID.side[side])
      throw new Error("unknown side: " + this.side);

    // build callback name
    name = ['ease', type, side].join('_');
    this.fn = E[name];

    // make sure callback exists
    if (!this.fn) {
      err = "type = " + this.type + ", side = " + this.side;
      throw new Error("unknown ease: " + err);
    }
  };

  E.Easer.prototype.ease = function(time_now, begin_val, change_val, time_dur) {
    return this.fn.apply(this, arguments);
  };

  /*****************/
  /* linear easing */
  /*****************/

  E.ease_linear_none = function(t, b, c, d) {
    return c * t / d + b;
  };

  /***************/
  /* back easing */
  /***************/

  var BACK_DEFAULT_S = 1.70158;

  E.ease_back_in = function(t, b, c, d, s) {
    if (s == undefined) s = BACK_DEFAULT_S;
    return c*(t/=d)*t*((s+1)*t - s) + b;
  };

  E.ease_back_out = function(t, b, c, d, s) {
		if (s == undefined) s = BACK_DEFAULT_S;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	};

  E.ease_back_both = function(t, b, c, d, s) {
		if (s == undefined) s = BACK_DEFAULT_S; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	};

  /*****************/
  /* bounce easing */
  /*****************/

  var bounce_ratios = [
    1 / 2.75,
    2 / 2.75,
    2.5 / 2.75
  ];

  var bounce_factors = [
    null,
    1.5 / 2.75,
    2.25 / 2.75,
    2.625 / 2.75
  ];

  E.ease_bounce_out = function(t, b, c, d) {
    if ((t/=d) < (bounce_ratios[0])) {
      return c*(7.5625*t*t) + b;
    } else if (t < (bounce_ratios[1])) {
      return c*(7.5625*(t-=(bounce_factors[1]))*t + .75) + b;
    } else if (t < (bounce_ratios[2])) {
      return c*(7.5625*(t-=(bounce_factors[2]))*t + .9375) + b;
    } else {
      return c*(7.5625*(t-=(bounce_factors[3]))*t + .984375) + b;
    }
  };

  E.ease_bounce_in = function(t, b, c, d) {
    return c - E.ease_bounce_out(d-t, 0, c, d) + b;
  };

  E.ease_bounce_both = function(t, b, c, d) {
    if (t < d/2) return E.ease_bounce_in(t*2, 0, c, d) * .5 + b;
    else return E.ease_bounce_out(t*2-d, 0, c, d) * .5 + c*.5 + b;
  };

  /*******************/
  /* circular easing */
  /*******************/

  E.ease_circular_in = function(t, b, c, d) {
    return -c * (sqrt(1 - (t/=d)*t) - 1) + b;
  };

  E.ease_circular_out = function(t, b, c, d) {
    return c * sqrt(1 - (t=t/d-1)*t) + b;
  };

  E.ease_circular_both = function(t, b, c, d) {
    if ((t/=d/2) < 1) return -c/2 * (sqrt(1 - t*t) - 1) + b;
    return c/2 * (sqrt(1 - (t-=2)*t) + 1) + b;
  };

  /****************/
  /* cubic easing */
  /****************/

  E.ease_cubic_in = function(t, b, c, d) {
    return c*(t/=d)*t*t + b;
  };

  E.ease_cubic_out = function(t, b, c, d) {
    return c*((t=t/d-1)*t*t + 1) + b;
  };

  E.ease_cubic_both = function(t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  };

  /******************/
  /* elastic easing */
  /******************/

  E.ease_elastic_in = function(t, b, c, d, a, p) {
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (!a || a < abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*PI) * asin(c/a);
    return -(a*pow(2,10*(t-=1)) * sin( (t*d-s)*(2*PI)/p )) + b;
  };

  E.ease_elastic_out = function(t, b, c, d, a, p) {
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (!a || a < abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*PI) * asin(c/a);
    return (a*pow(2,-10*t) * sin( (t*d-s)*(2*PI)/p ) + c + b);
  };

  E.ease_elastic_both = function(t, b, c, d, a, p) {
    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
    if (!a || a < abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*PI) * asin (c/a);
    if (t < 1) return -.5*(a*pow(2,10*(t-=1)) * sin( (t*d-s)*(2*PI)/p )) + b;
    return a*pow(2,-10*(t-=1)) * sin( (t*d-s)*(2*PI)/p )*.5 + c + b;
  };

  /**********************/
  /* exponential easing */
  /**********************/

  E.ease_exp_in = function(t, b, c, d) {
    return (t==0) ? b : c * pow(2, 10 * (t/d - 1)) + b;
  };

  E.ease_exp_out = function(t, b, c, d) {
    return (t==d) ? b+c : c * (-pow(2, -10 * t/d) + 1) + b;
  };

  E.ease_exp_both = function(t, b, c, d) {
    if (t==0) return b;
    if (t==d) return b+c;
    if ((t/=d/2) < 1) return c/2 * pow(2, 10 * (t - 1)) + b;
    return c/2 * (-pow(2, -10 * --t) + 2) + b;
  };

  /********************/
  /* quadratic easing */
  /********************/

  E.ease_quadratic_in = function(t, b, c, d) {
    return c*(t/=d)*t + b;
  };

  E.ease_quadratic_out = function(t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  };

  E.ease_quadratic_both = function(t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  };

  /******************/
  /* quartic easing */
  /******************/

  E.ease_quartic_in = function(t, b, c, d) {
    return c*(t/=d)*t*t*t + b;
  };

  E.ease_quartic_out = function(t, b, c, d) {
    return -c * ((t=t/d-1)*t*t*t - 1) + b;
  };

  E.ease_quartic_both = function(t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
  };

  /******************/
  /* quintic easing */
  /******************/

  E.ease_quintic_in = function(t, b, c, d) {
    return c*(t/=d)*t*t*t*t + b;
  };

  E.ease_quintic_out = function(t, b, c, d) {
    return c*((t=t/d-1)*t*t*t*t + 1) + b;
  };

  E.ease_quintic_both = function(t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b;
  };

  /*********************/
  /* sinusoidal easing */
  /*********************/

  E.ease_sine_in = function(t, b, c, d) {
    return -c * cos(t/d * (HALF_PI)) + c + b;
  };

  E.ease_sine_out = function(t, b, c, d) {
    return c * sin(t/d * (HALF_PI)) + b;
  };

  E.ease_sine_both = function(t, b, c, d) {
    return -c/2 * (cos(PI*t/d) - 1) + b;
  };

  // return scope
  return E;
})();
