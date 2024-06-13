import ApiUtil from "#root/utils/api.util.js";
import ResolutionModel from "#root/models/resolution.model.js";
import AnswerModel from "#root/models/answer.model.js";
import CommonUtil from "#root/utils/common.util.js";
import BlocklyUtil from "#root/utils/blockly.util.js";

export default {
  putMarkByAnswer: async (req, res) => {
    const resolutions = await ResolutionModel.find({
      score: undefined,
    }).lean();

    const answers = await AnswerModel.find({}).lean();
    const answersGroupByQuestionId = answers.reduce((result, curr) => {
      return {
        [curr.questionId]: [
          ...(result?.questionId || []),
          curr,
        ]
      }
    }, {});

    for (const resolution of resolutions) {
      const answers = answersGroupByQuestionId[resolution?.questionId];
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

    console.log({ id, score });

    await ResolutionModel.findByIdAndUpdate(id, { score: score });

    res.json(ApiUtil.JsonRes());
  },
}