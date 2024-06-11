import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";

const RightSideBar = () => {
  const data = [
    {
      id: "1",
      title:
        "Would it be appropriate to point out an error in another paper during a referee report?",
    },
    {
      id: "2",
      title: "How can an airconditioning machine exist?",
    },
    {
      id: "3",
      title: "Interrogated every time crossing UK Border as citizen",
    },
    {
      id: "4",
      title: "Interrogated every time crossing UK Border as citizen",
    },
    {
      id: "5",
      title: "Low digit addition generator",
    },
    {
      id: "6",
      title: "What is an example of 3 numbers that do not make up a vector?",
    },
  ];

  const tags = [
    {
      id: "1",
      title: "Next.JS",
      count: 3590,
    },
    {
      id: "2",
      title: "React.js",
      count: 1422,
    },
    {
      id: "3",
      title: "CSS",
      count: 855,
    },
    {
      id: "4",
      title: "C#",
      count: 674,
    },
    {
      id: "5",
      title: "ASP.NET Core 8",
      count: 649,
    },
  ];
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div className="flex flex-1 flex-col gap-6">
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {data.map((item) => (
            <Link
              href={`/questions/`}
              key={item.id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{item.title}</p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-[4px]">
          {tags.map((item) => (
            <RenderTag
              key={item.id}
              id={item.id}
              title={item.title}
              count={item.count}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
