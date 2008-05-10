load('easing.js');

Test = {
  test: function(e) {
    for (var i = 0; i <= 10; i++)
      print(i + "," + e.ease(i, 0, 10, 10));
  }, 

  run: function(e) {
    for (var type in Easing.VALID.type) {
      for (var side in Easing.VALID.side) {
        print("test:" + type + "," + side);
        e.reset({type:type, side:side});
        this.test(e);
      }
    }
  }, 

  init: function() {
    var e = new Easing.Easer();
    this.run(e);
  }
};

Test.init();
