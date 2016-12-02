var FormController = (function () {

  var _addEventHandlers = function () {
    $("#process-data-button").click(loadData);
    $("#induce-rules-button").click(induceRules);
  };

  var parseData = function() {
    var dataInputErrorAlert = $("#data-input-error-alert");
    var dataInputErrorMessage = $("#data-input-error-message");

    dataInputErrorAlert.hide();
    dataInputErrorMessage.empty();

    var csv = $("#data-input").val();
    var data = Papa.parse(csv);

    if (!data.errors.length) {
      return data;
    }

    var errorList = $("<ul/>");
    data.errors.forEach(function(error) {
        console.error(error);
        var row = $("<span/>", {
          "text": error.row,
          "class": "badge"
        })
        var errorMessage = " " + error.code + ": " + error.message;

        var errorItem = $("<li />", {
          "text": errorMessage
        });
        errorItem.prepend(row);
        errorList.append(errorItem);
    })
    dataInputErrorMessage.append(errorList);
    dataInputErrorAlert.show();

    return false;
  };

  var displayRules = function(rules) {
    var rulesContainer = $("#rules-div");

    var ruleList = $("<ol/>", {
      "id": "rules-list"
    });
    rules.forEach(function(rule) {
      var ruleText = "";
      rule.conditions.forEach(function(condition) {
        ruleText += "(" + condition.attribute + ", " + condition.value + ") && ";
      });
      ruleText = ruleText.substring(0, ruleText.length - 3);
      ruleText += "-> ";
      ruleText += "(" + rule.decision.name + ", " + rule.decision.value + ")"

      var ruleItem = $("<li/>", {
        "text": ruleText
      });
      ruleList.append(ruleItem);
      rulesContainer.append(ruleList);
    });

    rulesContainer.show();
  };

  var loadData = function() {
    $("#rules-div").hide();
    $("#rules-list").remove();

    var csv = parseData();
    if (!csv) {
      return;
    }

    var data = csv.data;

    // Initialize
    LEM2.dataset = data;
    LEM2.newAttributeValueBlocks();
    LEM2.newConcepts();

    // Build Concept Chooser Modal
    var conceptModalBody = $("#concept-modal-body");
    conceptModalBody.empty();
    LEM2.concepts.forEach(function(concept, conceptIndex) {

      var radioButtonContainer = $("<div/>", {
        "class": "radio"
      });
      var radioButtonLabel = $("<label>", {
        "text": "(" + concept.decision + ", " + concept.value + ") = " + concept.cases.toString()
      });
      var radioButton = $("<input/>", {
        "type": "radio",
        "name": "concept-choice",
        "id": "concept-" + conceptIndex,
        "value": conceptIndex
      });

      radioButtonLabel.prepend(radioButton);
      radioButtonContainer.append(radioButtonLabel);
      conceptModalBody.append(radioButtonContainer);
    });

    $("#concept-modal").modal();
  };

  var induceRules = function() {
    var conceptIndex = $("input[name='concept-choice']:checked").val();
    var ruleset = LEM2.executeProcedure(LEM2.concepts[conceptIndex]);
    displayRules(ruleset.rules);
    $("#concept-modal").modal('hide');
  };

  return {
    addEventHandlers: _addEventHandlers
  };

})();

$(document).ready(FormController.addEventHandlers);
