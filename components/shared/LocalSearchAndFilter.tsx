import React from "react";
import LocalSearchBar from "./search/LocalSearchBar";
import Filter from "../shared/search/Filter";

interface Props {
  h1: string;
  route: string;
  placeholder: string;
  filter: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const LocalSearchAndFilter = ({
  h1,
  route,
  placeholder,
  filter,
  otherClasses,
  containerClasses,
}: Props) => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">{h1}</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route={route}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder={placeholder}
          otherClasses="flex-1"
        />

        <Filter
          filters={filter}
          otherClasses={`min-h-[56px] sm:min-w-[170px] ${otherClasses}`}
          containerClasses={containerClasses}
        />
      </div>
    </div>
  );
};

export default LocalSearchAndFilter;
