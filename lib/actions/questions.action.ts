"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    connectToDB();

    const questions = await Question.find({})
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

    const question = await Question.findById({ questionId });

    return question;
  } catch (error) {
    console.log(error);
    return [];
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
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
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
