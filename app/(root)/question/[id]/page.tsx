import Answer from "@/components/Forms/Answer";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import { getQuestionById } from "@/lib/actions/questions.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) => {
  const result = await getQuestionById({ questionId: params.id });
  // eslint-disable-next-line no-unused-vars
  const { title, content, tags, views, author, answers, createdAt } = result;
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${author.id}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={author.picture}
              alt={author.name}
              width={34}
              height={34}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {author.name}
            </p>
          </Link>

          <div className="flex justify-end">For Voting</div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={`${getTimeStamp(createdAt)}`}
          title=""
          textStyle="small-meduim text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={answers.length}
          title="Answers"
          textStyle="small-meduim text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="views"
          value={formatNumber(views)}
          title="Views"
          textStyle="small-meduim text-dark400_light800"
        />
      </div>

      <ParseHTML data={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: any) => (
          <RenderTag
            key={tag.id}
            id={tag.id}
            title={tag.name}
            showCount={false}
          />
        ))}
      </div>

      {/* TODO: Answer form */}
      <Answer />
    </>
  );
};

export default page;
