import React from "react";
import Filter from "./search/Filter";
import { AnswerFilters } from "@/Constant/filters";
import { GetAnswers } from "@/lib/actions/answers.action";
import Link from "next/link";
import Image from "next/image";
import { getTimeStamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: number;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) => {
  const result = await GetAnswers({ questionId });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers > 1
            ? `${totalAnswers} Answers`
            : `${totalAnswers} Answer`}
        </h3>

        {/* TODO: Filters */}
        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {/* TODO: Answer List */}
        {result.GetAnswer.map((answer) => (
          <div
            key={answer.id}
            id={answer.id}
            className="light-border text-dark300_light900 border-b py-10"
          >
            <div className="flex items-center justify-between">
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    width={24}
                    height={24}
                    alt="profile picture"
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}
                    </p>
                    <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                      <span className="max-sm:hidden">
                        • {getTimeStamp(answer.createdAt)}
                      </span>
                    </p>
                  </div>
                </Link>

                <div className="flex justify-end">
                  {/* todo: voting function for comments */}
                  <Votes
                    type="Answer"
                    itemId={JSON.stringify(answer._id)}
                    userId={JSON.stringify(userId)}
                    upvotes={answer.upvoted.length}
                    hasUpvoted={answer.upvoted.includes(userId)}
                    downvotes={answer.downvoted.length}
                    hasDownVoted={answer.downvoted.includes(userId)}
                  />
                </div>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
