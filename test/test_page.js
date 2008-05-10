
Test = {
  now: function() {
    if (Date.now)
      return Date.now();
    else
      return (new Date().getTime());
  },

  get: function(id) {
    return document.getElementById(id);
  },

  get_val: function(key) {
    var sel = Test.get(key);
    return sel.options[sel.selectedIndex].value;
  },

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

  run: function() {
    var dur = Test.get('dur').value;

    if (Test.interval_id)
      clearInterval(Test.interval_id);

    // create easer
    Test.easer = new Easing.Easer({
      type: Test.get_val('type'),
      side: Test.get_val('side')
    });

    // save start and end times
    Test.start = Test.now();
    Test.end = Test.start + dur * 1000;

    // create animation interval
    Test.interval_id = setInterval(function () {
      Test.step();
    }, 20);
  },

  init: function() {
    // cache test element
    Test.el = Test.get('test');

    // attache event listener
    Test.get('run').onclick = function() {
      Test.run();
    };
  }
};
