var FormController = (function () {

  var _addEventHandlers = function () {
    $("#load-data-button").click(initializeLem2);
    $("#induce-rules-button").click(invokeLem2);
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

  var covnertCsv = function() {
    var csvInput = $("input[name='dataset-options']:checked").val();
    var config = {
      skipEmptyLines: true,
      complete: function(results) {
        verifyCsv(results);
      }
    };

    if (csvInput !== "dataset-file") {
      var csvRaw = $("#data-input").val();
      Papa.parse(csvRaw, config);
      return;
    }

    var selectedFile = $('#input-file')[0].files[0];
    if (selectedFile) {
      Papa.parse(selectedFile, config);
    }
  };

  var verifyCsv = function(csv) {
    if (csv.errors.length) {
      showParseErrors(csv.errors);
      return;
    }

    LEM2.initialize(csv.data);
    newConceptModal();
    $("#concept-modal").modal();
  };

  var showParseErrors = function(errors) {
    var errorList = $("<ul/>");
    errors.forEach(function (error) {
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
    });

    $("#data-input-error-message").append(errorList);
    $("#data-input-error-alert").show();
  };

  var newConceptRadioButton = function(concept, conceptIndex) {

    // Radio Button

    var radioButtonContainer = $("<div/>", {
      "class": "radio"
    });
    var radioButtonLabel = $("<label/>", {
      "text": "(" + concept.decision + ", " + concept.value + ")"
    });
    var radioButton = $("<input/>", {
      "type": "radio",
      "name": "concept",
      "id": "concept-" + conceptIndex,
      "value": conceptIndex
    });

    radioButtonLabel.prepend(radioButton);
    radioButtonContainer.append(radioButtonLabel);

    // Concept Cases

    var conceptCasesButton = $("<span/>", {
      "class": "badge pull-right",
      "style": "cursor:pointer;",
      "text": concept.cases.size
    });
    var conceptCases = $("<p/>", {
      "text": concept.cases.toString(),
      "style": "display: none; word-wrap: break-word;"
    });

    $(conceptCasesButton).click(function() { conceptCases.toggle(); });

    radioButtonContainer.append(conceptCasesButton);
    radioButtonContainer.append(conceptCases);

    return radioButtonContainer;
  };

  var newConceptModal = function() {
    var conceptModalBody = $("#concept-modal-form");
    conceptModalBody.empty();

    LEM2.datasetConcepts.forEach(function (concept, conceptIndex) {
      var radiobutton = newConceptRadioButton(concept, conceptIndex);
      conceptModalBody.append(radiobutton);
    });

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
  };

  var showRules = function (rules) {
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

  var initializeLem2 = function (data) {
    $("#rules-div").hide();
    $("#rules-list").remove();
    $("#data-input-error-alert").hide();
    $("#data-input-error-message").empty();
    covnertCsv();
  };

  var invokeLem2 = function () {
    if (!$("#concept-modal-form").valid()) {
      return;
    }

    $("#concept-modal").modal('hide');

    var conceptIndex = $("input[name='concept']:checked").val();
    LEM2.invokeProcedure(LEM2.datasetConcepts[conceptIndex]);
    showRules(LEM2.singleLocalCovering);
  };

  return {
    addEventHandlers: _addEventHandlers
  };

})();

$(document).ready(FormController.addEventHandlers);
