import QuestionCards from "@/components/Cards/QuestionCards";
import { getUserAnswer } from "@/lib/actions/answers.action";
import { SearchParamsProps } from "@/Types";
import React from "react";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId: string;
}

const AnswersTab = async ({ userId, clerkId }: Props) => {
  const result = await getUserAnswer({ userId, page: 1 });

  console.log(result);
  return (
    <>
      {result.answers.map((item) => (
        <QuestionCards
          key={item._id}
          id={item._id}
          clerkId={clerkId}
          title={item.title}
          author={item.author}
          createdAt={item.createdAt}
          views={item.views}
          upvote={item.upvoted.length}
          tags={item.tags}
          answers={item.answers}
          type="answers"
        />
      ))}
    </>
  );
};

export default AnswersTab;
