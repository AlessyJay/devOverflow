"use server";

import Answer from "@/database/answer.model";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
  GetUserStatsParams,
} from "./shared.types";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import mongoose from "mongoose";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";

export const CreateAnswer = async (params: CreateAnswerParams) => {
  try {
    connectToDB();

    const { content, author, question, path } = params;

    const newAnswers = await Answer.create({
      content,
      author,
      question,
    });

    // Add the answer to the questions answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswers._id },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const GetAnswers = async (params: GetAnswersParams) => {
  try {
    connectToDB();

    const { questionId, page = 1, pageSize = 1, sortBy } = params;
    const skip = (page - 1) * pageSize;

    let sortOptions = {};
    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvoted: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvoted: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
    }

    const GetAnswer = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .skip(skip)
      .limit(pageSize)
      .sort(sortOptions);

    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const isNext = totalAnswers > skip + GetAnswer.length;

    return { GetAnswer, isNext, totalAnswers, pageSize };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const upvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    await connectToDB();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      throw new Error("Invalid answer ID!");
    }

    let updateQuery = {};
    const pullOperations: any = {};
    const pushOperations: any = {};

    if (hasupVoted) {
      pullOperations.upvoted = userId;
    } else {
      pushOperations.upvoted = userId;
      if (hasdownVoted) {
        pullOperations.downvoted = userId;
      }
    }

    if (Object.keys(pullOperations).length > 0) {
      updateQuery = { ...updateQuery, $pull: pullOperations };
    }
    if (Object.keys(pushOperations).length > 0) {
      updateQuery = { ...updateQuery, $addToSet: pushOperations };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    // Check if the user is the author of the question
    if (answer.author.toString() === userId) {
      return null;
    }

    if (!answer) {
      throw new Error("Answer not found");
    }

    // Increment author's reputation by +1/-1 for upvotting
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    // Increment author's reputation by +10/-10 for recieving an upvote/downvote to the question.
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downvoteAnswer = async (params: AnswerVoteParams) => {
  try {
    await connectToDB();

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      throw new Error("Invalid answer ID!");
    }

    let updateQuery = {};
    const pullOperations: any = {};
    const pushOperations: any = {};

    if (hasdownVoted) {
      pullOperations.downvoted = userId;
    } else {
      pushOperations.downvoted = userId;
      if (hasupVoted) {
        pullOperations.upvoted = userId;
      }
    }

    if (Object.keys(pullOperations).length > 0) {
      updateQuery = { ...updateQuery, $pull: pullOperations };
    }
    if (Object.keys(pushOperations).length > 0) {
      updateQuery = { ...updateQuery, $addToSet: pushOperations };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    // Check if the user is the author of the question
    if (answer.author.toString() === userId) {
      return null;
    }

    if (!answer) {
      throw new Error("Answer not found");
    }

    // Increment author's reputation by +1/-1 for upvotting
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    // Increment author's reputation by +10/-10 for recieving an upvote/downvote to the question.
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserAnswer = async (params: GetUserStatsParams) => {
  try {
    connectToDB();

    // eslint-disable-next-line no-unused-vars
    const { userId, page = 1, pageSize = 10, filter } = params;

    const countAnswers = await Answer.countDocuments({ author: userId });

    const skip = (page - 1) * pageSize;

    let sortAnswers = {};

    switch (filter) {
      case "highestUpvotes":
        sortAnswers = { upvoted: -1 };
        break;
      case "lowestUpvotes":
        sortAnswers = { upvoted: 1 };
        break;
      case "recent":
        sortAnswers = { createdAt: -1 };
        break;
      case "old":
        sortAnswers = { createdAt: 1 };
        break;
      default:
        break;
    }

    const answers = await Answer.find({ author: userId })
      .sort(sortAnswers)
      .skip(skip)
      .limit(pageSize)
      .populate({ path: "question", model: Question, select: "_id title" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    const isNext = countAnswers > skip + answers.length;

    return { countAnswers, answers, isNext, pageSize };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteAnswer = async (params: DeleteAnswerParams) => {
  try {
    connectToDB();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found!");
    }

    await answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } },
    );
    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
