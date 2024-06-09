import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import BlockModel from "#root/models/block.model.js";
import ResolutionModel from "#root/models/resolution.model.js";

export default {
  getList: async (req, res) => {
    const resolutions = await ResolutionModel.find({
      score: undefined,
      content: {
        $ne: undefined,
      },
    });

    const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/resolution.page.ejs`;
    res.render(view, ViewUtil.getOptions({
      data: {
        resolutions: resolutions,
      },
    }));
  },
  get: async (req, res) => {
    const { id } = req?.params;

    if (!id) return res.json({
      success: false,
      id: id,
    });

    const resolution = await ResolutionModel.findById(id);

    const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/resolution-detail.page.ejs`;
    res.render(view, ViewUtil.getOptions({
      data: {
        resolution: resolution,
      },
    }));
  },
}