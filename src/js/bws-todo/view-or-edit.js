// Control to view or edit
(function(BWS) {

  BWS.viewedit = {};

  // $view is a HTML element such as P / SPAN / DIV
  // $edit is a form input element
  BWS.viewedit.mk = function($ui) {
    var $view = $ui.find("p").text('-');
    var $edit = $ui.find("input").val('-');
    if ($edit.length === 0)
      $edit = $ui.find("textarea").val('-');
    return new ViewEdit($view, $edit);
  };

  function ViewEdit($view, $edit) {
    this.$view = $view;
    this.$edit = $edit;
    this.showView(); // by default
    addEvents.call(this);
    this.onChangeCallbacks = $.Callbacks();
  }

  ViewEdit.prototype.showView = function() {
    this.$view.show();
    this.$edit.hide();
  };

  ViewEdit.prototype.showEdit = function() {
    this.$view.hide();
    this.$edit.show();
  };

  ViewEdit.prototype.text = function(text) {
    this.$view.text(text);
    this.$edit.val(text);
  };

  ViewEdit.prototype.onChange = function(fn) {
    this.onChangeCallbacks.add(fn);
  };
  
  function addEvents() {
    var _this = this;

    // Double click to edit
    this.$view.dblclick(function() {
      _this.showEdit();
    });

    this.$edit.focusout(function() {
      _this.showView();
      var newVal = _this.$edit.val();
      _this.$view.text(newVal);
      _this.onChangeCallbacks.fire(newVal);
    });
    
  }

} (BWS));
