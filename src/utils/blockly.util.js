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

                            console.log('images', images);

                            return {
                                ...arg,
                                src: images?.find(image => image.displayName === arg.src)?.physicalName,
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

            return {
                ...substance,
                ...layout
            }
        }
    }

    static compareSubstance = (props) => {
        const {substance1, substance2,} = props;

        return true;
    }
}