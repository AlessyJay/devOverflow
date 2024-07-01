import React from "react";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import { BadgeCounts } from "@/Types";

interface CardProps {
  imgUrl: string;
  value: number;
  title: string;
}

const StatsCard = ({ imgUrl, value, title }: CardProps) => {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
      <Image src={imgUrl} alt={title} width={40} height={40} />
      <div>
        <p className="paragraph-semibold text-dark200_light900">
          {formatNumber(value)}
        </p>
        <p className="body-medium text-dark400_light700">
          {value > 1 ? title + "s" : title}
        </p>
      </div>
    </div>
  );
};

interface StatsProps {
  totalQuestions: number;
  totalAnswers: number;
  badges: BadgeCounts;
  reputation: number;
}

const Stats = ({
  totalQuestions,
  totalAnswers,
  badges,
  reputation,
}: StatsProps) => {
  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900 max-sm:text-center">
        Stats - {reputation}
      </h4>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">
              {totalQuestions > 1 ? "Questions" : "Question"}
            </p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">
              {totalAnswers > 1 ? "Answers" : "Answer"}
            </p>
          </div>
        </div>

        <StatsCard
          imgUrl="/assets/icons/gold-medal.svg"
          value={badges.GOLD}
          title="Gold Badge"
        />
        <StatsCard
          imgUrl="/assets/icons/silver-medal.svg"
          value={badges.SILVER}
          title="Silver Badge"
        />
        <StatsCard
          imgUrl="/assets/icons/bronze-medal.svg"
          value={badges.BRONZE}
          title="Bronze Badge"
        />
      </div>
    </div>
  );
};

export default Stats;
