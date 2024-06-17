import { TagFilters } from "@/Constant/filters";
import LocalSearchAndFilter from "@/components/shared/LocalSearchAndFilter";
import React from "react";
import { getAllTags } from "@/lib/actions/tags.action";
import NoResult from "@/components/shared/NoResult";
import Link from "next/link";
import { getTimeStamp } from "@/lib/utils";

const page = async () => {
  const { tags: allTags } = await getAllTags({});
  return (
    <div>
      <LocalSearchAndFilter
        h1="All Tags"
        route="/tags"
        placeholder="Search for tags..."
        filter={TagFilters}
      />

      <section className="mt-12 flex flex-wrap gap-4">
        {allTags.length > 0 ? (
          allTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.id}`}
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
                    {tag.question.length}+
                  </span>{" "}
                  Questions
                </p>

                <p className="mt-5">
                  Was created at {getTimeStamp(tag.createdAt)}
                </p>
              </span>
            </Link>
          ))
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
