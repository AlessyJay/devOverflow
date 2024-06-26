import { HomePageFilters } from "@/Constant/filters";
import { SearchParamsProps } from "@/Types";
import QuestionCards from "@/components/Cards/QuestionCards";
import HomeFilters from "@/components/Home/HomeFilter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import Filter from "@/components/shared/search/Filter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { getQuestions } from "@/lib/actions/questions.action";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamsProps) {
  const result: any = await getQuestions({
    searchQuery: searchParams.search,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <section className="my-10 flex w-full flex-col gap-6">
        <div>
          {result.questions.length > 0 ? (
            result.questions.map(
              (item: {
                id: string;
                title: string;
                tags: { _id: string; name: string }[];
                author: {
                  [x: string]: string;
                  id: string;
                  name: string;
                  picture: string;
                };
                upvotes: string[];
                views: number;
                createdAt: Date;
                answers: object[];
              }) => (
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
              ),
            )
          ) : (
            <NoResult
              key="NoResult"
              title="There are no questions to show"
              description="Be the first to break the silence! Ask a question and kickstart the
        discussion. Our query could be next big thing others learn from. Get
        involved!"
              link="/ask-question"
              linkTitle="Ask a Question"
            />
          )}
        </div>

        {result.totalQuestions > result.pageSize && (
          <div className="mt-10">
            <Pagination
              pageNumber={searchParams?.page ? +searchParams.page : 1}
              isNext={result.isNext}
            />
          </div>
        )}
      </section>
    </>
  );
}
