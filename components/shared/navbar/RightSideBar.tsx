import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";
import { getHotQuestions } from "@/lib/actions/questions.action";
import { getHotTags } from "@/lib/actions/tags.action";

const RightSideBar = async () => {
  const result = await getHotQuestions({});
  const tagResult = await getHotTags({});
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div className="flex flex-1 flex-col gap-6">
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {result.questions.length > 0 ? (
            result.questions.map((item) => (
              <Link
                href={`/question/${item._id}`}
                key={item.id}
                className="flex cursor-pointer items-center justify-between gap-7"
              >
                <p className="body-medium text-dark500_light700 line-clamp-1">
                  {item.title}
                </p>
                <Image
                  src="/assets/icons/chevron-right.svg"
                  alt="chevron right"
                  width={20}
                  height={20}
                  className="invert-colors"
                />
              </Link>
            ))
          ) : (
            <h3 className="text-dark300_light900 text-center text-lg font-semibold">
              There are no questions, yet.
            </h3>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 line-clamp-1 flex flex-col gap-[4px]">
          {tagResult.tags.map((item) => (
            <RenderTag
              key={item.id}
              id={item.id}
              title={item.name}
              count={item.questions.length}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
