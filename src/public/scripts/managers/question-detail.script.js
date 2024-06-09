const idInput = document.querySelector('input[name="id"]');
const codeInput = document.querySelector('input[name="code"]');
const nameInput = document.querySelector('input[name="name"]');
const noteInput = document.querySelector('input[name="note"]');

let blocksLocal;
let blocksGlobal;
let blocks;
let workspaceDefault;
let workspaceToolbox;

init();

function submit() {
  try {
    const blocksDefault = Blockly.serialization.workspaces.save?.(workspaceDefault);
    const toolbox = Blockly.serialization.workspaces.save?.(workspaceToolbox);

    const formData = new FormData();
    formData.set('code', codeInput.value);
    formData.set('name', nameInput.value);
    formData.set('note', noteInput.value);
    formData.set('blocksDefault', JSON.stringify(blocksDefault || {}));
    formData.set('toolbox', JSON.stringify(toolbox || {}));

    if (idInput.value) {
      axios.put(`/questions/${idInput?.value}`, formData);
    }
    else {
      axios.post('/questions', formData);
    }

    window.location.href = '/questions';
  }
  catch {
    alert('error');
  }
}


async function init() {
  const innerBlocks = await initBlocks();
  blocksLocal = innerBlocks.blocksLocal;
  blocksGlobal = innerBlocks.blocksGlobal;
  blocks = innerBlocks.blocks;

  for (const block of blocks) {
    Blockly.Blocks[block.type] = {
      init: function () {
        this.jsonInit(block);
      }
    };
  }

  workspaceDefault = initWorkspace({
    node: document.getElementById('blockly-workspace-default'),
  });
  workspaceToolbox = initWorkspace({
    node: document.getElementById('blockly-workspace-toolbox'),
  });
}

function initWorkspace(props) {
  const {
    node
  } = {
    ...props,
  }

  return Blockly.inject(node, {
    toolbox: {
      kind: 'flyoutToolbox',
      contents: blocks.map(block => {
        return {
          kind: 'block',
          type: block?.type,
        }
      }),
    },

  });
}

async function initBlocks() {
  const blocksLocal = await (async () => {
    if (!idInput.value) {
      return [];
    }

    const blocksRes = await axios.get('/api/blocks', {
      params: {
        questionId: idInput?.value,
      },
    });
    return blocksRes?.data?.result?.blocks || [];
  })();

  const blocksGlobal = await (async () => {
    const blocksRes = await axios.get('/api/blocks', {
      params: {
        questionId: null,
      },
    });
    return blocksRes?.data?.result?.blocks || [];
  })();

  return {
    blocksLocal: blocksLocal,
    blocksGlobal: blocksGlobal,
    blocks: [...blocksLocal, ...blocksGlobal],
  };
}