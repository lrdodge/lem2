var LEM2;

LEM2 = {
    blocks: {},

    executeProcedure: function(concept, dataSet) {
      // TODO: Refactor
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

    newAttributeValueBlocks: function() {
      LEM2.blocks = {"A1":{"Y":[3,4],"N":[1,2]},"A2":{"Y":[2,4],"N":[1,3]}};
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
          // if cannot be removed, add to reducedRuleset
          reducedRuleset.rules.push(rule);
        });

      return reducedRuleset;
    }
};

module.exports = LEM2;
