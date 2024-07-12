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
            console.log('searchJson', searchJson);
            const newSearch = {
                ...(keep ? searchJson : {}),
                ...search,
            };

            window.location.href = axios
                .getUri({
                    url: '/search',
                    params: newSearch,
                });
        }

        static onSendSearch = function(model, page) {
            K.Search.send({
                search: {
                    [model]: {
                        page: page,
                    },
                },
            })
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
    }
}