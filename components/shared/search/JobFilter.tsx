"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
import { MapPinned } from "lucide-react";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

const JobFilter = ({ filters, otherClasses, containerClasses }: Props) => {
  const search = useSearchParams();
  const router = useRouter();
  const paramFilter = search.get("filter");

  const handleFilter = (value: string) => {
    const newUrl = formUrlQuery({
      params: "",
      key: "filter",
      value,
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleFilter}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 cursor-pointer border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex flex-1 items-center gap-3 text-left">
            <MapPinned className="size-5" />
            <SelectValue placeholder="Locations" />
          </div>
        </SelectTrigger>
        <SelectContent className="background-light800_dark300 text-dark500_light700">
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="cursor-pointer"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default JobFilter;
