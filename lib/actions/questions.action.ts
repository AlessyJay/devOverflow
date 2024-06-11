"use server";

import Question from "@/database/question.model";
import { connectToDB } from "../mongoose";
import Tag from "@/database/tag.model";

export const CreateQuestion = async (params: any) => {
  // eslint-disable-next-line no-empty
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
        { $setOnInsert: { name: tag }, $push: { question: question.id } },
        { upsert: true, new: true },
      );

      tagsDocument.push(existingTag.id);
    }

    await Question.findOneAndUpdate(question.id, {
      $push: { tags: { $each: tagsDocument } },
    });

    // Create an interaction record for the user's ask_question
  } catch (error) {
    console.log(error);
  }
};
