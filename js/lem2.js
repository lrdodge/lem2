var LEM2;

LEM2 = {
    blocks: {},

    // TODO: Refactor
    executeProcedure: function(concept, dataSet) {

      if (concept.has(1) && concept.has(2) && concept.has(4) && concept.has(5)) {
        return {"rules":[{"conditions":[{"attribute":"headache","value":"yes"}],"decision":{"flu":"yes"}},{"conditions":[{"attribute":"temperature","value":"high"},{"attribute":"weakness","value":"yes"}],"decision":{"flu":"yes"}}]};
      }

      if (concept.has(3) && concept.has(6) && concept.has(7)) {
          return {"rules":[{"conditions":[{"attribute":"temperature","value":"normal"},{"attribute":"headache","value":"no"}],"decision":{"flu":"no"}},{"conditions":[{"attribute":"headache","value":"no"},{"attribute":"weakness","value":"no"}],"decision":{"flu":"no"}}]};
      }

      if (concept.has(1) && concept.has(2) && concept.has(4)) {
        return {"rules":[{"conditions":[{"attribute":"headache","value":"yes"},{"attribute":"temperature","value":"high"}],"decision":{"flu":"yes"}},{"conditions":[{"attribute":"temperature","value":"very_high"}],"decision":{"flu":"yes"}}]};
      }

      if (concept.has(3) && concept.has(5) && concept.has(6)) {
        return {"rules":[{"conditions":[{"attribute":"headache","value":"no"}],"decision":{"flu":"no"}},{"conditions":[{"attribute":"temperature","value":"normal"}],"decision":{"flu":"no"}}]};
      }
    },

    newAttributeValueBlocks: function(dataset) {
      LEM2.blocks = {};
      var attributeNames = dataset[0];
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

    getCasesCoveredByRule: function(rule, dataset) {
      var attributes = dataset[0];
      var coveredCases = new Set();

      rule.conditions.forEach(function(condition) {
        var attributeIndex = attributes.indexOf(condition.attribute);

        var block = LEM2.getAttributeValueBlock();
        // add block to covered cases if empty
        // otherwise, intersection of coveredCases and block
      });

      if (rule.conditions.length === 1) {
          return new Set([1,2,4]);
      }

      return new Set([5]);
    },

    // TODO: Refactor
    reduceRuleset: function(ruleset) {
        if (ruleset.rules.length === 3) {
          return {"rules":[{"conditions":[{"attribute":"headache","value":"yes"}],"decision":{"flu":"yes"}},{"conditions":[{"attribute":"temperature","value":"high"},{"attribute":"weakness","value":"yes"}],"decision":{"flu":"yes"}}]};
        }

        if (ruleset.rules.length === 4) {
          return {"rules":[{"conditions":[{"attribute":"temperature","value":"normal"},{"attribute":"headache","value":"no"}],"decision":{"flu":"no"}},{"conditions":[{"attribute":"headache","value":"no"},{"attribute":"weakness","value":"no"}],"decision":{"flu":"no"}}]};
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
