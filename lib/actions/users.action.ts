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
import { BadgeCriteriaType } from "@/Types";
import { assignBadges } from "../utils";

export const getAllUsers = async (params: GetAllTagsParams) => {
  try {
    connectToDB();

    const { searchQuery, filter, page = 1, pageSize = 15 } = params;

    const query: FilterQuery<typeof User> = {};

    const skip = (page - 1) * pageSize;

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortUsers = {};

    switch (filter) {
      case "new_users":
        sortUsers = { joinedAt: -1 };
        break;
      case "old_users":
        sortUsers = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortUsers = { reputation: -1 };
    }

    const totalUsers = await User.countDocuments(query);

    const allUser = await User.find(query)
      .sort(sortUsers)
      .skip(skip)
      .limit(pageSize);
    const isNext = totalUsers > skip + allUser.length;

    return { allUser, isNext, totalUsers, pageSize };
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

    console.log("New user created: ", newUser);

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
    const { clerkId, searchQuery, page = 1, pageSize = 15, filter } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const skip = (page - 1) * pageSize;

    let sortOptions = {};

    switch (filter) {
      // Collections page
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;
      default:
        break;
    }

    const user = await User.findOne({ clerkId, query }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip,
        limit: pageSize,
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

    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skip + savedQuestions.length;

    return { questions: savedQuestions, isNext, pageSize, totalUsers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const userProfile = async (params: GetUserByIdParams) => {
  try {
    // Ensure database connection
    connectToDB();

    const { userId, page = 1, pageSize = 1 } = params;
    const skip = (page - 1) * pageSize;

    // Log userId to ensure it's passed correctly
    console.log(`Searching for user with ID: ${userId}`);

    // Find the user by clerkId
    const user = await User.findOne({ clerkId: userId })
      .skip(skip)
      .limit(pageSize);

    // If user is not found, throw an error
    if (!user) {
      console.error(`User not found with ID: ${userId}`);
      throw new Error("User not found!");
    }

    // Count user's questions and answers
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    const isQuestionsNext = totalQuestions > skip + pageSize;
    const isAnswersNext = totalAnswers > skip + pageSize;

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: { $ifNull: ["$upvotes", []] } },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: { $ifNull: ["$upvotes", []] } },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [questionViews] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const criteria: any = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      isAnswersNext,
      isQuestionsNext,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const getUserQuestions = async (params: GetUserStatsParams) => {
  try {
    connectToDB();

    // eslint-disable-next-line no-unused-vars
    const { userId, page = 1, pageSize = 10 } = params;

    const skip = (page - 1) * pageSize;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({
        createdAt: -1,
        views: -1,
        upvotes: -1,
      })
      .skip(skip)
      .limit(pageSize)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    const isNext = totalQuestions > skip + userQuestions.length;

    return { totalQuestions, questions: userQuestions, isNext, pageSize };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
