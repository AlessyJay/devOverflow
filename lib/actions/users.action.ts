"use server";

import User from "@/database/user.model";
import { connectToDB } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllTagsParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import mongoose, { FilterQuery } from "mongoose";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

export const getAllUsers = async (params: GetAllTagsParams) => {
  try {
    connectToDB();

    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const allUser = await User.find({}).sort({ createdAt: -1 });

    console.log(allUser);

    return allUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserById = async ({ userId }: { userId: string }) => {
  try {
    connectToDB();

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createUser = async (userData: CreateUserParams) => {
  try {
    connectToDB();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (userData: UpdateUserParams) => {
  try {
    connectToDB();

    const { clerkId, updateData, path } = userData;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {}
};

export const deleteUser = async (userData: DeleteUserParams) => {
  try {
    connectToDB();

    const { clerkId } = userData;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found!");
    }

    // Delete user from database
    // and questions, answers, comments

    // get user questions ids
    // eslint-disable-next-line no-unused-vars
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id",
    );

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user's answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {}
};

export const saveQuestion = async (params: ToggleSaveQuestionParams) => {
  try {
    connectToDB();

    const { userId, questionId, path } = params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      throw new Error("Invalid question ID!");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }

    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error("Question not found!");
    }

    if (!user.saved.includes(questionId)) {
      user.saved.push(questionId);
      await user.save();
    } else {
      user.saved.pull(questionId);
      await user.save();
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const allSavedQuestions = async (params: GetSavedQuestionsParams) => {
  try {
    connectToDB();

    // eslint-disable-next-line no-unused-vars
    const { clerkId, searchQuery, page = 1, pageSize = 10, filter } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User not found!");
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userProfile = async (params: GetUserByIdParams) => {
  try {
    connectToDB();

    const { userId } = params;

    const user = await User.findOne({ userId });

    if (!user) {
      throw new Error("User not found!");
    }

    const totalQuestions = await Question.countDocuments({
      author: user._id,
    });
    const totalAnswers = await Answer.countDocuments({
      author: user._id,
    });

    return { user, totalQuestions, totalAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserQuestions = async (params: GetUserStatsParams) => {
  try {
    connectToDB();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({
        views: -1,
        upvotes: -1,
      })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    return { totalQuestions, questions: userQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
