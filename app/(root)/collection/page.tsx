import { QuestionFilters } from "@/Constant/filters";
import { SearchParamsProps } from "@/Types";
import QuestionCards from "@/components/Cards/QuestionCards";
import NoResult from "@/components/shared/NoResult";
import Filter from "@/components/shared/search/Filter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { allSavedQuestions } from "@/lib/actions/users.action";
import { auth } from "@clerk/nextjs/server";
import React from "react";

interface itemProps {
  id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: { id: string; name: string; picture: string };
  upvotes: string[];
  views: number;
  createdAt: Date;
  answers: object[];
}

const page = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const result = await allSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.search,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Favourite Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Favourite Questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <section className="my-10 flex w-full flex-col gap-6">
        <div>
          {result && result.questions.length > 0 ? (
            result?.questions.map((item: itemProps) => (
              <QuestionCards
                key={item.id}
                id={item.id}
                title={item.title}
                tags={item.tags}
                author={item.author}
                upvote={item.upvotes}
                views={item.views}
                createdAt={item.createdAt}
                answers={item.answers}
              />
            ))
          ) : (
            <NoResult
              title="There are no saved questions to show..."
              description="Be the first to break the silence! Ask a question and kickstart the
        discussion. Our query could be next big thing others learn from. Get
        involved!"
              link="/ask-question"
              linkTitle="Ask a Question"
            />
          )}
        </div>
      </section>
    </>
  );
};

export default page;
