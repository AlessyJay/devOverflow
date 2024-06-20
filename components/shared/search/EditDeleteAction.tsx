"use client";

import { deleteAnswer } from "@/lib/actions/answers.action";
import { deleteQuestion } from "@/lib/actions/questions.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const EditDeleteAction = ({
  type,
  itemId,
}: {
  type: string;
  itemId: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };

  const handleDelete = async () => {
    if (type === "Question") {
      // delete the question
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname });
    } else {
      // delete the answer
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname });
    }
  };
  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="Edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <Image
        src="/assets/icons/trash.svg"
        alt="delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
