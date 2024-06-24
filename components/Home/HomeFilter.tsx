"use client";

import { HomePageFilters } from "@/Constant/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

const HomeFilters = () => {
  const [isActive, setIsActive] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => {
        const handleActive = (item: string) => {
          if (isActive === item) {
            setIsActive("");
            const newUrl = formUrlQuery({
              params: searchParams.toString(),
              key: "filter",
              value: null,
            });

            router.push(newUrl, { scroll: false });
          } else {
            setIsActive(item);
            const newUrl = formUrlQuery({
              params: searchParams.toString(),
              key: "filter",
              value: item.toLowerCase(),
            });

            router.push(newUrl, {});
          }
        };

        return (
          <Button
            key={item.value}
            onClick={() => handleActive(item.value)}
            value={item.value}
            className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${isActive === item.value ? "bg-primary-100 text-primary-500" : "bg-light-800 text-light-500 dark:bg-dark-300 dark:hover:bg-dark-300"}`}
          >
            {item.name}
          </Button>
        );
      })}
    </div>
  );
};

export default HomeFilters;
