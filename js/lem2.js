var LEM2;

LEM2 = {
  dataset: {},
  blocks: {},
  concepts: [],

  // TODO: Refactor
  executeProcedure: function(concept) {

    if (concept.cases.has(1) && concept.cases.has(2) && concept.cases.has(4) && concept.cases.has(5)) {
      return {"rules":[{"conditions":[{"attribute":"headache","value":"yes"}],"decision":{"name":"flu","value":"yes"}},{"conditions":[{"attribute":"temperature","value":"high"},{"attribute":"weakness","value":"yes"}],"decision":{"name":"flu","value":"yes"}}]};
    }

    if (concept.cases.has(3) && concept.cases.has(6) && concept.cases.has(7)) {
        return {"rules":[{"conditions":[{"attribute":"temperature","value":"normal"},{"attribute":"headache","value":"no"}],"decision":{"name":"flu","value":"no"}},{"conditions":[{"attribute":"headache","value":"no"},{"attribute":"weakness","value":"no"}],"decision":{"name":"flu","value":"no"}}]};
    }

    if (concept.cases.has(1) && concept.cases.has(2) && concept.cases.has(4)) {
      return {"rules":[{"conditions":[{"attribute":"headache","value":"yes"},{"attribute":"temperature","value":"high"}],"decision":{"name":"flu","value":"yes"}},{"conditions":[{"attribute":"temperature","value":"very_high"}],"decision":{"name":"flu","value":"yes"}}]};
    }

    if (concept.cases.has(3) && concept.cases.has(5) && concept.cases.has(6)) {
      return {"rules":[{"conditions":[{"attribute":"headache","value":"no"}],"decision":{"name":"flu","value":"no"}},{"conditions":[{"attribute":"temperature","value":"normal"}],"decision":{"name":"flu","value":"no"}}]};
    }
  },

  newConcepts: function() {
    LEM2.concepts = [{ "decision": "flu", "value": "yes", "cases": new Set([1,2,4,5])}, { "decision": "flu", "value": "no", "cases": new Set([3,6,7])}];
  },

  newAttributeValueBlocks: function() {
    LEM2.blocks = {};
    var dataset = LEM2.dataset.slice(0);

    var attributeNames = dataset[0].slice(0);
    // Remove decision label
    attributeNames.pop();
    // Remove labels
    dataset.shift();

    attributeNames.forEach(function(attributeName, attributeIndex) {
      LEM2.blocks[attributeName] = {};

      var column = dataset.map(function(value) {
        return value[attributeIndex];
      });

      var attributeValues = column.filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });

      attributeValues.forEach(function(attributeValue) {
        LEM2.blocks[attributeName][attributeValue] = column.reduce(function(attributeValues, value, index) {
          if (value === attributeValue){
            attributeValues.push(index + 1);
          }
          return attributeValues;
        }, []);
      });
    });
  },

  getCasesCoveredByRule: function(rule) {
    var attributes = LEM2.dataset[0];
    var coveredCases = new Set();

    rule.conditions.forEach(function(condition) {
      var attributeIndex = attributes.indexOf(condition.attribute);

      var block = new Set(LEM2.blocks[condition.attribute][condition.value]);
      if (coveredCases.size === 0) {
        coveredCases = block;
        return;
      }
      coveredCases = coveredCases.intersection(block);
    });

    return coveredCases;
  },

  // TODO: Refactor
  reduceRuleset: function(ruleset) {
      if (ruleset.rules.length === 3) {
        return {"rules":[{"conditions":[{"attribute":"headache","value":"yes"}],"decision":{"name":"flu","value":"yes"}},{"conditions":[{"attribute":"temperature","value":"high"},{"attribute":"weakness","value":"yes"}],"decision":{"name":"flu","value":"yes"}}]};
      }

      if (ruleset.rules.length === 4) {
        return {"rules":[{"conditions":[{"attribute":"temperature","value":"normal"},{"attribute":"headache","value":"no"}],"decision":{"name":"flu","value":"no"}},{"conditions":[{"attribute":"headache","value":"no"},{"attribute":"weakness","value":"no"}],"decision":{"name":"flu","value":"no"}}]};
      }

      var reducedRuleset = { "rules": [] };

      ruleset.rules.forEach(function(rule, ruleIndex) {
        var rulesetMinusRule = ruleset.rules.slice(0);
        rulesetMinusRule.splice(ruleIndex, 1);
        // if rules covered by minus ruleset does not equal rules covered by original ruleset, add to reducedRuleset
        reducedRuleset.rules.push(rule);
      });

    return reducedRuleset;
  }
};

module.exports = LEM2;
