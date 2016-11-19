var FormController = (function () {

  var _addEventHandlers = function () {
    $("#process-data").click(processData);
  };

  var processData = function() {
    var csv = $("#data-input").val();
    var data = Papa.parse(csv);
  }

  return {
    addEventHandlers: _addEventHandlers
  };

})();

$(document).ready(FormController.addEventHandlers);
