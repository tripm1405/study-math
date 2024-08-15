class K {
    static obj2FormData(formData, valueCurrent, keyCurrent = null) {
        const ObjType = typeof ({});

        if (typeof (valueCurrent) === ObjType) {
            for (const key in valueCurrent) {
                K.obj2FormData(formData, valueCurrent[key], keyCurrent ? `${keyCurrent}[${key}]` : key);
            }
            return;
        }

        formData.set(keyCurrent, valueCurrent);
    }

    static objToFormData = (obj, formData = new FormData(), namespace) => {
        for (const property in obj) {
            if (obj.hasOwnProperty(property)) {
                const formKey = namespace ? `${namespace}[${property}]` : property;

                if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
                    K.objToFormData(obj[property], formData, formKey);
                } else {
                    formData.append(formKey, obj[property]);
                }
            }
        }

        return formData;
    }

    static async exportJson(props) {
        const {
            res,
        } = props;

        const type = res.headers['content-type'];
        const blob = new Blob(
            [
                JSON.stringify(res?.data?.result, null, '\t'),
            ],
            {
                type: type,
                encoding: 'UTF-8',
            }
        );
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'block.json';
        link.click();
    }

    static initWorkspace(props) {
        const {
            node,
            options,
        } = {
            ...props,
            options: {
                ...(props?.options || {}),
                toolbox: {
                    kind: 'flyoutToolbox',
                    contents: [],
                    ...(props?.toolbox || {}),
                },
            },
        }

        return Blockly.inject(node, options);
    }

    static async loadBlocks(props) {
        const {
            params,
        } = props;

        const blocksRes = await axios.get('/api/blocks', {
            params: params,
        });

        const blocks = blocksRes?.data?.result?.blocks?.map(block => K.Blockly.decode({block: block,})) || [];

        for (const block of blocks) {
            Blockly.Blocks[block.type] = {
                init: function () {
                    this.jsonInit(block);
                }
            };
        }

        return blocks;
    }

    static Search = class {
        static parse(props) {
            const {
                search,
            } = {
                search: window.location.search,
                ...props,
            };

            return K.Common.parseObj(Object.fromEntries(new URLSearchParams(structuredClone(search))));
        }

        static send(props) {
            const {
                search,
                keep,
            } = {
                search: {},
                keep: true,
                ...props,
            };

            const searchJson = K.Search.parse();
            const newSearch = {
                ...(keep ? searchJson : {}),
                ...search,
            };

            window.location.href = axios
                .getUri({
                    url: window.location.pathname,
                    params: newSearch,
                });
        }

        static onSendSearch = function (model, page) {
            if (!model) {
                K.Search.send({
                    search: {
                        page: page,
                    },
                });

                return;
            }

            K.Search.send({
                search: {
                    [model]: {
                        page: page,
                    },
                },
            });
        }
    }

    static Common = class {
        static parseKey = function (key) {
            return key
                .replace(new RegExp(/\]/g), '')
                .split(new RegExp(/\[/g));
        }

        static setValue = function (obj, keys, value) {
            if (keys.length === 1) {
                obj[keys[0]] = value;
                return;
            }

            const newKeys = structuredClone(keys);
            newKeys.shift();
            if (obj[keys[0]] === undefined) {
                obj[keys[0]] = {};
            }
            K.Common.setValue(obj[keys[0]], newKeys, value);
        }

        static parseObj = function (flat) {
            const result = {};
            for (const key of Object.keys(flat)) {
                K.Common.setValue(result, K.Common.parseKey(key), flat[key]);
            }

            return result;
        }

        static datetimeFormat = function (datetime) {
            const d = new Date(datetime);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const dayOfMonth = String(d.getDate()).padStart(2, '0');
            const hour = String(d.getHours()).padStart(2, '0');
            const minute = String(d.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${dayOfMonth} ${hour}:${minute}`;
        }
    }

    static Blockly = class {
        static ArgType = {
            FIELD_IMAGE: 'field_image',
            FIELD_CHECKBOX: 'field_checkbox',
            FIELD_NUMBER: 'field_number',
            FIELD_INPUT: 'field_input',
            FIELD_DROPDOWN: 'field_dropdown',
            FIELD_LABEL: 'field_label',
            INPUT_VALUE: 'input_value',
            INPUT_STATEMENT: 'input_statement',
        };

        static decode = (props) => {
            const {block: outerBlock} = props;

            const block = structuredClone(outerBlock);

            return Object.keys(block).reduce((result, key) => {
                return {
                    ...result,
                    [key]: K.Blockly.getBlockPropertyValue({
                        key: key,
                        value: block[key],
                    }),
                }
            }, {})
        }

        static getBlockPropertyValue = (props) => {
            const {key, value,} = props;
            switch (key) {
                case 'output':
                case 'input':
                case 'previousStatement':
                case 'nextStatement':
                    return K.Blockly.convertBlockConnection({
                        connection: value,
                    });
                default:
                    return value;
            }
        }

        static convertBlockConnection = (props) => {
            const {connection} = props;
            switch (connection) {
                case 'Empty':
                    return undefined;
                case 'Anything':
                    return null;
                default:
                    return connection;
            }
        }
    }

    static Toast = class {
        static Color = {
            SUCCESS: '#4CAF50',
            ERROR: '#ff6347',
            WARNING: '',
        }

        static showBadRequest(props) {
            const {errors} = props;

            const text = Object.values(errors)
                .map(error => {
                    return error?.message;
                })
                .join('\n');

            K.Toast.show({
                text: text,
                backgroundColor: K.Toast.Color.ERROR,
            });
        }

        static showServerError() {
            K.Toast.show({
                text: 'Lỗi hệ thống!',
                backgroundColor: K.Toast.Color.ERROR,
            })
        }

        static showError = (props) => {
            const {res} = props;

            if (res?.data?.success ?? true) {
                return;
            }

            switch (res?.data?.code) {
                case 400: {
                    K.Toast.showBadRequest({ errors: res?.data?.errors});
                    break;
                }
                default:
                case 500: {
                    K.Toast.showServerError();
                    break;
                }
            }
        }

        static show = (props) => {
            const {text, backgroundColor} = {
                backgroundColor: K.Toast.Color.SUCCESS,
                ...props,
            };

            Toastify({
                duration: 3000,
                gravity: 'top',
                position: 'right',
                text: text,
                backgroundColor: backgroundColor,
            }).showToast()
        }
    }
}