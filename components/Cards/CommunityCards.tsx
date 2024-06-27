import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { getTopInteractedTags } from "@/lib/actions/tags.action";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const CommunityCards = async ({ user }: Props) => {
  // eslint-disable-next-line no-unused-vars
  const { _id, clerkId, picture, name, username } = user;

  const interactedTags = await getTopInteractedTags({ userId: _id });

  return (
    <Link
      href={`/profile/${clerkId}`}
      className="shadow-light100_darknone w-full max-sm:min-w-full xs:w-[260px]"
    >
      <span className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={picture}
          alt={username}
          width={100}
          height={100}
          className="size-[140px] rounded-full object-contain"
        />

        <span className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">{name}</h3>
          <p className="text-light400_light500">@{username.toLowerCase()}</p>
        </span>

        <span className="mt-5">
          {interactedTags.length > 0 ? (
            <span className="flex items-center gap-2">
              {interactedTags?.map((tag) => (
                <>
                  <span key={tag.id} id={tag.id}>
                    <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
                      {tag.title}
                    </Badge>
                  </span>
                </>
              ))}
            </span>
          ) : (
            <Badge>No tags, yet.</Badge>
          )}
        </span>
      </span>
    </Link>
  );
};

export default CommunityCards;
