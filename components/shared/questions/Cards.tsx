import React from "react";
import NoResult from "../NoResult";
import QuestionCards from "@/components/Cards/QuestionCards";

const Cards = () => {
  const questions: any[] = [
    {
      id: 1,
      title: "What is Elon Musk doing today?",
      tags: [
        {
          id: 1,
          title: "Next.js",
        },
        {
          id: 2,
          title: "React.js",
        },
        {
          id: 3,
          title: "MongoDB",
        },
        {
          id: 4,
          title: "Redwood.js",
        },
        {
          id: 5,
          title: "NeonDB",
        },
      ],
      author: {
        id: "1",
        name: "John Doe",
        picture: "/assets/icons/avatar.svg",
      },
      upvote: 400,
      views: 150,
      answers: 650,
      createdAt: new Date("2024-03-01T12:00:00.000Z"),
    },
    {
      id: 2,
      title: "What is Redwood.js?",
      tags: [
        {
          id: 1,
          title: "Redwood.js",
        },
        {
          id: 2,
          title: "React.js",
        },
        {
          id: 3,
          title: "MongoDB",
        },
      ],
      author: {
        id: "2",
        name: "John McKee",
        picture: "/assets/icons/avatar.svg",
      },
      upvote: 2685,
      views: 74500,
      answers: 1354,
      createdAt: new Date("2021-09-01T12:00:00.000Z"),
    },
  ];

  return (
    <div>
      {questions.length > 0 ? (
        questions.map((item) => (
          <QuestionCards
            key={item.id}
            id={item.id}
            title={item.title}
            tags={item.tags}
            author={item.author}
            upvote={item.upvote}
            views={item.views}
            createdAt={item.createdAt}
            answers={item.answers}
          />
        ))
      ) : (
        <NoResult
          title="There are no questions to show"
          description="Be the first to break the silence! Ask a question and kickstart the
        discussion. Our query could be next big thing others learn from. Get
        involved!"
          link="/ask-question"
          linkTitle="Ask a Question"
        />
      )}
    </div>
  );
};

export default Cards;
