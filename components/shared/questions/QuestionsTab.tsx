import { getUserQuestions } from "@/lib/actions/users.action";
import React from "react";
import QuestionCards from "@/components/Cards/QuestionCards";
import { SearchParamsProps } from "@/Types";
import NoResult from "../NoResult";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

// searchProps

const QuestionsTab = async ({ userId, clerkId }: Props) => {
  const result = await getUserQuestions({ userId, page: 1 });
  return (
    <>
      {result.totalQuestions > 0 ? (
        result.questions.map((item) => (
          <QuestionCards
            key={item._id}
            id={item._id}
            clerkId={clerkId}
            title={item.title}
            author={item.author}
            createdAt={item.createdAt}
            views={item.views}
            upvote={item.upvotes}
            tags={item.tags}
            answers={item.answers}
          />
        ))
      ) : (
        <NoResult
          title="No Questions Found..."
          description="This amazing mind hasn't post anything, yet."
          link=""
          linkTitle=""
          type="question"
        />
      )}
    </>
  );
};

export default QuestionsTab;
