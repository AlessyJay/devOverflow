import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { getTopInteractedTags } from "@/lib/actions/tags.action";
import RenderTag from "../shared/RenderTag";

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
      href={`/profile/${_id}`}
      className="shadow-light100_darknone w-full max-sm:min-w-full xs:w-[260px]"
    >
      <span className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={picture}
          alt={username}
          width={100}
          height={100}
          className="rounded-full"
        />

        <span className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900">{name}</h3>
          <p className="text-light400_light500">@{username}</p>
        </span>

        <span className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags?.map((tag) => (
                <RenderTag key={tag.id} id={tag.id} title={tag.title} />
              ))}
            </div>
          ) : (
            <Badge>No tags, yet.</Badge>
          )}
        </span>
      </span>
    </Link>
  );
};

export default CommunityCards;
