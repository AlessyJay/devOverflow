import React from "react";
// import QuestionCards from "@/components/Cards/QuestionCards";
// import NoResult from "../NoResult";
// import { getUserAnswer } from "@/lib/actions/answers.action";

const AnswersTab = async ({ userID }: { userID: string }) => {
  // const answers = await getUserAnswer({ userId: userID });
  return (
    <div>
      {/* {answers.answers.length > 0 ? (
        answers.answers.map((item) => {
          return (
            <QuestionCards
              key={item._id}
              id={item._id}
              title={item.content}
              author={{
                id: item.author.clerkId,
                name: item.author.name,
                picture: item.author.picture,
              }}
              createdAt={item.createdAt}
              views={0}
              upvote={item.upvotes || []}
              downvote={item.downvotes || []}
              tags={[]}
              answers={[]}
              path="profile"
            />
          );
        })
      ) : (
        <NoResult
          title="This amazing mind hasn't been posted yet."
          description="We hope in the future there will be some posts from them."
          link="/ask-question"
          linkTitle="Ask a Question"
        />
      )} */}
    </div>
  );
};

export default AnswersTab;
