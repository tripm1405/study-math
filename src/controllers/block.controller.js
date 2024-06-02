import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import BlockModel from "#root/models/block.model.js";

export default {
  get: async (req, res) => {
    const blocks = await BlockModel.find({});
    const newId = new mongoose.Types.ObjectId();

    res.render('pages/block.page.ejs', ViewUtil.getOptions({
      data: {
        blocks: blocks,
        newId: newId,
      },
    }));
  },
  getDetail: async (req, res) => {
    const { id } = req?.params;

    if (!id) return res.json({
      success: false,
      id: id,
    });

    const block = await BlockModel.findById(id) || {};
    console.log('block', block);

    const blockContent = (() => {
      try {
        return JSON.parse(block?.content);
      }
      catch {
        return {
          args0: [
            {
              type: 'field_label',
              text: 'Text',
            },
          ],
        };
      }
    })();

    const argss = Object.keys(blockContent).filter(e => e.includes('args')).map((e, i) => {
      return blockContent[`args${i}`];
    });
    console.log('argss', argss);

    res.render('pages/block-detail.page.ejs', ViewUtil.getOptions({
      data: {
        block: block,
        argss: argss,
      },
    }));
  },
  post: async (req, res) => {
    const { code, name, content, note } = req.body;

    console.log('req.body', req.body)

    const block = await BlockModel.create({
      code: code,
      name: name,
      content: content,
      note: note,
    });

    res.json({
      result: {
        success: true,
        block: block,
      },
    });
  },
  put: async (req, res) => {
    const { id } = req?.params;
    const { name, content, note } = req.body;

    const block = await BlockModel.findByIdAndUpdate(id,{
      name: name,
      content: content,
      note: note,
    });

    res.json({
      result: {
        success: true,
        block: block,
      },
    });
  },
  delete: async (req, res) => {
    const { id } = req?.params;

    await BlockModel.findByIdAndDelete(id);

    res.json({
      result: {
        success: true,
      },
    });
  },
}