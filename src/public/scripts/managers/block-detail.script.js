const id = document.querySelector('input[name="id"]').value;

const workspace = initWorkspace({
  node: document.getElementById('block'),
});

async function onImport(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  try {
    const res = await axios.post(`/api/blocks/${id}/import`, formData);

    if (!res?.data?.success) {
      alert('fail');
      return;
    }

    window.location.reload();
  } catch {
    alert('error');
  }
}

async function onExport() {
  const fileRes = await axios.get(`/api/blocks/${id}/export`);
  await K.exportJson({
    res: fileRes,
  });
}

async function initWorkspace(props) {
  const {
    node
  } = {
    ...props,
  };

  const blockRes = await axios.get(`/api/blocks/${id}`);
  const block = blockRes?.data?.result?.block;

  Blockly.Blocks[block.type] = {
    init: function () {
      this.jsonInit(block);
    }
  };

  const workspace = Blockly.inject(node);

  Blockly.serialization.workspaces.load({
    "blocks": {
      "languageVersion": 0,
      "blocks": [
        {
          "type": block?.type,
          "x": 20,
          "y": 20
        }
      ]
    }
  }, workspace);

  return workspace;
}