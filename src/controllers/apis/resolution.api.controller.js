import ApiUtil from "#root/utils/api.util.js";
import ResolutionModel from "#root/models/resolution.model.js";
import AnswerModel from "#root/models/answer.model.js";
import CommonUtil from "#root/utils/common.util.js";
import BlocklyUtil from "#root/utils/blockly.util.js";

export default {
  get: async (req, res) => {
    const {
      id,
    } = req.params;

    const resolution = await ResolutionModel.findById(id);

    res.json(ApiUtil.JsonRes({
      data: {
        resolution: {
          ...resolution,
          content: CommonUtil.jsonParse(resolution?.content, {}),
        },
      },
    }));
  },
  putMarkByAnswer: async (req, res) => {
    const resolutions = await ResolutionModel.find({
      score: undefined,
    }).lean();

    const answers = await AnswerModel.find({}).lean();
    const answersGroupByQuestion = answers.reduce((result, curr) => {
      return {
        [curr.question]: [
          ...(result?.question || []),
          curr,
        ]
      }
    }, {});

    for (const resolution of resolutions) {
      const answers = answersGroupByQuestion[resolution?.question];
      if (!answers) {
        continue;
      }
      const answer = answers.find(answer => {
        return BlocklyUtil.compareContent({
          content1: CommonUtil.jsonParse(answer?.content, {}),
          content2: CommonUtil.jsonParse(resolution?.content, {}),
        });
      })
      if (!answer) {
        continue;
      }

      await ResolutionModel.findByIdAndUpdate(resolution._id, {
        score: answer?.score,
      });
    }

    res.json(ApiUtil.JsonRes());
  },
  putMark: async (req, res) => {
    const {
      id,
    } = req.params;
    const {
      score,
    } = req.body;

    await ResolutionModel.findByIdAndUpdate(id, {score: score});

    res.json(ApiUtil.JsonRes());
  },
  getSolve: async (req, res) => {
    const {
      questionId,
    } = req.query;

    const resolution = await ResolutionModel
      .findOne({
        question: questionId,
        student: res.locals?.currentUser?._id,
      })
      .lean();

    res.json(ApiUtil.JsonRes({
      data: {
        resolution: {
          ...resolution,
          content: CommonUtil.jsonParse(resolution?.content, null),
        },
      },
    }));
  }
}