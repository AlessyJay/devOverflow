import { UserFilters } from "@/Constant/filters";
import { SearchParamsProps } from "@/Types";
import CommunityCards from "@/components/Cards/CommunityCards";
import Pagination from "@/components/shared/Pagination";
import Filter from "@/components/shared/search/Filter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { getAllUsers } from "@/lib/actions/users.action";
import Link from "next/link";
import React from "react";

const page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllUsers({
    searchQuery: searchParams.search,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Developers</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds!"
          otherClasses="flex-1"
        />

        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.allUser.length > 0 ? (
          result.allUser.map((user) => (
            <>
              <CommunityCards key={user.id} user={user} />
            </>
          ))
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No amazing minds available, yet.</p>
            <Link href="/sign-up" className="mt-1 font-bold text-accent-blue">
              Join us to be the first amazing mind!
            </Link>
          </div>
        )}
      </section>

      {result.totalUsers > result.pageSize && (
        <div className="mt-10">
          <Pagination
            isNext={result.isNext}
            pageNumber={searchParams.page ? +searchParams.page : 1}
          />
        </div>
      )}
    </>
  );
};

export default page;
