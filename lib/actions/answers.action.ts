"use server";

import Answer from "@/database/answer.model";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
  GetUserStatsParams,
} from "./shared.types";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import mongoose from "mongoose";
import User from "@/database/user.model";

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

    // TODO: Add interaction

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const GetAnswers = async (params: GetAnswersParams) => {
  try {
    connectToDB();

    const { questionId } = params;

    const GetAnswer = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });

    return { GetAnswer };
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

    if (!answer) {
      throw new Error("Answer not found");
    }

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

    if (!answer) {
      throw new Error("Answer not found");
    }

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
    const { userId, page = 1, pageSize = 10 } = params;

    const countAnswers = await Answer.countDocuments({ author: userId });

    const answers = await Answer.find({ author: userId })
      .sort({
        upvoted: -1,
      })
      .populate({ path: "question", model: Question, select: "_id title" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return { answers, totalAnswers: countAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
