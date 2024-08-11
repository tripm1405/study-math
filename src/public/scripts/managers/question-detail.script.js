const idInput = document.querySelector('input[name="id"]');

let isContainBlocksGlobal = false;
let toolbox;
let blocksLocal;
let blocksGlobal;
let blocks;
let answers;
let workspaceDefault;
let workspaceToolbox;

// init
(async () => {
    const id = document.querySelector('input[name="id"]')?.value;
    await loadBlocks();

    workspaceDefault = K.initWorkspace({
        node: document.getElementById('blockly-workspace-default'),
    });
    workspaceToolbox = K.initWorkspace({
        node: document.getElementById('blockly-workspace-toolbox'),
    });

    loadToolbox({
        hasLoadBlocks: true,
    });

    const question = await (async () => {
        const questionRes = await axios.get(`/api/questions/${id}`);
        return questionRes?.data?.result?.question;
    })();
    Blockly.serialization.workspaces.load(question?.blocksDefault, workspaceDefault);
    Blockly.serialization.workspaces.load(question?.toolbox, workspaceToolbox);
})();

async function onSubmit() {
    // todo: notify
    try {
        const id = document.querySelector('input[name="id"]')?.value;
        const name = document.querySelector('input[name="name"]')?.value;
        const lessonId = document.querySelector('select[name="lessonId"]')?.value;
        const startDate = document.querySelector('input[name="startDate"]')?.value;
        const endDate = document.querySelector('input[name="endDate"]')?.value;
        const note = document.querySelector('input[name="note"]')?.value;
        const blocksDefault = Blockly.serialization.workspaces.save?.(workspaceDefault);
        const toolbox = Blockly.serialization.workspaces.save?.(workspaceToolbox);

        const formData = new FormData();
        formData.set('name', name);
        formData.set('startDate', startDate);
        formData.set('endDate', endDate);
        formData.set('lessonId', lessonId);
        formData.set('note', note);
        formData.set('blocksDefault', JSON.stringify(blocksDefault || {}));
        formData.set('toolbox', JSON.stringify(toolbox || {}));

        const res = await (id
            ? axios.put(`/api/questions/${id}`, formData)
            : axios.post('/api/questions', formData));

        console.log('res', res);

        if (!res?.data?.success) {
            return;
        }

        window.location.href = '/questions';
    } catch {
        alert('error');
    }
}

async function toggleBlocksGlobal() {
    isContainBlocksGlobal = !isContainBlocksGlobal;
    loadToolbox();
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

    // Blockly.serialization.workspaces.load(question?.blocksDefault, solveWorkspace);
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

    blocksLocal = innerBlocksLocal?.map(block => K.Blockly.decode({block: block}));
    blocksGlobal = innerBlocksGlobal?.map(block => K.Blockly.decode({block: block}));
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
    await axios.delete(`/api/blocks/${id}`);
    await loadToolbox({hasLoadBlocks: true});
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

        await loadToolbox({hasLoadBlocks: true});
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

function onMark() {
    const id = document.querySelector('input[name="id"]')?.value;
    window.location.href = `/resolutions?questionId=${id}`;
}