import { Schema, models, model, Document } from "mongoose";

export interface IAnswer extends Document {
  content: string;
  author: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  upvoted: Schema.Types.ObjectId[];
  downvoted: Schema.Types.ObjectId[];
  createdAt: Date;
}

const AnswerSchema = new Schema({
  content: { type: String, require: true },
  author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  upvoted: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  downvoted: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  createdAt: { type: Date, default: Date.now },
});

const Answer = models.Answer || model("Answer", AnswerSchema);
export default Answer;
