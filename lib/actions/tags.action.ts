"use server";

import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import { connectToDB } from "../mongoose";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams,
) => {
  try {
    connectToDB();

    // eslint-disable-next-line no-unused-vars
    const { userId, limit = 3 } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // Find interaction for the user and group by tags...
    // Interaction...
    return [
      { id: "1", title: "tag" },
      { id: "2", title: "tag2" },
    ];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    connectToDB();

    const tags = await Tag.find({}).populate("question");

    return { tags };
  } catch (error) {
    console.log(error);
    return { tags: [] };
  }
};

export const getSpecificTag = async (params: GetQuestionsByTagIdParams) => {
  try {
    connectToDB();

    // eslint-disable-next-line no-unused-vars
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const tag = await Tag.findOne({ tagId }).populate({
      path: "question",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tagId) {
      throw new Error("There is no such tag!");
    }

    const getTheTag = tag.saved;

    return { tags: getTheTag };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
