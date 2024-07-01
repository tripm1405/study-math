import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import BlockModel from "#root/models/block.model.js";

const ITEMS_PER_PAGE = 10;

export default {
  get: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const blocks = await BlockModel.find({})
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    const totalBlocks = await BlockModel.countDocuments();

    const indexedBlocks = blocks.map((block, index) => ({
      ...block.toObject(),
      index: (page - 1) * ITEMS_PER_PAGE + index + 1,
    }));

    res.render('pages/managers/block.page.ejs', ViewUtil.getOptions({
      data: {
        blocks: indexedBlocks,
        currentPage: page,
        totalPages: Math.ceil(totalBlocks / ITEMS_PER_PAGE),
      },
    }));
  },
  getDetail: async (req, res) => {
    const { id } = req?.params;

    if (!id) return res.json({
      success: false,
      id: id,
    });

    const block = await BlockModel.findById(id);

    const blockContent = (() => {
      try {
        return JSON.parse(block?.content);
      } catch {
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

    res.render('pages/managers/block-detail.page.ejs', ViewUtil.getOptions({
      data: {
        block: block,
        argss: argss,
      },
    }));
  },
  post: async (req, res) => {
    const { code, name, content, note } = req.body;

    const block = await BlockModel.create({
      code: code,
      name: name,
      content: content,
      note: note,
      createdBy: res?.locals?.currentUser?._id,
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

    const block = await BlockModel.findByIdAndUpdate(id, {
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