const idInput = document.querySelector('input[name="id"]');
const codeInput = document.querySelector('input[name="code"]');
const nameInput = document.querySelector('input[name="name"]');
const noteInput = document.querySelector('input[name="note"]');

let isContainBlocksGlobal = false;
let toolbox;
let blocksLocal;
let blocksGlobal;
let blocks;
let answers;
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

async function toggleBlocksGlobal() {
  isContainBlocksGlobal = !isContainBlocksGlobal;
  loadToolbox();
}

async function init() {
  await loadBlocks();

  workspaceDefault = initWorkspace({
    node: document.getElementById('blockly-workspace-default'),
  });
  workspaceToolbox = initWorkspace({
    node: document.getElementById('blockly-workspace-toolbox'),
  });

  loadToolbox({
    hasLoadBlocks: true,
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
      contents: [],
    },
  });
}

async function loadToolbox(props) {
  const {
    hasLoadBlocks
  } = {
    hasLoadBlocks: false,
    ...props,
  }

  if (hasLoadBlocks) {
    await loadBlocks();
  }

  toolbox = {
    kind: 'flyoutToolbox',
    contents: (isContainBlocksGlobal ? blocks : blocksLocal).map(block => {
      return {
        kind: 'block',
        type: block?.type,
      }
    }),
  };
  workspaceDefault?.updateToolbox(toolbox);
  workspaceToolbox?.updateToolbox(toolbox);
  for (const workspace of (answers || []).map(answer => answer.workspace)) {
    workspace?.updateToolbox(toolbox);
  }
}

async function loadBlocks() {
  const innerBlocksLocal = await (async () => {
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

  const innerBlocksGlobal = await (async () => {
    const blocksRes = await axios.get('/api/blocks', {
      params: {
        questionId: null,
      },
    });
    return blocksRes?.data?.result?.blocks || [];
  })();

  blocksLocal = innerBlocksLocal;
  blocksGlobal = innerBlocksGlobal;
  blocks = [...blocksLocal, ...blocksGlobal];

  for (const block of blocks) {
    Blockly.Blocks[block.type] = {
      init: function () {
        this.jsonInit(block);
      }
    };
  }
}

function onUpsertBlock(id) {
  window.location.href = `/blocks/${id}`;
}

async function onDelBlock(id) {
  await axios.delete(`http://localhost:5500/blocks/${id}`);
  await loadToolbox({ hasLoadBlocks: true });
}

async function onImportBlock(event) {
  event.preventDefault();
  const id = document.querySelector('input[name="id"]')?.value;

  const formData = new FormData(event.target);
  formData.set('questionId', id);
  try {
    const res = await axios.post('/api/blocks/import', formData);

    if (!res?.data?.success) {
      alert('fail');
      return;
    }

    await loadToolbox({ hasLoadBlocks: true });
    bootstrap?.Modal?.getInstance(document.querySelector('div#import-block-modal'))?.hide();
    bootstrap?.Modal?.getInstance(document.querySelector('div#config-block-modal'))?.show();
  } catch {
    alert('error');
  }
}

async function onExportBlock() {
  const id = document.querySelector('input[name="id"]')?.value;
  const fileRes = await axios.get(`/api/blocks/export`, {
    params: {
      questionId: id,
    }
  });
  K.exportJson({
    res: fileRes,
  })
}

function onConfigAnswers() {
  const id = document.querySelector('input[name="id"]')?.value;
  window.location.href = `/questions/${id}/answers`;
}

function onAssign() {
  const id = document.querySelector('input[name="id"]')?.value;
  window.location.href = `/questions/${id}/assign`;
}