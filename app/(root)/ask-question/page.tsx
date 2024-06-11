import Question from "@/components/Forms/Question";
import { getUserById } from "@/lib/actions/users.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  // const { userId } = auth();
  const userId = "cc9e30a0-3b5e-4b6e-8301-fd3330f12c29";

  console.log(typeof userId);

  if (!userId) {
    redirect("/sign-in");
  }

  const mongoUser = await getUserById({ userId });

  console.log(mongoUser);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser.id)} />
      </div>
    </div>
  );
};

export default page;
