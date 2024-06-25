import { TagFilters } from "@/Constant/filters";
import LocalSearchAndFilter from "@/components/shared/LocalSearchAndFilter";
import React from "react";
import { getAllTags } from "@/lib/actions/tags.action";
import NoResult from "@/components/shared/NoResult";
import Link from "next/link";
import { getJoinedDate, getTimeStamp } from "@/lib/utils";
import { SearchParamsProps } from "@/Types";
import Pagination from "@/components/shared/Pagination";

const page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllTags({
    searchQuery: searchParams.search,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <div>
      <LocalSearchAndFilter
        h1="All Tags"
        route="/tags"
        placeholder="Search for tags..."
        filter={TagFilters}
      />

      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => {
            const { day, month, year } = getJoinedDate(
              tag.createdAt.toString(),
            );
            return (
              <Link
                key={tag._id}
                href={`/tags/${tag._id}`}
                className="shadow-light100_darknone"
              >
                <span className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                  <span className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                    <p className="paragraph-semibold text-dark300_light900">
                      {tag.name}
                    </p>
                  </span>

                  <p className="small-medium text-dark400_light500 mt-3.5">
                    <span className="body-semibold primary-text-gradient mr-2.5">
                      {tag.questions.length > 1
                        ? tag.questions.length + " Questions"
                        : tag.questions.length + " Question"}
                    </span>
                  </p>

                  <p className="text-dark300_light900 mt-5">
                    Created on {day} {month} {year}
                    <br />({getTimeStamp(tag.createdAt)})
                  </p>
                </span>
              </Link>
            );
          })
        ) : (
          <NoResult
            title="No Tags Found!"
            description="It looks like there are no tags available for now."
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </section>

      <div className="mt-10">
        <Pagination
          isNext={result.isNext}
          pageNumber={searchParams.page ? +searchParams.page : 1}
        />
      </div>
    </div>
  );
};

export default page;
