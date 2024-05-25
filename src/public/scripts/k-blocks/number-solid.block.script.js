Blockly.defineBlocksWithJsonArray([{
  "type": "number-solid",
  "message0": "1",
  "args0": [],
  "output": "Number",
  "colour": 100,
  "tooltip": "Input number",
}]);

javascript.javascriptGenerator.forBlock['number-solid'] = function(block, generator) {
  console.log({ block, generator });
  const n = block.getFieldValue('n');
  return n;
}
