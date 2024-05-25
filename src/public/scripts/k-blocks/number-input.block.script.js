Blockly.defineBlocksWithJsonArray([{
  "type": "number-input",
  "message0": '%1',
  "args0": [
    {
      "type": "field_number",
      "name": "n",
    },
  ],
  "output": "Number",
  "colour": 100,
  "tooltip": "Input number",
}]);

javascript.javascriptGenerator.forBlock['number-input'] = function(block, generator) {
  console.log({ block, generator });
  const n = block.getFieldValue('n');
  return n;
}
