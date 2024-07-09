import React from "react";
import Filter from "./search/Filter";
import { AnswerFilters } from "@/Constant/filters";
import { GetAnswers } from "@/lib/actions/answers.action";
import Link from "next/link";
import Image from "next/image";
import { getTimeStamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import Pagination from "./Pagination";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "./search/EditDeleteAction";

interface Props {
  questionId: string;
  clerkId?: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: number;
  searchParams?: { [key: string]: string | undefined };
}

const AllAnswers = async ({
  questionId,
  userId,
  clerkId,
  totalAnswers,
  page,
  searchParams,
}: Props) => {
  const result = await GetAnswers({
    questionId,
    page: searchParams?.page ? +searchParams.page : 1,
    sortBy: searchParams?.filter,
  });

  const store: string[] = result.GetAnswer.map((item) => item.author.clerkId);

  const showActionButtons = clerkId && store.includes(clerkId);

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

                <div className="flex justify-start">
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

                <SignedIn>
                  {showActionButtons && (
                    <EditDeleteAction
                      type="Answer"
                      itemId={JSON.stringify(answer._id)}
                    />
                  )}
                </SignedIn>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </div>
        ))}

        {result.totalAnswers > result.pageSize && (
          <div className="mt-10">
            <Pagination isNext={result.isNext} pageNumber={page ? +page : 1} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAnswers;
