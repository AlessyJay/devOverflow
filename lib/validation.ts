import { z } from "zod";

export const QuestionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(20),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const AnswerSchema = z.object({
  content: z
    .string()
    .min(20, { message: "Answer should have more than 20 characters!" }),
});

export const EditProfileSchema = z.object({
  name: z.string().min(2).max(30),
  username: z.string().min(2).max(15),
  portfolioWebsite: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});
