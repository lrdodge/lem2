var FormController = (function () {

  var _addEventHandlers = function () {
    $("#process-data-button").click(loadData);
    $("#induce-rules-button").click(induceRules);
    $("input[name='dataset-options']").change(updateDataInputField);
  };

  var updateDataInputField = function () {
    var dataInputField = $("#data-input");

    switch (this.id) {
      case "dataset-1":
        dataInputField.val("temperature,headache,weakness,nausea,flu\nvery_high,yes,yes,no,yes\nhigh,yes,no,yes,yes\nnormal,no,no,no,no\nnormal,yes,yes,yes,yes\nhigh,no,yes,no,yes\nhigh,no,no,no,no\nnormal,no,yes,no,no")
        break;
      case "dataset-2":
        dataInputField.val("temperature,headache,nausea,cough,flu\nhigh,yes,no,yes,yes\nvery_high,yes,yes,no,yes\nhigh,no,no,no,no\nhigh,yes,yes,yes,yes\nnormal,yes,no,no,no\nnormal,no,yes,yes,no")
        break;
      default:
        dataInputField.val("");
    }
  }

  var parseData = function () {
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
    data.errors.forEach(function (error) {
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

  var displayRules = function (rules) {
    var rulesContainer = $("#rules-div");
    var ruleList = $("<ol/>", {
      "id": "rules-list"
    });

    rules.forEach(function (rule) {
      var ruleItem = $("<li/>");

      rule.conditions.forEach(function (condition, conditionIndex) {
        var condition = " (" + condition.attribute + ", " + condition.value + ") ";
        ruleItem.append(condition);

        if (conditionIndex === rule.conditions.length - 1) {
          return false;
        }

        var upArrow = $("<i/>", {
          "class": "fa fa-chevron-up",
          "aria-hidden": true
        });
        ruleItem.append(upArrow);
      });

      var rightArrow = $("<i/>", {
        "class": "fa fa-long-arrow-right",
        "aria-hidden": true
      });
      ruleItem.append(rightArrow);

      var decision = " (" + rule.decision.name + ", " + rule.decision.value + ")";
      ruleItem.append(decision);

      ruleList.append(ruleItem);
      rulesContainer.append(ruleList);
    });

    rulesContainer.show();
  };

  var loadData = function () {
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
    var conceptModalBody = $("#concept-modal-form");
    conceptModalBody.empty();
    LEM2.concepts.forEach(function (concept, conceptIndex) {

      var radioButtonContainer = $("<div/>", {
        "class": "radio"
      });
      var radioButtonLabel = $("<label>", {
        "text": "(" + concept.decision + ", " + concept.value + ") = " + concept.cases.toString()
      });
      var radioButton = $("<input/>", {
        "type": "radio",
        "name": "concept",
        "id": "concept-" + conceptIndex,
        "value": conceptIndex
      });

      radioButtonLabel.prepend(radioButton);
      radioButtonContainer.append(radioButtonLabel);
      conceptModalBody.append(radioButtonContainer);
      conceptModalBody.validate({
        errorClass: "text-danger",
        errorPlacement: function (error, element) {
          error.appendTo(element.closest("form"));
        },
        rules: {
          concept: {
            required: true
          }
        }
      });
    });

    $("#concept-modal").modal();
  };

  var induceRules = function () {
    if (!$("#concept-modal-form").valid()) {
      return;
    }

    var conceptIndex = $("input[name='concept']:checked").val();
    var ruleset = LEM2.executeProcedure(LEM2.concepts[conceptIndex]);
    displayRules(ruleset.rules);
    $("#concept-modal").modal('hide');
  };

  return {
    addEventHandlers: _addEventHandlers
  };

})();

$(document).ready(FormController.addEventHandlers);
