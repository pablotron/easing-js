/**
 * Test/Demo page for EasingJS
 * (http://pablotron.org/software/easing-js).
 */

Test = {
  /**
   * Utility function to get the current time.
   */
  now: function() {
    if (Date.now)
      return Date.now();
    else
      return (new Date().getTime());
  },

  /**
   * Utility function to get an element by ID.
   */
  get: function(id) {
    return document.getElementById(id);
  },

  /**
   * Get the value of the specified select element.
   */
  get_val: function(id) {
    var sel = Test.get(id);
    return sel.options[sel.selectedIndex].value;
  },

  /**
   * Animation callback.  Called at 20ms intervals while
   * an animation is in progress.
   */
  step: function() {
    var e = Test.easer,
        now = Test.now() - Test.start,
        end = Test.end - Test.start;

    if (now > end) {
      // clamp to end time
      now = end;

      // clear animation interval
      clearInterval(Test.interval_id);
    }

    // set element style
    Test.el.style.left = e.ease(
      now,      // curr time
      0,        // start position
      500 - 34, // relative end position
      end       // end time
    );
  },

  /**
   * Click handler for "Test Easing" button.
   */
  run: function(o) {
    var dur;

    // init options
    o = o || {};

    // get duration
    dur = o.dur || Test.get('dur').value;

    if (Test.interval_id)
      clearInterval(Test.interval_id);

    // create easer
    Test.easer = new Easing.Easer({
      type: o.type || Test.get_val('type'),
      side: o.side || Test.get_val('side')
    });

    // save start and end times
    Test.start = Test.now();
    Test.end = Test.start + dur * 1000;

    // create animation interval
    Test.interval_id = setInterval(function () {
      Test.step();
    }, 20);
  },

  /**
   * Body onload handler..
   */
  init: function() {
    // cache test element
    Test.el = Test.get('test');

    // attach event listener to run button
    Test.get('run').onclick = function() {
      Test.run();
    };

    // attach event listener to bounce link
    Test.get('bounce').onclick = function() {
      Test.run({
        type: 'bounce',
        side: 'out',
        dur:  1.25
      });

      return false;
    };

    // attach event listener to elastic link
    Test.get('elastic').onclick = function() {
      Test.run({
        type: 'elastic',
        side: 'out',
        dur:  2.0
      });

      return false;
    };
  }
};
