import ViewUtil from "#root/utils/view.util.js";
import ResolutionModel from "#root/models/resolution.model.js";

const ITEMS_PER_PAGE = 10;

export default {
  getList: async (req, res) => {
    const {
      questionId,
      page = 1,
    } = req.query;

    const filter = {
      score: undefined,
      content: {
        $ne: undefined,
      },
    };
    if (questionId) {
      filter.question = questionId;
    }

    const totalResolutions = await ResolutionModel.countDocuments(filter);
    const totalPages = Math.ceil(totalResolutions / ITEMS_PER_PAGE);

    const resolutions = await ResolutionModel
      .find(filter)
      .populate('student')
      .populate('question')
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/resolution.page.ejs`;
    res.render(view, ViewUtil.getOptions({
      data: {
        resolutions: resolutions,
        currentPage: parseInt(page),
        totalPages: totalPages,
        ITEMS_PER_PAGE: ITEMS_PER_PAGE,
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