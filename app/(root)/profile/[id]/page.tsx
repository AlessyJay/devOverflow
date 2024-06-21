import { URLProps } from "@/Types";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import AnswerTabs from "@/components/shared/questions/AnswersTab";
import QuestionsTab from "@/components/shared/questions/QuestionsTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userProfile } from "@/lib/actions/users.action";
import { getJoinedDate } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();

  const userInfo = await userProfile({ userId: params.id });

  const { day, month, year } = getJoinedDate(userInfo.user.joinedAt.toString());

  // Ensure clerkId is a string or undefined
  const validClerkId = clerkId ?? undefined;
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between max-sm:items-center sm:flex-row">
        <div className="flex flex-col items-start gap-4 max-sm:items-center lg:flex-row">
          <Image
            src={userInfo?.user.picture}
            width={140}
            height={140}
            alt="profile photo"
            className="rounded-full object-cover"
          />

          {/* Edit Profile */}
          <div className="hidden max-sm:mb-5 max-sm:flex max-sm:w-full max-sm:justify-center sm:mt-3">
            <SignedIn>
              {clerkId === userInfo.user.clerkId && (
                <Link href="/profile/edit">
                  <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                    Edit Profile
                  </Button>
                </Link>
              )}
            </SignedIn>
          </div>

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo.user.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo.user.portfolioWebsite && (
                <div>
                  <ProfileLink
                    imgUrl="/assets/icons/link.svg"
                    href={userInfo.user.portfolioWebsite}
                    title="Portfolio"
                  />
                </div>
              )}

              {userInfo.user.location && (
                <div>
                  <ProfileLink
                    imgUrl="/assets/icons/location.svg"
                    title={userInfo.user.location}
                  />
                </div>
              )}

              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={`Joined ${day} ${month} ${year}`}
              />
            </div>

            {userInfo.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {userInfo.user.bio}
              </p>
            )}
          </div>
        </div>

        {/* Edit Profile */}
        <div className="flex justify-end max-sm:mb-5 max-sm:hidden max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === userInfo.user.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      {/* Stats */}
      <Stats
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
      />

      {/* Tabs */}
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            {/* todo: Posts component */}
            <QuestionsTab
              searchParams={searchParams}
              userId={userInfo.user._id}
              clerkId={validClerkId}
            />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            {/* todo: Answers component */}
            <AnswerTabs
              searchParams={searchParams}
              userId={userInfo.user._id}
              clerkId={validClerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
