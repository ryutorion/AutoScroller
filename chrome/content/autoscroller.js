if(!AutoScroller)
  var AutoScroller = {};

(function(){
  window.addEventListener("load", init, false);

  var state;
  var options;
  var menu;
  var line = { interval : 0, delta : 0, num : 0 };
  var smooth = { interval : 0, delta : 0, num : 0 };
  var mode;
  var orient = true;
  var timer;

  function init(){
    state = false;
    options = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService)
                .getBranch("extensions.autoscroller.");

    menu = document.getElementById("autoscroller.execute");

    line.interval = options.getIntPref("line.interval") || 1000;
    line.delta    = options.getIntPref("line.delta") || 100;
    line.num      = options.getIntPref("line.number") || 1;

    mode = options.getIntPref("mode") || 1;

    smooth.intervale = options.getIntPref("smooth.interval");
    smooth.deltae    = options.getIntPref("smooth.delta");
    smooth.num       = options.getIntPref("smooth.number");

    options.QueryInterface(Components.interfaces.nsIPrefBranch2);
    options.addObserver("", observer, false);
  }

  AutoScroller.execute = function(){
    if(state){
      // When scrolling
    }else{
      // When not scrolling
    }
  };

  AutoScroller.reverse = function(){
  };

  AutoScroller.accelerate = function(){
  };

  AutoScroller.brake = function(){
  };

  function lineScroll(){
  }

  function smoothScroll(){
  }

  var observer = {
    unregister : function(){
      if(options)
        options.removeObserver("", this);
    },
    observe : function(subject, topic, data){
      if(topic != "nsPref:changed")
        return ;

      switch(data){
      case "mode":
        break;
      case "line.interval":
        break;
      case "line.delta":
        break;
      case "line.number":
        break;
      case "smooth.interval":
        break;
      case "smooth.delta":
        break;
      case "smooth.number":
        break;
      }
    }
  };
})();
