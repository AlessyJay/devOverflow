import { getUserQuestions } from "@/lib/actions/users.action";
import React from "react";
import QuestionCards from "@/components/Cards/QuestionCards";
import { SearchParamsProps } from "@/Types";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}

const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({ userId, page: 1 });

  console.log(result);
  return (
    <div>
      {result.questions.map((item) => (
        <QuestionCards
          key={item._id}
          id={item._id}
          clerkId={clerkId}
          title={item.title}
          author={item.upvotes}
          createdAt={item.createdAt}
          views={item.views}
          upvote={item.upvotes}
          tags={item.tags}
          answers={item.answers}
        />
      ))}
    </div>
  );
};

export default QuestionsTab;
