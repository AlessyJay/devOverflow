"use server";

import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import { connectToDB } from "../mongoose";
import User from "@/database/user.model";
import Tag, { ITag } from "@/database/tag.model";
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

    // eslint-disable-next-line no-unused-vars
    const { page = 1, pageSize = 15, filter, searchQuery } = params;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    const skip = (page - 1) * pageSize;

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .populate("questions")
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
    const totalTags = await Tag.countDocuments(query);
    const isNext = totalTags > skip + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSpecificTag = async (params: GetQuestionsByTagIdParams) => {
  try {
    connectToDB();

    // eslint-disable-next-line no-unused-vars
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
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

    const questions = tag.questions;

    console.log({ questions });

    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getHotTags = async (params: GetAllTagsParams) => {
  try {
    connectToDB();

    const tags = await Tag.find().sort({ questions: -1 }).limit(10);

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
