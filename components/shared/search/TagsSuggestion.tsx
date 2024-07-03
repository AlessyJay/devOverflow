"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSuggestTags } from "@/lib/actions/tags.action";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface TagsSuggestionProps {
  onTagClick: (tag: any) => void;
}

const TagsSuggestion = ({ onTagClick }: TagsSuggestionProps) => {
  const searchParams = useSearchParams();
  const [value, setValue] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const suggestTags = searchParams.get("suggestTags");

  useEffect(() => {
    const fetchResult = async () => {
      setValue([]);
      setIsLoading(true);

      try {
        const res: any = await getSuggestTags({
          searchQuery: suggestTags || undefined,
        });

        setValue(res);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (suggestTags) {
      fetchResult();
    }
  }, [suggestTags]);

  return (
    <div className="text-dark200_light800 z-10 flex items-center rounded-xl bg-light-800 px-5 py-2 shadow-sm dark:bg-dark-400 max-sm:flex-wrap">
      Tags:{" "}
      {isLoading && (
        <>
          {[1, 2, 3, 4, 5].map((item) => (
            <Skeleton
              key={item}
              className="light-border-2 small-medium ml-2 flex rounded-2xl px-5 py-2"
            />
          ))}
        </>
      )}
      {value.length > 0 ? (
        value.map((tag: any) => {
          return (
            <Button
              type="button"
              key={tag._id}
              className={`light-border-2 small-medium ml-5 rounded-2xl bg-orange-400 px-5 py-2 capitalize text-white`}
              onClick={() => onTagClick(tag)}
            >
              {tag.name}
            </Button>
          );
        })
      ) : isLoading ? (
        ""
      ) : (
        <p className="text-dark300_light900 ml-5">
          There is no such a tag. You can create that new one! ✌
        </p>
      )}
    </div>
  );
};

export default TagsSuggestion;
