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
  RecommendedParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import mongoose, { FilterQuery } from "mongoose";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    connectToDB();

    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    // Calculate the number of posts to skil based on the page number and page size
    const skip = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        sortOptions = { createdAt: -1 };
        break;
      case "recommended":
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .skip(skip)
      .limit(pageSize)
      .sort(sortOptions);

    const totalQuestion = await Question.countDocuments(query);
    const isNext: any = totalQuestion > skip + questions.length;

    return { questions, isNext, totalQuestion, pageSize };
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getQuestionById = async (params: GetQuestionByIdParams) => {
  try {
    connectToDB();

    const { questionId, page = 1, pageSize = 1 } = params;

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

    const skip = (page - 1) * pageSize;
    // const paginatedAnswers = question.answers.slice(skip, skip + pageSize);
    const totalAnswers = question.answers.length;
    const isNext = totalAnswers > skip + pageSize;

    return {
      question,
      isNext,
      totalAnswers,
    };
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
    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question.id,
      tags: tagsDocument,
    });

    // Increment author's reputation by +5 for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
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

    // Check if the user is the author of the question
    if (question.author.toString() === userId) {
      return null;
    }

    if (!question) {
      throw new Error("Question not found");
    }

    // Increment author's reputation by +1/-1 for upvotting
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    // Increment author's reputation by +10/-10 for recieving an upvote/downvote to the question.
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

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

    // Check if the user is the author of the question
    if (question.author.toString() === userId) {
      return null;
    }

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

export const getRecommendedQuestions = async (params: RecommendedParams) => {
  try {
    connectToDB();

    const { userId, page = 1, pageSize = 10, searchQuery } = params;

    // Find user
    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found!");

    const skip = (page - 1) * pageSize;

    // Find the user's interaction
    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .skip(skip)
      .limit(pageSize)
      .exec();

    // Extract tags from user's interactions
    const userTags = userInteractions.reduce(
      (tags: string | any[], interactions: { tags: any }) => {
        if (interactions.tags) {
          tags = tags.concat(interactions.tags);
        }
        return tags;
      },
      [],
    );

    // Get distinct tag IDs from users interaction
    const disctinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: disctinctUserTagIds } }, // Questions with user's tags
        { author: { $ne: user._id } },
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { author: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      });

    const isNext = totalQuestions > skip + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (error) {
    console.log(error);
  }
};
