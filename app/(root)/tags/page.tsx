import { TagFilters } from "@/Constant/filters";
import LocalSearchAndFilter from "@/components/shared/LocalSearchAndFilter";
import React from "react";
import { getAllTags } from "@/lib/actions/tags.action";
import NoResult from "@/components/shared/NoResult";
import Link from "next/link";
import { getTimeStamp } from "@/lib/utils";
import { SearchParamsProps } from "@/Types";

const page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllTags({
    searchQuery: searchParams.q,
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
                      {tag.questions.length}+
                    </span>{" "}
                    Questions
                  </p>

                  <p className="mt-5">
                    Was created at {getTimeStamp(tag.createdAt)}
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
    </div>
  );
};

export default page;
