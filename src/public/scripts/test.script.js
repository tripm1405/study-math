const workspace = Blockly.inject(
  document.getElementById('block'),
  {
    toolbox: {
      kind: 'flyoutToolbox',
      contents: [
        {
          kind: 'block',
          type: 'number-input'
        },
        {
          kind: 'block',
          type: 'number-select'
        },
        {
          kind: 'block',
          type: 'number-solid'
        },
      ],
    },
  });

function submit() {
  const state = Blockly?.serialization?.workspaces?.save?.(workspace);
  console.log(state)
}

console.log(Blockly)