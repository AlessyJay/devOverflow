"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import mongoose, { FilterQuery } from "mongoose";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    connectToDB();

    const { searchQuery } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (err) {
    console.log(err);
  }
};

export const getQuestionById = async (params: GetQuestionByIdParams) => {
  try {
    connectToDB();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const CreateQuestion = async (params: CreateQuestionParams) => {
  try {
    connectToDB();

    // eslint-disable-next-line no-unused-vars
    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagsDocument = [];

    // Create the tags or get them if they existed already.
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true },
      );

      tagsDocument.push(existingTag._id);
    }

    await Question.findOneAndUpdate(question._id, {
      $push: { tags: { $each: tagsDocument } },
    });

    // Create an interaction record for the user's ask_question
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
};

export const upvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    await connectToDB();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      throw new Error("Invalid question ID!");
    }

    let updateQuery = {};
    const pullOperations: any = {};
    const pushOperations: any = {};

    if (hasupVoted) {
      pullOperations.upvotes = userId;
    } else {
      pushOperations.upvotes = userId;
      if (hasdownVoted) {
        pullOperations.downvotes = userId;
      }
    }

    if (Object.keys(pullOperations).length > 0) {
      updateQuery = { ...updateQuery, $pull: pullOperations };
    }
    if (Object.keys(pushOperations).length > 0) {
      updateQuery = { ...updateQuery, $addToSet: pushOperations };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Increment author's reputation by =10 for upvotting

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downvoteQuestion = async (params: QuestionVoteParams) => {
  try {
    await connectToDB();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      throw new Error("Invalid question ID!");
    }

    let updateQuery = {};
    const pullOperations: any = {};
    const pushOperations: any = {};

    if (hasdownVoted) {
      pullOperations.downvotes = userId;
    } else {
      pushOperations.downvotes = userId;
      if (hasupVoted) {
        pullOperations.upvotes = userId;
      }
    }

    if (Object.keys(pullOperations).length > 0) {
      updateQuery = { ...updateQuery, $pull: pullOperations };
    }
    if (Object.keys(pushOperations).length > 0) {
      updateQuery = { ...updateQuery, $addToSet: pushOperations };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteQuestion = async (params: DeleteQuestionParams) => {
  try {
    connectToDB();

    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } },
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const editQuestion = async (params: EditQuestionParams) => {
  try {
    connectToDB();

    // eslint-disable-next-line no-unused-vars
    const { questionId, title, content, path } = params;

    const questions = await Question.findById(questionId).populate({
      path: "tags",
      model: Tag,
    });

    if (!questions) throw new Error("Question not found!");

    questions.title = title;
    questions.content = content;

    await questions.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getHotQuestions = async (params: GetQuestionsParams) => {
  try {
    connectToDB();

    const questions = await Question.find().sort({ upvotes: -1 }).limit(6);

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getQuestionsFilter = async (params: GetQuestionsParams) => {
  try {
    connectToDB();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
