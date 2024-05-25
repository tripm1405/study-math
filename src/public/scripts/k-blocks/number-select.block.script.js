Blockly.defineBlocksWithJsonArray([{
  "type": "number-select",
  "message0": '%1',
  "args0": [
    {
      "type": "field_dropdown",
      "name": "n",
      "options": [
        ['1', '1'],
        ['2', '2'],
        ['3', '3'],
      ],
    },
  ],
  "output": "Number",
  "colour": 100,
  "tooltip": "Select number",
}]);

javascript.javascriptGenerator.forBlock['number-select'] = function(block, generator) {
  console.log({ block, generator });
  const n = block.getFieldValue('n');
  // moveForward is a function you would have to define yourself and provide
  // within your execution context.
  return n;
}
