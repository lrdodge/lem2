var FormController = (function () {

  var _addEventHandlers = function () {
    $("#process-data").click(parseData);
  };

  var parseData = function() {
    var parseResultMessage = $("#data-parse-result-message");
    parseResultMessage.empty();
    $("#data-parse-error-list").remove();

    var csv = $("#data-input").val();
    var data = Papa.parse(csv);

    parseResultMessage.toggleClass("text-danger", data.errors.length > 0);
    parseResultMessage.toggleClass("text-success", !data.errors.length);

    if (!data.errors.length) {
      return;
    }

    parseResultMessage.text("Data Input Errors");

    var errorList = $("<ul/>", {
      "id": "data-parse-error-list"
    });
    data.errors.forEach(function(error) {
        console.error(error);
        var row = $("<span/>", {
          "text": error.row,
          "class": "badge"
        })
        var errorMessage = error.code + ": " + error.message;

        var errorItem = $("<li />", {
          "text": errorMessage
        });
        errorItem.prepend(row);
        errorList.append(errorItem);
    })
    $("#data-parse-result").append(errorList);
  }

  return {
    addEventHandlers: _addEventHandlers
  };

})();

$(document).ready(FormController.addEventHandlers);
