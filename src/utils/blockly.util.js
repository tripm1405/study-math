import CommonUtil from "#root/utils/common.util.js";
import FileUtil from "#root/utils/file.util.js";


export default class BlocklyUtil {
    static Default = class {
        static Substance = {
            message0: '%1',
            args0: [
                {
                    type: 'field_label',
                    text: 'Text',
                },
            ],
        }
    }

    static ArgType = class {
        static FieldImage = 'field_image';
    }

    static Format = class {
        static export = (props) => {
            const {
                block,
            } = props;

            return CommonUtil.excludedProperties({
                obj: BlocklyUtil.Format.decode({
                    block: {
                        ...block,
                        _id: block?._id?.toString(),
                    },
                }),
                properties: ['createdAt', 'updatedAt', 'createdBy', 'type', '__v',],
            });
        }

        static encode = (props) => {
            const {block: outerBlock, images} = props;

            console.log('images', images);

            const block = structuredClone(outerBlock);

            const substanceKeyRegex = new RegExp(/(message|args)\d/);
            const result = {
                substance: {},
            };

            Object.keys(block).forEach(key => {
                if (substanceKeyRegex.test(key)) {
                    result.substance[key] = key.includes('args')
                        ? block[key]?.map(arg => {
                            if (arg.type !== BlocklyUtil.ArgType.FieldImage) {
                                return arg;
                            }

                            console.log('result', images?.find(image => image.displayName === arg.src)?.physicalName || arg.imageName);

                            return {
                                ...arg,
                                imageName: images?.find(image => image.displayName === arg.src)?.physicalName || arg.imageName,
                            };
                        })
                        : block[key];
                } else {
                    result[key] = block[key];
                }
            });

            return result;
        }

        static decode = (props) => {
            const {block} = props;
            const {
                substance,
                ...layout
            } = structuredClone(block);

            const argsRegex = new RegExp(/args/);
            const substanceFormat = Object.keys(substance).reduce((result, key) => {
                const value = !argsRegex.test(key)
                    ? substance[key]
                    : substance[key]?.map(arg => {
                        const argFormat = structuredClone(arg);

                        if (arg.type === BlocklyUtil.ArgType.FieldImage) {
                            argFormat.src = `${process.env.host || 'http://localhost:5500/'}blockly/${argFormat.imageName}`;
                        }

                        return argFormat;
                    });

                return {
                    ...result,
                    [key]: value,
                }
            }, {})
            return {
                ...substanceFormat,
                ...layout
            };
        }
    }

    static compareSubstance = (props) => {
        const {substance1, substance2,} = props;

        function formatContent(substance1) {
            return substance1?.blocks?.blocks?.map(block => {
                return {
                    fields: block.fields,
                    type: block.type,
                };
            });
        }

        return CommonUtil.compareObj({
            obj1: formatContent(substance1),
            obj2: formatContent(substance2),
        });
    }
}