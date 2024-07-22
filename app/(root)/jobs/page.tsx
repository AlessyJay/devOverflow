import JobCards from "@/components/Cards/JobCards";
import JobFilter from "@/components/shared/search/JobFilter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { HomePageFilters } from "@/Constant/filters";
import React from "react";

const page = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Job's title, company's name, position, etc..."
          otherClasses="flex-1"
        />

        <JobFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="my-10 flex w-full flex-col gap-6">
        <JobCards />
      </section>
    </div>
  );
};

export default page;
