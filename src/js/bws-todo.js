// Coding convention: Var prefix $ represents a jQuery wrapped set.
// Eg. $el = $("#el");

$(function() {
  
  BWS.skel.init('#skeletons');
  BWS.todos.init('#todos');

  // localStorage.clear(); return;
  // putSampleDataIntoDB(); return;
  // console.log(JSON.stringify(BWS.readFromDb(), undefined, 2)); return
  BWS.todos.addMany(BWS.readFromDb());

  $("#bwsMain .new-todo").click(function() {
    BWS.todos.add({});
    return false;
  });
  
});

function putSampleDataIntoDB() {
  BWS.todos.add({
    title: 'Bread',
    details: 'Get 2 loafs of bread',
    targetDate: new Date()
  });

  BWS.todos.add({
    title: 'Laptop battery',
    details: 'Pick up battery (Dell inspiron)',
    targetDate: new Date()
  });

}

// A List of todos
// Initialise once specifying selector of the containing div.
// To add a todo: BWS.todos.add(data) // (data is a hash)
(function(BWS) {

  var $todos;
  BWS.todos = {};
  BWS.todos.init = init;

  BWS.todos.add = function(data) {
    if (!$todos) {
      BWS.errsys('Todos not initialised');
      return;
    }
      
    var todo = BWS.todo.mk(data);
    $todos.append(todo.$ui);
  };

  BWS.todos.addMany = function(data) {
    for (var key in data) {
      BWS.todos.add(data[key]);
    }    
  };

  function init(selector) {
    $todos = $(selector);
    if ($todos.length !== 1)
      BWS.errsys('Unable to initialise todos.');
  }
  
}(BWS));

// skel (Skeletons avoid coding html in JS)
// To clone a skeleton do: BWS.skel(selector) 
(function(BWS) {

  var $skeletons;

  skel.init = init;
  BWS.skel = skel;

  function init(selector) {
    $skeletons = $(selector);
    if ($skeletons.length !== 1)
      BWS.errsys('Unable to initialise skeletons.');
  }

  function skel(selector) {
    if (!$skeletons) {
      BWS.errsys('Skeletons not initialised');
      return;
    }

    var $skel = $skeletons.find(selector);
    if ($skel.length === 1) 
      return $skel.clone();
  }

    
}(BWS));


// Messages
// For user errors: BWS.err(string)
// For system error: BWS.errsys(string)
(function(BWS) {
  // User errors
  BWS.err = function(msg) {
    alert(msg);
  };
    
  // Unexpected system errors
  BWS.errsys = function(msg) {
    alert(msg);
  };
}(BWS));


// Databse
// Get all data from db: BWS.readFromDb()
(function(BWS) {

  if (supports_html5_storage()) {
    BWS.readFromDb = function() {
      var dat = {};
      for (var i = 0; i < localStorage.length; i++){
	var key = localStorage.key(i);
	dat[key] = JSON.parse(localStorage.getItem(key));
      }
      return dat;
    };
  }
  else {
    BWS.readFromDb = function() { return {}; };
    errsys('No support for storage');
  }
  

  function supports_html5_storage() {
    try {
      // User modernizer instead of this function.
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }

} (BWS));

