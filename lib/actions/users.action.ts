"use server";

import User from "@/database/user.model";
import { connectToDB } from "../mongoose";

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
