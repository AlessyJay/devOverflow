import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";

const QuestionCards = ({
  id,
  title,
  author,
  createdAt,
  views,
  upvote,
  tags,
  answers,
}: {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    picture: string;
  };
  createdAt: Date;
  views: number;
  upvote: number;
  tags: {
    id: string;
    title: string;
  }[];
  answers: Array<object>;
}) => {
  return (
    <div className="card-wrapper mb-10 rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col items-start gap-5 sm:flex-row">
        <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
          {getTimeStamp(createdAt)}
        </span>
        <Link href={`/question/${id}`}>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {title}
          </h3>
        </Link>
      </div>

      {/* If sign in, add edit, delete action */}

      <div className="mt-3.5 flex flex-wrap gap-2 text-black">
        {tags.map((tag) => (
          <RenderTag key={tag.id} id={tag.id} title={tag.title} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author.id}`}
          isAuthor
          textStyle="body-meduim text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/upvote.svg"
          alt="upvotes"
          value={formatNumber(upvote)}
          title="Votes"
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
    </div>
  );
};

export default QuestionCards;
