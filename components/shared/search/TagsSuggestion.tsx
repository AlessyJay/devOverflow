"use client";

import { Button } from "@/components/ui/button";
import { getAllTags } from "@/lib/actions/tags.action";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const TagsSuggestion = () => {
  const searchParams = useSearchParams();
  const [value, setValue] = useState([]);

  const suggestTags = searchParams.get("suggestTags");

  useEffect(() => {
    const fetchResult = async () => {
      setValue([]);

      try {
        const res: any = await getAllTags({
          searchQuery: suggestTags || undefined,
        });

        console.log("Response from getAllTags:", res.tags);

        setValue(JSON.parse(res.tags));
      } catch (error) {
        console.log(error);
      }
    };

    if (suggestTags) {
      fetchResult();
    }
  }, [suggestTags]);

  return (
    <div className="text-dark300_light900 z-10 rounded-xl bg-light-800 px-3 py-2 shadow-sm dark:bg-dark-400">
      Tags:{" "}
      {value.length > 0
        ? value.map((tag: any, index: number) => (
            <Button
              type="button"
              key={tag}
              className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 dark:hover:text-primary-500`}
            ></Button>
          ))
        : ""}
    </div>
  );
};

export default TagsSuggestion;
