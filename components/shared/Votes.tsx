"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/questions.action";
import { usePathname } from "next/navigation";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answers.action";
import { saveQuestion } from "@/lib/actions/users.action";
import { useRouter } from "next/router";
import { viewQuestions } from "@/lib/actions/interaction.action";
import { useToast } from "../ui/use-toast";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownVoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter;
  const { toast, dismiss } = useToast();

  const handleSaved = async () => {
    if (!userId) {
      return;
    }

    saveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    });

    const savedToast: any = toast({
      title: `Question ${!hasSaved ? "saved in" : "removed from"} your collection.`,
      variant: !hasSaved ? "default" : "destructive",
    });

    setTimeout(() => dismiss(savedToast), 1500);
  };

  const handleVoted = async (action: string) => {
    if (!userId) {
      return toast({
        title: "Oops!",
        description: "You have to login before performing this action. ✌",
      });
    }

    if (!userId) {
      return;
    }

    if (action === "upvote") {
      if (type === "Question") {
        console.log(type);
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        });
      }
      if (type === "Answer") {
        console.log(type);
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        });
      }

      // todo: show a toast
      const upvoteToast: any = toast({
        title: `Upvote ${!hasUpvoted ? "Successful" : "Removed"}`,
        variant: !hasUpvoted ? "default" : "destructive",
      });

      setTimeout(() => dismiss(upvoteToast), 1500);
    }

    if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        });
      }
      if (type === "Answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpvoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        });
      }

      const downvoteToast: any = toast({
        title: `Downvote ${!hasDownVoted ? "Added" : "Removed"}`,
        variant: !hasDownVoted ? "default" : "destructive",
      });

      setTimeout(() => dismiss(downvoteToast), 1500);
    }
  };

  useEffect(() => {
    viewQuestions({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname, router]);
  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpvoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVoted("upvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(upvotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVoted("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>

      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={() => handleSaved()}
        />
      )}
    </div>
  );
};

export default Votes;
