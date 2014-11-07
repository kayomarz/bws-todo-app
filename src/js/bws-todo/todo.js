// A todo item
(function(BWS) {

  BWS.todo = {};
  BWS.todo.mk = function(data) { 
    var $ui = BWS.skel('.widget-todo');
    return new Todo(data, $ui); 
  };

  function getTodaysDateStr() {
    var dt = new Date();
    return dt.getDate() + '-' +
      (dt.getMonth() + 1) + '-' +
      dt.getFullYear();
  }

  function Todo(data, $ui) {
    this.dat = data;
    this.$ui = $ui;
    this.$ui.$title = $ui.find('.title');
    this.$ui.$details = $ui.find('.details');
    this.$ui.$targetDate = $ui.find('.target-date');
    this.$ui.$done = $ui.find('.done');
    this.dat.index = this.dat.index || mkRandomIndex();
    var _this = this;

    if (typeof this.dat.done === "undefined")
      this.dat.done = false;

    if (typeof this.dat.targetDate === "undefined")
      this.dat.targetDate = getTodaysDateStr();

    if (this.dat.done)
      this.$ui.$done.prop('checked', this.dat.done);

    this.$ui.$done.change(function() {
      _this.dat.done = this.checked;
      _this.dbWrite(); 
    });

    this.veTitle = BWS.viewedit.mk(this.$ui.$title);
    this.veTitle.onChange(function(newVal) { 
      _this.dat.title = newVal;
      _this.dbWrite(); 
    });

    this.veDetails = BWS.viewedit.mk(this.$ui.$details);
    this.veDetails.onChange(function(newVal) { 
      _this.dat.details = newVal;
      _this.dbWrite(); 
    });

    this.veTargetDate = BWS.viewedit.mk(this.$ui.$targetDate);
    var _veTargetDate = this.veTargetDate;
    this.veTargetDate.onChange(function(newVal, oldVal) { 
      if (BWS.parseDate(newVal)) {
	_this.dat.targetDate = newVal;
	_this.dbWrite(); 
      } else {
	alert('invalid date ' + newVal);
      }
    });

    

    this.setData(true);
    enableControls.call(this);
  };

  Todo.prototype.dbWrite = function() {
    console.log('write to ' + this.dat.index);
    localStorage[this.dat.index] = JSON.stringify(this.dat);
  };

  function enableControls() {
    var _this = this;
    this.$ui.find('.controls .delete').click(function(){
      console.log('del ' + _this.dat.index);
      _this.$ui.remove();
      localStorage.removeItem(_this.dat.index);
    });
  }

  Todo.prototype.setData = function(disableDbWrite) {
    this.dat.title && this.veTitle.text(this.dat.title);
    this.dat.details && this.veDetails.text(this.dat.details);
    this.dat.targetDate && this.veTargetDate.text(this.dat.targetDate);
    if (!disableDbWrite)
      this.dbWrite();
  };

  function mkRandomIndex() {
    var val =  Date.now().toString() + Math.random().toString(36).substring(7);
    console.log('random ' + val);
    return val;
    // Checkout: 
    // http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript/8084248#8084248
  }

}(BWS));


(function(BWS){
  function parseDate(str) {
    if (!str)
      return false;
    var separator = (str.indexOf('-') >= 0) ? '-' : '/';
    var parts = str.split(separator);
    if (parts.length != 3)
      return false;
    try {
      var day = parseInt(parts[0]);
      var month = parseInt(parts[1] - 1);
      var year = parseInt(parts[2]);
      var dt = new Date(year, month, day);
      console.log(dt.toString());
      return true;
    } catch(e) {
      return false;
    }
  }

  BWS.parseDate = parseDate;
  
}(BWS));
