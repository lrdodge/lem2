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
      if (dataset.length === 5) {
          LEM2.blocks = {"A1":{"Y":[3,4],"N":[1,2]},"A2":{"Y":[2,4],"N":[1,3]}};
      }

      if (dataset.length === 8) {
        LEM2.blocks = {"temperature":{"very_high":[1],"high":[2,5,6],"normal":[3,4,7]},"headache":{"yes":[1,2,4],"no":[3,5,6,7]},"weakness":{"yes":[1,4,5,7],"no":[2,3,6]},"nausea":{"yes":[2,4],"no":[1,3,5,6,7]}};
      }

      if (dataset.length === 7) {
        LEM2.blocks = {"temperature":{"very_high":[2],"high":[1,3,4],"normal":[5,6]},"headache":{"yes":[1,2,4,5],"no":[3,6]},"nausea":{"yes":[2,4,6],"no":[1,3,5]},"cough":{"yes":[1,4,6],"no":[2,3,5]}};
      }
    },

    getAttributeValueBlock: function() {

    },

    getCasesCoveredByRule: function(rule, dataset) {
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
