// Data Example 1

const dataset1 = [["temperature", "headache", "weakness", "nausea", "flu"], ["very_high", "yes", "yes", "no", "yes"], ["high", "yes", "no", "yes", "yes"], ["normal", "no", "no", "no", "no"], ["normal", "yes", "yes", "yes", "yes"], ["high", "no", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["normal", "no", "yes", "no", "no"]];

const rulesetFluYes1 = [
  {
    "conditions": [
      { "attribute": "headache", "value": "yes" },
    ],
    "decision": { "name": "flu", "value": "yes" },
    "consistent": true
  },
  {
    "conditions": [
      { "attribute": "temperature", "value": "high" },
      { "attribute": "weakness", "value": "yes" },
    ],
    "decision": { "name": "flu", "value": "yes" },
    "consistent": true
  }
];
const rulesetFluNo1 = [
  {
    "conditions": [
      { "attribute": "nausea", "value": "no" },
      { "attribute": "temperature", "value": "normal" },
    ],
    "decision": { "name": "flu", "value": "no" },
    "consistent": true
  },
  {
    "conditions": [
      { "attribute": "weakness", "value": "no" },
      { "attribute": "headache", "value": "no" },
    ],
    "decision": { "name": "flu", "value": "no" },
    "consistent": true
  }
];

const blocks1 = {
  "temperature": { "very_high": [1], "high": [2, 5, 6], "normal": [3, 4, 7] },
  "headache": { "yes": [1, 2, 4], "no": [3, 5, 6, 7] },
  "weakness": { "yes": [1, 4, 5, 7], "no": [2, 3, 6] },
  "nausea": { "yes": [2, 4], "no": [1, 3, 5, 6, 7] }
};
const conceptFluYes1 = { "decision": "flu", "value": "yes", "cases": new Set([1, 2, 4, 5]) };
const conceptFluNo1 = { "decision": "flu", "value": "no", "cases": new Set([3, 6, 7]) };

// Data Example 2

const dataset2 = [["temperature", "headache", "nausea", "cough", "flu"], ["high", "yes", "no", "yes", "yes"], ["very_high", "yes", "yes", "no", "yes"], ["high", "no", "no", "no", "no"], ["high", "yes", "yes", "yes", "yes"], ["normal", "yes", "no", "no", "no"], ["normal", "no", "yes", "yes", "no"]];

const rulesetFluYes2 = [
  {
    "conditions": [
      { "attribute": "headache", "value": "yes" },
      { "attribute": "temperature", "value": "high" },
    ],
    "decision": { "name": "flu", "value": "yes" },
    "consistent": true
  },
  {
    "conditions": [
      { "attribute": "temperature", "value": "very_high" },
    ],
    "decision": { "name": "flu", "value": "yes" },
    "consistent": true
  }
];
const rulesetFluNo2 = [
  {
    "conditions": [
      { "attribute": "temperature", "value": "normal" },
    ],
    "decision": { "name": "flu", "value": "no" },
    "consistent": true
  },
  {
    "conditions": [
      { "attribute": "headache", "value": "no" },
    ],
    "decision": { "name": "flu", "value": "no" },
    "consistent": true
  }
];

const blocks2 = {
  "temperature": { "very_high": [2], "high": [1, 3, 4], "normal": [5, 6] },
  "headache": { "yes": [1, 2, 4, 5], "no": [3, 6] },
  "nausea": { "yes": [2, 4, 6], "no": [1, 3, 5] },
  "cough": { "yes": [1, 4, 6], "no": [2, 3, 5] }
};
const conceptFluYes2 = { "decision": "flu", "value": "yes", "cases": new Set([1, 2, 4]) };
const conceptFluNo2 = { "decision": "flu", "value": "no", "cases": new Set([3, 5, 6]) };

// Inconsistent Data Set

const datasetInconsistent = [
  ["temperature", "headache", "weakness", "nausea", "flu"],
  ["very_high", "yes", "yes", "no", "yes"],
  ["high", "yes", "no", "yes", "yes"],
  ["normal", "no", "no", "no", "no"],
  ["normal", "yes", "yes", "yes", "yes"],
  ["high", "no", "yes", "no", "yes"],
  ["high", "no", "no", "no", "no"],
  ["normal", "no", "yes", "no", "no"],
  ["normal", "no", "yes", "no", "yes"],
];

const conceptFluYesInconsistent = {
  "decision": "flu",
  "value": "yes",
  "cases": new Set([1, 2, 4, 5, 8])
};
const conceptFluNoInconsistent = {
  "decision": "flu",
  "value": "no",
  "cases": new Set([3, 6, 7])
};

const rulesetFluYesInconsistent = [
  {
    "conditions": [
      { "attribute": "weakness", "value": "yes" },
      { "attribute": "temperature", "value": "high" },
    ],
    "decision": { "name": "flu", "value": "yes" },
    "consistent": true
  },
  {
    "conditions": [
      { "attribute": "headache", "value": "yes" },
    ],
    "decision": { "name": "flu", "value": "yes" },
    "consistent": true
  },
  {
    "conditions": [
      { "attribute": "temperature", "value": "normal" },
      { "attribute": "headache", "value": "no" },
      { "attribute": "weakness", "value": "yes" },
      { "attribute": "nausea", "value": "no" },
    ],
    "decision": { "name": "flu", "value": "yes" },
    "consistent": false
  },
];
const rulesetFluNoInconsistent = [
  {
    "conditions": [
      { "attribute": "nausea", "value": "no" },
      { "attribute": "weakness", "value": "no" },
    ],
    "decision": { "name": "flu", "value": "no" },
    "consistent": true
  },
  {
    "conditions": [
      { "attribute": "temperature", "value": "normal" },
      { "attribute": "headache", "value": "no" },
      { "attribute": "weakness", "value": "yes" },
      { "attribute": "nausea", "value": "no" },
    ],
    "decision": { "name": "flu", "value": "no" },
    "consistent": false
  },
];

// Set-Valued Attributes

const datasetSetValuesRaw = [
  ["temperature", "headache", "cough", "flu"],
  ["high|very high", "yes", "no", "yes"],
  ["high", "no", "yes", "yes"],
  ["very high", "no", "no", "no"],
  ["normal|high", "yes", "yes", "maybe"],
];

const datasetSetValues = [
  ["temperature", "headache", "cough", "flu"],
  [new Set(["high", "very high"]), "yes", "no", "yes"],
  ["high", "no", "yes", "yes"],
  ["very high", "no", "no", "no"],
  [new Set(["normal", "high"]), "yes", "yes", "maybe"],
];

const blocksSetValues = {
  "temperature": { "very_high": [1,3], "high": [1,2,4], "normal": [4] },
  "headache": { "yes": [1, 4], "no": [2,3] },
  "cough": { "yes": [2, 4], "no": [1, 3] }
};

const conceptFluYesSetValues = { "decision": "flu", "value": "yes", "cases": new Set([1, 2]) };
const conceptFluNoSetValues = { "decision": "flu", "value": "no", "cases": new Set([3]) };
const conceptFluMaybeSetValues = { "decision": "flu", "value": "maybe", "cases": new Set([4]) };