"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { CircleX } from "lucide-react";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const search = searchParams.get("global") || "";
  // eslint-disable-next-line no-unused-vars
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(search || "");

  useEffect(() => {
    const delayDebouncing = setTimeout(async () => {
      if (inputValue) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: inputValue,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (search) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToremove: ["global", "type"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebouncing);
  }, [search, router, pathname, searchParams, inputValue]);

  const clearInput = () => {
    setInputValue("");
    setIsOpen(false);

    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToremove: ["global", "type"],
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden">
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />

        <Input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) {
              setIsOpen(false);
            }
          }}
          placeholder="Search Globally"
          className="paragraph-regular no-focus placeholder background-light800_darkgradient text-dark400_light700 border-none shadow-none outline-none"
        />

        {inputValue && (
          <CircleX
            className="text-dark300_light900 cursor-pointer"
            onClick={clearInput}
          />
        )}

        {isOpen && <GlobalResult />}
      </div>
    </div>
  );
};

export default GlobalSearch;
