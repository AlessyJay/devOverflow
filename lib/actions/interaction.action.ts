"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export const viewQuestions = async (params: ViewQuestionParams) => {
  try {
    connectToDB();

    const { questionId, userId } = params;

    // Update view count for the question
    // await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) return null;

      //   Create interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });

      // Update view count for the question
      await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
