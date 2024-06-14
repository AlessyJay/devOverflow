"use server";

import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import { connectToDB } from "../mongoose";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";

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
