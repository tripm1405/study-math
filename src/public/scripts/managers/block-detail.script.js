const BlockType = 'review';
const workspace = Blockly.inject(document.getElementById('block'));

(async () => {
    const id = document.querySelector('input[name="id"]').value;
    const blockRes = await axios.get(`/api/blocks/${id || 'default'}`);
    const block = blockRes?.data?.result?.block;

    const messagesNode = document.querySelector('.k-block-content')
        .querySelector('.k-block-content-messages');

    const argss = Object.keys(block).filter(key => key.includes('args')).map(key => block[key]);
    for (const args of argss) {
        const messageNode = genMessageNode({
            args: args,
        });
        messagesNode.insertAdjacentElement('beforeend', messageNode);
    }

    loadBlockWorkspace({
        block: block,
    });
})();

function onReview() {
    loadBlockWorkspace({
        block: getBlock(),
    })
}

async function onSubmit() {
    const id = document.querySelector('input[name="id"]').value;
    const block = getBlock();

    try {
        const res = await (id
            ? axios.put(`/api/blocks/${id}`, {
                block: block,
            })
            : axios.post('/api/blocks', {
                block: block,
            }));
        if (!res?.data?.success) {
            showToastify({
                text: 'Không thành công!',
                backgroundColor: '#ff6347',
            })
            return;
        }

        showToastify({
            text: 'Thành công!',
            backgroundColor: '#4CAF50',
        })
        window.location.href = `/blocks`;
    } catch (error) {
        showToastify({
            text: 'Lỗi hệ thống!',
            backgroundColor: '#ff6347',
        })
    }
}

async function onImport(event) {
    event.preventDefault();

    const id = document.querySelector('input[name="id"]')?.value;

    const formData = new FormData(event.target);

    try {
        const res = await axios.post(`/api/blocks/${id}/import`, formData);
        if (!res?.data?.success) {
            showToastify({
                text: 'Import không thành công. Vui lòng thử lại.',
                backgroundColor: '#ff6347',
            })
            return;
        }

        showToastify({
            text: 'Import khối thành công!',
            backgroundColor: '#4CAF50',
        });
        window.location.reload();
    } catch (error) {
        showToastify({
            text: 'Đã xảy ra lỗi khi import khối. Vui lòng thử lại sau.',
            backgroundColor: '#ff6347',
        })
    }

    const importModal = document.getElementById('import-modal');
    const modal = bootstrap.Modal.getInstance(importModal);
    modal.hide();
}

async function onExport() {
    const id = document.querySelector('input[name="id"]').value;
    const fileRes = await axios.get(`/api/blocks/${id}/export`);
    await K.exportJson({
        res: fileRes,
    });
}

function onAddMessage(event) {
    const messageNode = genMessageNode();
    event.target.closest('.k-block-content')
        .querySelector('.k-block-content-messages')
        .insertAdjacentElement('beforeend', messageNode);
}

function onAddArg(event) {
    const ArgNode = genArgNode();
    event.target.closest('.k-block-content-message')
        .querySelector('.k-block-content-args')
        .insertAdjacentElement('beforeend', ArgNode);
}

function onAddOption(event) {
    const optionNode = genBlockDropdownOptionNode();
    event.target.closest('.k-block-dropdown-options-wrap')
        .querySelector('.k-block-dropdown-options')
        .insertAdjacentElement('beforeend', optionNode);
}

function showToastify(props) {
    Toastify({
        duration: 3000,
        gravity: 'top',
        position: 'right',
        ...props,
    }).showToast()
}

function loadBlockWorkspace(props) {
    const {
        block: outerBlock,
    } = {
        block: {},
        ...props,
    };

    const block = {
        ...structuredClone(outerBlock),
        type: BlockType,
    };

    Blockly.Blocks[block.type] = {
        init: function () {
            this.jsonInit(block);
        }
    };
    Blockly.serialization.workspaces.load({
        "blocks": {
            "languageVersion": 0,
            "blocks": [
                {
                    "type": 'review',
                    "x": 20,
                    "y": 20
                }
            ]
        }
    }, workspace);
}

function genMessageNode(props) {
    const {
        args
    } = {
        args: [],
        ...props,
    };

    const cloneNode = document.querySelector('.k-clone.k-clone-block-detail');
    const node = cloneNode.querySelector('.k-block-content-message')?.cloneNode(true);

    for (const arg of args) {
        const ArgNode = genArgNode({
            properties: arg,
        });
        node.querySelector('.k-block-content-args')
            .insertAdjacentElement('beforeend', ArgNode);
    }

    return node;
}

function genArgNode(props) {
    const {
        properties: {
            type,
            ...values
        },
    } = {
        ...props,
        properties: {
            ...props?.properties,
        }
    };

    const cloneNode = document.querySelector('.k-clone.k-clone-block-detail');
    const node = cloneNode.querySelector('.k-block-content-arg')?.cloneNode(true);

    node.querySelector('[name="type"]').value = type;

    const initPropertiesNode = genPropertiesNode({
        type: type,
        values: values,
    });
    const propertiesNode = node.querySelector('.k-block-content-arg-properties');
    propertiesNode.innerHTML = '';
    propertiesNode.insertAdjacentElement('beforeend', initPropertiesNode);

    node.querySelector('[name="type"]').addEventListener('change', (event) => {
        const propertiesNode = event.target.closest('.k-block-content-arg')
            .querySelector('.k-block-content-arg-properties');
        propertiesNode.innerHTML = '';

        const propertiesNodeClone = genPropertiesNode({
            type: event.target.value,
        })

        propertiesNode.insertAdjacentElement('beforeend', propertiesNodeClone);
    })

    return node;
}

function genPropertiesNode(props) {
    const {
        type,
        values,
    } = {
        values: {},
        ...props,
    };

    const cloneNode = document.querySelector('.k-clone.k-clone-block-detail');

    switch (type) {
        case "field_image": {
            const node = cloneNode.querySelector('.k-block-content-arg-properties-type-image').cloneNode(true);
            return node;
        }
        case "field_checkbox": {
            const node = cloneNode.querySelector('.k-block-content-arg-properties-type-checkbox').cloneNode(true);

            for (const key of Object.keys(values)) {
                if (values[key]) {
                    node.querySelector(`[name="${key}"]`).value = values[key];
                }
            }

            return node;
        }
        case "field_number": {
            const node = cloneNode.querySelector('.k-block-content-arg-properties-type-number').cloneNode(true);

            for (const key of Object.keys(values)) {
                if (values[key]) {
                    node.querySelector(`[name="${key}"]`).value = values[key];
                }
            }

            return node;
        }
        case "field_input": {
            const node = cloneNode.querySelector('.k-block-content-arg-properties-type-input').cloneNode(true);

            for (const key of Object.keys(values)) {
                if (values[key]) {
                    node.querySelector(`[name="${key}"]`).value = values[key];
                }
            }

            return node;
        }
        case "field_dropdown": {
            const node = cloneNode.querySelector('.k-block-content-arg-properties-type-dropdown').cloneNode(true);

            values.options?.forEach(option => {
                const optionNode = genBlockDropdownOptionNode({
                    values: {
                        label: option[1],
                        value: option[0],
                    },
                });
                node.querySelector('.k-block-dropdown-options')
                    .insertAdjacentElement('beforeend', optionNode);
            });


            return node;
        }
        default:
        case "field_label": {
            const node = cloneNode.querySelector('.k-block-content-arg-properties-type-label')?.cloneNode(true);

            for (const key of Object.keys(values)) {
                if (values[key]) {
                    node.querySelector(`[name="${key}"]`).value = values[key];
                }
            }

            return node;
        }
    }
}

function genBlockDropdownOptionNode(props) {
    const {
        values,
    } = {
        ...props,
    }
    const cloneNode = document.querySelector('.k-clone.k-clone-block-detail');
    const node = cloneNode.querySelector('.k-block-dropdown-option').cloneNode(true);

    node.querySelector('[name="label"]').value = values?.label || [];
    node.querySelector('[name="value"]').value = values?.value || [];

    return node;
}

function getBlockPropertyValue(key, value) {
    switch (key) {
        case 'output':
        case 'input':
        case 'previousStatement':
        case 'nextStatement':
            return convertBlockConnection(value);
        default:
            return value;
    }
}

function convertBlockConnection(connection) {
    switch (connection) {
        case 'Empty':
            return undefined;
        case 'Anything':
            return null;
        default:
            return connection;
    }
}

function getBlock() {
    const blockBackgroundNode = document.querySelector('.k-block-background');
    const layout = [...blockBackgroundNode.querySelectorAll('[name]')]
        .reduce((result, current) => {
            return {
                ...result,
                [current.name]: getBlockPropertyValue(current.name, current.value),
            }
        }, {});

    const contentNode = document.querySelector('.k-block-content');
    const messagesNode = [...contentNode.querySelectorAll('.k-block-content-message')];
    const substance = messagesNode
        .map(messageNode => {
            const argsNode = [...messageNode
                .querySelector('.k-block-content-args')
                .querySelectorAll('.k-block-content-arg')];

            const args = argsNode
                .map(argNode => {
                    const type = argNode.querySelector('[name="type"]')?.value;

                    switch (type) {
                        case 'field_dropdown': {
                            const options = [...argNode.querySelectorAll('.k-block-dropdown-option')]
                                .map(optionNode => {
                                    const label = optionNode.querySelector('[name="label"]')?.value;
                                    const value = optionNode.querySelector('[name="value"]')?.value;
                                    return [label, value];
                                });

                            const hasNameNodes = [...argNode.querySelectorAll('[name]:not(.k-block-dropdown-options [name])')];
                            return hasNameNodes.reduce((result, current) => {
                                return {
                                    ...result,
                                    [current.name]: current.value,
                                }
                            }, {
                                options: options,
                            });
                        }
                        default: {
                            const hasNameNodes = [...argNode.querySelectorAll('[name]')];
                            return hasNameNodes.reduce((result, current) => {
                                return {
                                    ...result,
                                    [current.name]: current.value,
                                }
                            }, {});
                        }
                    }
                });

            return {
                message: argsNode.map((_, i) => `%${i + 1}`).join(' '),
                args: args,
            }
        })
        .reduce((result, current, index) => {
            return {
                ...result,
                [`message${index}`]: current.message,
                [`args${index}`]: current.args,
            }
        }, {});

    return {
        ...layout,
        ...substance,
    };
}