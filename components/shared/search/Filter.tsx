import React from "react";
import { Badge } from "@/components/ui/badge";

const Filter = () => {
  const filter = [
    {
      id: 1,
      title: "Newest",
    },
    {
      id: 2,
      title: "Recommended",
    },
    {
      id: 3,
      title: "Frequent",
    },
    {
      id: 4,
      title: "Unanswered",
    },
  ];
  return (
    <div className="mt-10 flex gap-3 max-md:hidden md:flex">
      {filter.map((item) => (
        <Badge
          key={item.id}
          className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase"
        >
          {item.title}
        </Badge>
      ))}
    </div>
  );
};

export default Filter;
