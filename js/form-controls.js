var FormController = (function () {

  var _addEventHandlers = function () {
    $("#process-data").click(processData);
  };

  var parseData = function() {
    var parseResultMessage = $("#data-parse-result-message");
    var rulesContainer = $("#rules-div");

    rulesContainer.hide();
    parseResultMessage.empty();
    $("#data-parse-error-list").remove();
    $("#rules-list").remove();

    var csv = $("#data-input").val();
    var data = Papa.parse(csv);

    parseResultMessage.toggleClass("text-danger", data.errors.length > 0);
    parseResultMessage.toggleClass("text-success", !data.errors.length);

    if (!data.errors.length) {
      rulesContainer.show();
      return data;
    }

    rulesContainer.hide();
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
  };

  var displayRules = function(rules) {
    var ruleList = $("<ol/>", {
      "id": "rules-list"
    });
    rules.forEach(function(rule) {
      console.log(rule);
      var ruleText = "";
      rule.conditions.forEach(function(condition) {
        ruleText += "(" + condition.attribute + "," + condition.value + ") && ";
      });
      ruleText = ruleText.substring(0, ruleText.length - 3);
      ruleText += "-> ";
      ruleText += "(" + rule.decision.name + "," + rule.decision.value + ")"

      var ruleItem = $("<li/>", {
        "text": ruleText
      });
      ruleList.append(ruleItem);
      $("#rules-div").append(ruleList);
    });
  };

  var processData = function() {
    var data = parseData().data;
    LEM2.dataset = data;
    var concept = new Set([1,2,4,5]);
    var ruleset = LEM2.executeProcedure(concept);
    displayRules(ruleset.rules);
  };

  return {
    addEventHandlers: _addEventHandlers
  };

})();

$(document).ready(FormController.addEventHandlers);
