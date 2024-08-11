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
        for(const property in obj) {
            if(obj.hasOwnProperty(property)) {
                const formKey = namespace ? `${namespace}[${property}]` : property;

                if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
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

        const blocks = blocksRes?.data?.result?.blocks || [];

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

        static onSendSearch = function(model, page) {
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
        static parseKey = function(key) {
            return key
                .replace(new RegExp(/\]/g), '')
                .split(new RegExp(/\[/g));
        }

        static setValue = function(obj, keys, value) {
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

        static parseObj = function(flat) {
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
}