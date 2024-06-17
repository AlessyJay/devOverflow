"use server";

import User from "@/database/user.model";
import { connectToDB } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllTagsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import mongoose from "mongoose";

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
    await connectToDB();

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
    await connectToDB();

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
