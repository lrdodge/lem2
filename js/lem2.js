var LEM2 = {
  blocks: {},
  dataset: [],
  datasetConcepts: [],
  singleLocalCovering: [],
  goal: new Set(),
  concept: { "decision": "", "value": "", "cases": new Set() },

  newConcepts: function () {
    LEM2.datasetConcepts = [];

    var decisionIndex = LEM2.dataset[0].length - 1;
    var dataset = LEM2.dataset.slice(0);
    var decision = dataset[0][decisionIndex];
    // Remove decision label
    dataset.shift();

    var column = dataset.map(function (value) {
      return value[decisionIndex];
    });

    var decisionValues = column.filter(function (value, index, self) {
      return self.indexOf(value) === index;
    });

    decisionValues.forEach(function (decisionValue) {
      var cases = column.reduce(function (decisionValues, value, index) {
        if (value === decisionValue) {
          decisionValues.push(index + 1);
        }
        return decisionValues;
      }, []);

      var concept = {
        "decision": decision,
        "value": decisionValue,
        "cases": new Set(cases)
      };

      LEM2.datasetConcepts.push(concept);
    });
  },

  newAttributeValueBlocks: function () {
    LEM2.blocks = {};
    const dataset = [];
    LEM2.dataset.forEach(function (row, rowIndex) {
      dataset[rowIndex] = row.slice(0);
    });

    var attributeNames = dataset[0].slice(0);
    // Remove decision label
    attributeNames.pop();
    // Remove labels
    dataset.shift();

    attributeNames.forEach(function (attributeName, attributeIndex) {
      LEM2.blocks[attributeName] = {};

      var column = dataset.map(function (value) {
        return value[attributeIndex];
      });

      // TODO: Refactor indentation levels
      var attributeValues = [];
      column.forEach(function (attributeValue) {
        if (attributeValue.size) {
          attributeValue.forEach(function (setValue) {
            // TODO: Combine usage of duplicate code
            if (attributeValues.indexOf(setValue) === -1) {
              attributeValues.push(setValue);
            }
          });
          return;
        }

        if (attributeValues.indexOf(attributeValue) !== -1) {
          return;
        }

        attributeValues.push(attributeValue);
      });

      attributeValues.forEach(function (attributeValue) {
        LEM2.blocks[attributeName][attributeValue] = column.reduce(function (attributeValues, value, index) {

          if (value.size) {
            value.forEach(function (setValue) {
              // TODO: Combine usage of duplicate code
              if (setValue === attributeValue) {
                attributeValues.push(index + 1);
              }
            });
            return attributeValues;
          }

          if (value === attributeValue) {
            attributeValues.push(index + 1);
          }
          return attributeValues;
        }, []);
      });
    });
  },

  initialize: function (dataset) {
    LEM2.dataset = dataset;
    LEM2.dataset = LEM2.convertToSetValuedDataset(LEM2.dataset);
    LEM2.newConcepts();
    LEM2.newAttributeValueBlocks();
  },

  initializeProcedure: function (concept) {
    LEM2.concept = concept;
    LEM2.singleLocalCovering = [];
    LEM2.goal = concept.cases;
  },

  invokeProcedure: function (concept) {
    LEM2.initializeProcedure(concept);
    LEM2.newRuleset();
    LEM2.compressRuleset();
  },

  newRuleset: function () {
    var casesCoveredByRuleset = new Set();
    while (LEM2.goal.size) {
      var rule = LEM2.newRule();
      LEM2.singleLocalCovering.push(rule);

      casesCoveredByRuleset = casesCoveredByRuleset.union(rule.coveredCases);
      casesCoveredByRuleset = casesCoveredByRuleset.sort();
      LEM2.goal = LEM2.concept.cases.difference(casesCoveredByRuleset);
    }
  },

  newRule: function () {

    var rule = { "conditions": [], "decision": { "name": LEM2.concept.decision, "value": LEM2.concept.value }, "coveredCases": new Set(), "consistent": true };

    do {
      var intersections = LEM2.newGoalBlockIntersections(rule);

      if (intersections.length === 0) {
        rule.consistent = false;
        console.error("Inconsistent Rule Created");
        console.log(rule);
        break;
      }

      var bestBlock = LEM2.selectBestBlock(intersections);
      var condition = { "attribute": bestBlock.attribute, "value": bestBlock.value };
      rule.conditions.push(condition);
      LEM2.goal = LEM2.goal.intersection(bestBlock.cases);

      var block = new Set(LEM2.blocks[condition.attribute][condition.value]);
      if (rule.coveredCases.size === 0) {
        rule.coveredCases = block;
      }
      else {
        rule.coveredCases = rule.coveredCases.intersection(block);
      }

      var isSubset = LEM2.concept.cases.isSuperset(rule.coveredCases);
    } while (rule.conditions.length === 0 || !isSubset)

    rule = LEM2.compressRule(rule);
    return rule;
  },

  getCasesCoveredByRuleset: function (ruleset) {

    var coveredCases = new Set();
    ruleset.forEach(function (rule) {
      coveredCases = coveredCases.union(rule.coveredCases);
    });
    return coveredCases.sort();
  },

  getCasesCoveredByRule: function (rule) {
    var attributes = LEM2.dataset[0];
    var coveredCases = new Set();

    rule.conditions.forEach(function (condition) {
      var block = new Set(LEM2.blocks[condition.attribute][condition.value]);
      if (coveredCases.size === 0) {
        coveredCases = block;
        return;
      }
      coveredCases = coveredCases.intersection(block);
    });

    return coveredCases.sort();
  },

  compressRule: function (rule) {
    var minimalRule = JSON.parse(JSON.stringify(rule));
    minimalRule.conditions.reverse();

    for (var conditionIndex = minimalRule.conditions.length - 1; conditionIndex >= 0; conditionIndex--) {
      if (minimalRule.conditions.length === 1) {
        break;
      }

      var ruleMinusCondition = JSON.parse(JSON.stringify(minimalRule));
      ruleMinusCondition.conditions.splice(conditionIndex, 1);
      var coveredCasesMinusCondition = LEM2.getCasesCoveredByRule(ruleMinusCondition);

      if (LEM2.concept.cases.isSuperset(coveredCasesMinusCondition)) {
        minimalRule.conditions.splice(conditionIndex, 1);
      }
    }

    minimalRule.conditions.reverse();
    minimalRule.coveredCases = LEM2.getCasesCoveredByRule(minimalRule);
    return minimalRule;
  },

  compressRuleset: function () {
    LEM2.singleLocalCovering.reverse();

    for (var ruleIndex = LEM2.singleLocalCovering.length - 1; ruleIndex >= 0; ruleIndex--) {
      if (LEM2.singleLocalCovering.length === 1) {
        break;
      }

      var rulesetMinusRule = LEM2.singleLocalCovering.slice(0);
      rulesetMinusRule.splice(ruleIndex, 1);

      var coveredCasesMinusRule = LEM2.getCasesCoveredByRuleset(rulesetMinusRule);
      var coveredDifference = LEM2.concept.cases.difference(coveredCasesMinusRule);

      // if rules covered by minus ruleset does not equal rules covered by original ruleset, add to minimalRuleset
      if (coveredDifference.size === 0) {
        LEM2.singleLocalCovering.splice(ruleIndex, 1);
      }
    }

    LEM2.singleLocalCovering.reverse();
  },

  findCondition: function (rule, targetCondition) {
    var targetIndex = -1;

    rule.conditions.forEach(function (condition, conditionIndex) {
      if (condition.attribute !== targetCondition.attribute) {
        return;
      }

      if (condition.value !== targetCondition.value) {
        return;
      }

      targetIndex = conditionIndex;
    });

    return targetIndex;
  },

  newGoalBlockIntersections: function (rule) {
    var intersections = [];

    for (var attribute in LEM2.blocks) {
      var attributeBlocks = LEM2.blocks[attribute];
      for (var attributeValue in attributeBlocks) {
        var conditionIndex = LEM2.findCondition(rule, { "attribute": attribute, "value": attributeValue });
        if (conditionIndex !== -1) {
          continue;
        }

        var blockCases = new Set(LEM2.blocks[attribute][attributeValue]);
        var intersection = {
          "attribute": attribute,
          "value": attributeValue,
          "cases": blockCases.intersection(LEM2.goal)
        }
        if (intersection.cases.size) {
          intersections.push(intersection);
        }
      }
    }

    return intersections;
  },

  // TODO: Rename to selectBestIntersection
  selectBestBlock: function (intersections) {
    var bestBlock = intersections[0];
    var bestCardinality = LEM2.blocks[intersections[0].attribute][intersections[0].value].length;

    intersections.forEach(function (intersection) {
      var cardinality = LEM2.blocks[intersection.attribute][intersection.value].length;

      if (intersection.cases.size < bestBlock.cases.size) {
        return;
      }

      if (intersection.cases.size > bestBlock.cases.size) {
        bestBlock = intersection;
        bestCardinality = cardinality;
        return;
      }

      if (cardinality > bestCardinality) {
        return;
      }

      if (cardinality < bestCardinality) {
        bestBlock = intersection;
        bestCardinality = cardinality;
        return;
      }
    });

    return bestBlock;
  },

  convertToSetValuedDataset: function (dataset) {
    var dataset = JSON.parse(JSON.stringify(dataset));

    dataset.forEach(function (row, rowIndex) {
      if (rowIndex === 0) {
        // skip header
        return;
      }

      row.forEach(function (cell, cellIndex) {
        if (cell.indexOf("|") === -1) {
          return;
        }

        var splitCell = cell.split("|");
        dataset[rowIndex][cellIndex] = new Set(splitCell);
      });
    });

    return dataset;
  }
};
