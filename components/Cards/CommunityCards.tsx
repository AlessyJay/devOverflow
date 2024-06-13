import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const CommunityCards = ({ user }: Props) => {
  // eslint-disable-next-line no-unused-vars
  const { _id, clerkId, picture, name, username } = user;

  return (
    <Link
      href={`/profile/${_id}`}
      className="shadow-light100_darknone w-full max-sm:min-w-full xs:w-[260px]"
    >
      <div className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={picture}
          alt={username}
          width={100}
          height={100}
          className="rounded-full"
        />

        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900">{name}</h3>
          <p className="text-light400_light500">@{username}</p>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCards;
