"use client";

import React, { useState, useEffect } from "react";
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
  otherClasses?: string;
  containerClasses?: string;
}

const JobFilter = ({ otherClasses, containerClasses }: Props) => {
  const search = useSearchParams();
  const router = useRouter();
  const paramFilter = search.get("location");
  const [filter, setFilter] = useState<any[]>([]);

  const handleFilter = (value: string) => {
    const newUrl = formUrlQuery({
      params: search.toString(),
      key: "location",
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  useEffect(() => {
    try {
      const getLocations = async () => {
        const res = await fetch("/api/locations");

        if (!res.ok) throw new Error("Something went wrong!");

        const data = await res.json();
        data.sort(
          (a: { name: { common: string } }, b: { name: { common: any } }) =>
            a.name.common.localeCompare(b.name.common),
        );
        setFilter(data);
      };
      getLocations();
    } catch (error) {
      console.log(error);
    }
  }, []);
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
            {filter.map((location) => (
              <SelectItem
                key={location.name.common}
                value={location.name.common}
                className="cursor-pointer"
              >
                {location.name.common}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default JobFilter;
