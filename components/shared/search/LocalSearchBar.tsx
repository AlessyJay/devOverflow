"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CircleX } from "lucide-react";

interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses: string;
}

const LocalSearchBar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const search = searchParams.get("search") || "";
  // eslint-disable-next-line no-unused-vars
  const [inputValue, setInputValue] = useState<string>(search || "");

  useEffect(() => {
    const delayDebouncing = setTimeout(async () => {
      if (inputValue) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "search",
          value: inputValue,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToremove: ["search"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebouncing);
  }, [search, route, pathname, searchParams, inputValue, router]);

  const clearInput = () => {
    setInputValue("");
  };

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}

      <Input
        className="paragraph-regular no-focus placeholder background-light800_darkgradient text-dark200_light900 border-none shadow-none outline-none"
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      {inputValue && (
        <CircleX
          className="text-dark300_light900 cursor-pointer"
          onClick={clearInput}
        />
      )}

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchBar;
