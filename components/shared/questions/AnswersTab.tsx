import AnswerCard from "@/components/Cards/AnswerCards";
import { getUserAnswer } from "@/lib/actions/answers.action";
import { SearchParamsProps } from "@/Types";
import React from "react";
import NoResult from "../NoResult";
import Filter from "../search/Filter";
import { AnswerFilters } from "@/Constant/filters";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId: string | undefined;
}

const AnswersTab = async ({ userId, clerkId, searchParams }: Props) => {
  const result = await getUserAnswer({
    userId,
    page: 1,
    filter: searchParams.filter,
  });
  return (
    <>
      <div className="flex justify-end">
        <Filter
          filters={AnswerFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      {result.countAnswers > 0 ? (
        result.answers.map((item) => (
          <AnswerCard
            key={item._id}
            clerkId={clerkId}
            _id={item._id}
            content={item.content}
            question={item.question}
            author={item.author}
            upvotes={item.upvoted.length}
            createdAt={item.createdAt}
          />
        ))
      ) : (
        <NoResult
          title="No Answers Found..."
          description="This amazing mind hasn't answered anything, yet."
          link=""
          linkTitle=""
          type="answer"
        />
      )}
    </>
  );
};

export default AnswersTab;
