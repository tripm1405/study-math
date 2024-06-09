import ApiUtil from "#root/utils/api.util.js";
import ResolutionModel from "#root/models/resolution.model.js";

export default {
  putMark: async (req, res) => {
    const {
      id,
    } = req.params;
    const {
      score,
    } = req.body;

    console.log({ id, score });

    await ResolutionModel.findByIdAndUpdate(id, { score: score });

    res.json(ApiUtil.JsonRes());
  },
}