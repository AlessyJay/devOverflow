import { Button } from "@/components/ui/button";
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { useSearchParams } from "next/navigation";
// eslint-disable-next-line no-unused-vars
import { formUrlQuery } from "@/lib/utils";

const TagsSuggestion = () => {
  //   const searchParams = useSearchParams();
  //   const search = searchParams.get("suggestTag") || "";
  //   const [inputValue, setInputValue] = useState<string>("");

  //   useEffect(() => {
  //     const debouncing = setTimeout(async() => {
  //         if(inputValue){
  //             const newUrl = formUrlQuery({
  //                 params: searchParams.toString(),
  //                 key: 'suggestTag',
  //                 value: null,
  //             })
  //         }
  //     })
  //   }, [inputValue, setInputValue, search, searchParams]);

  return (
    <div className="text-dark300_light900 z-10 rounded-xl bg-light-800 px-3 py-2 shadow-sm dark:bg-dark-400">
      Tags:{" "}
      <Button
        type="button"
        className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 dark:hover:text-primary-500`}
      >
        Tag
      </Button>
    </div>
  );
};

export default TagsSuggestion;
