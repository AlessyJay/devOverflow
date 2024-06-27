"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditProfileSchema } from "@/lib/validation";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/users.action";

interface Props {
  clerkId: string;
  user: string;
}

const Profile = ({ clerkId, user }: Props) => {
  const parsedUser = JSON.parse(user);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const formSchema = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      portfolioWebsite: parsedUser.portfolioWebsite || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof EditProfileSchema>) => {
    setIsSubmitting(true);

    console.log(values);

    try {
      // todo: update user
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio,
        },
        path: pathname,
      });

      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form {...formSchema}>
        <form
          onSubmit={formSchema.handleSubmit(onSubmit)}
          className="text-dark300_light900 mt-9 flex w-full flex-col gap-9"
        >
          <FormField
            control={formSchema.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>
                  Name <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formSchema.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>
                  Username <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formSchema.control}
            name="portfolioWebsite"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>Portfolio Link</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Portfolio link"
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formSchema.control}
            name="location"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Where are you from?"
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formSchema.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What's special about you?"
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-7 flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
