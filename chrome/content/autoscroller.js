if(!AutoScroller)
    var AutoScroller = {};

(function(){
  window.addEventListener("load", init, false);

  var options;

  var state = 0;
  var interval;
  var menu;
  var move;
  var delta;
  var before;
  var orient = true;
  var w;
  var id = null;
  var id2content = [];

  function init(){
    options = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService)
                .getBranch("extensions.autoscroller.");

    interval = options.getIntPref("interval");
    delta    = options.getIntPref("delta");
    move     = options.getIntPref("move");

    var keys = [
        "trigger", "back", "accel", "brake", "orient"
    ];
    for(var i = 0; i < keys.length; ++i){
        var k = keys[i];

        var key     = options.getCharPref("keys." + k + ".key");
        var accel   = options.getBoolPref("keys." + k + ".accel");
        var alt     = options.getBoolPref("keys." + k + ".alt");

        setShortcut(k, key, accel, alt);
    }

    options.QueryInterface(Components.interfaces.nsIPrefBranch2);
    options.addObserver("", observer, false);

    menu = document.getElementById("autoscroller.menu.trigger");
  }

  function setShortcut(target, key, accel, alt){
      var elm = document.getElementById("autoscroller.keys." + target);

      if(!elm)
          return ;

      if(key != undefined)
          elm.setAttribute("key", key);

      if(accel != undefined && alt != undefined){
          var modifiers = accel ? "accel" : "";
          if(alt)
              modifiers = accel ? modifiers + " alt" : "alt";

          elm.setAttribute("modifiers", modifiers);
      }
  }

  function scroll(){
      if(orient)
          w.scrollBy(0, move);
      else
          w.scrollBy(0, -move);

      if(before == w.scrollY)
          AutoScroller.trigger();
      else
          before = w.scrollY;
  }

  function start(target){
      w = target || content;
      height = w.document.documentElement.scrollHeight;
      id = w.setInterval(scroll, 1000 / interval);
  }

  function stop(){
      w.clearInterval(id);
      id = null;
  }

  AutoScroller.trigger = function(){
      if(id == null){
          menu.setAttribute("checked", "true");
          start(content);
      }else{
          menu.setAttribute("checked", "false");
          stop();
      }
  };

  AutoScroller.back = function(){
      orient = false;
      if(id == null)
          AutoScroller.trigger();
  };

  AutoScroller.accel = function(){
      move += delta;
      options.setIntPref("move", move);
  };

  AutoScroller.brake = function(){
      move = move - delta < 0 ? 0 : move - delta;
      options.setIntPref("move", move);
  };

  AutoScroller.orient = function(){
      orient = !orient;
      var elm = document.getElementById("autoscroller.keys.orient");
      elm.setAttribute("checked", orient);
  };

  function parseShortcut(data){
      var result = data.match(/autoscroller\.keys\.([^.]+?)\.[^.]+$/);
      if(result != null){
          var base = "autoscroller.keys." + result[1];
          var key   = options.getCharPref(base + ".key");
          var accel = options.getBoolPref(base + ".accel");
          var alt   = options.getBoolPref(base + ".alt");

          setShortcut(result[1], key, accel, alt);
      }
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
        case "interval":
            interval = options.getIntPref("interval");
            stop();
            start(w);
            break;
        case "move":
            move = options.getIntPref("move");
            break;
        case "delta":
            delta = options.getIntPref("delta");
            break;
        default:
            parseShortcut(data);
        }
    }
  };
})();
