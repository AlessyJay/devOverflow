import QuestionCards from "@/components/Cards/QuestionCards";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { getSpecificTag } from "@/lib/actions/tags.action";
import { URLProps } from "@/Types";
import React from "react";

const page = async ({ params, searchParams }: URLProps) => {
  const result = await getSpecificTag({
    tagId: params.id,
    page: searchParams.page ? +searchParams.page : 1,
    searchQuery: searchParams.search,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

      <div className="mt-11 w-full">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Tag Questions"
          otherClasses="flex-1"
        />
      </div>

      <section className="my-10 flex w-full flex-col gap-6">
        <div>
          {result.questions && result.questions.length > 0 ? (
            result?.questions.map(
              (item: {
                _id: string;
                title: string;
                tags: { _id: string; name: string }[];
                author: { id: string; name: string; picture: string };
                upvotes: string[];
                views: number;
                createdAt: Date;
                answers: object[];
              }) => (
                <QuestionCards
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  tags={item.tags}
                  author={item.author}
                  upvote={item.upvotes}
                  views={item.views}
                  createdAt={item.createdAt}
                  answers={item.answers}
                />
              ),
            )
          ) : (
            <NoResult
              title="There are no tag questions to show..."
              description="Be the first to break the silence! Ask a question and kickstart the
        discussion. Our query could be next big thing others learn from. Get
        involved!"
              link="/ask-question"
              linkTitle="Ask a Question"
            />
          )}
        </div>

        {result.totalTags > result.pageSize && (
          <div className="mt-10">
            <Pagination
              isNext={result.isNext}
              pageNumber={searchParams.page ? +searchParams.page : 1}
            />
          </div>
        )}
      </section>
    </>
  );
};

export default page;
