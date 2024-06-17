"use server";

import Answer from "@/database/answer.model";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

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
