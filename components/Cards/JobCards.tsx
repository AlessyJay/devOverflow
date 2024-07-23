"use client";

import { getTimeStamp, replaceSpacesWithPercent20 } from "@/lib/utils";
// import { API_HOST, API_KEY } from "@/Types/SecretKey";
import { BriefcaseBusiness, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const JobCards = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Fullstack developer";
  const location = searchParams.get("location");

  useEffect(() => {
    const getJobs = async () => {
      setIsLoading(true);

      try {
        const res = await fetch(
          `/api/jobs?q=${replaceSpacesWithPercent20(query)}&location=${location}`,
        );

        if (!res.ok) {
          throw new Error("Network response was not OK.");
        }
        const data = await res.json();
        setJobs(data.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getJobs();
  }, [location, query]);

  return (
    <div>
      {jobs?.map((job) => (
        <div
          key={job.job_id}
          className="card-wrapper mb-10 rounded-[10px] p-9 sm:px-11"
        >
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row">
            <span className="text-dark300_light900 subtle-regular text-dark400_light700 line-clamp-1 flex">
              {job.employer_name}
            </span>
            <span className="subtle-regular text-dark400_light700 line-clamp-1 flex">
              {getTimeStamp(job.job_posted_at_datetime_utc)}
            </span>
          </div>
          <div className="my-10 flex w-full flex-col gap-6">
            <div className="flex gap-10">
              <Image
                src={
                  job.employer_logo
                    ? job.employer_logo
                    : "/assets/images/site-logo.svg"
                }
                alt="Company logo"
                width={70}
                height={70}
                className="size-20 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <Link href={job.job_apply_link} target="_blank">
                  <h1 className="text-dark300_light900 text-2xl font-semibold">
                    {job.job_title}
                  </h1>
                  <p className="text-dark300_light900 line-clamp-4">
                    {job.job_description}
                  </p>
                </Link>
                <div className="text-dark300_light900 mt-5 flex items-center justify-between">
                  <div className="flex gap-10">
                    <div className="flex gap-2">
                      <BriefcaseBusiness className="size-5" />
                      <p className="text-dark300_light900">
                        {job.job_employment_type}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Globe className="size-5" />
                      <p className="text-dark300_light900">
                        {job.job_is_remote === true
                          ? "Remote friendly"
                          : "Onsite"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <MapPin className="size-5" />
                      <p className="text-dark300_light900">
                        {job.job_is_remote === true
                          ? "Remote friendly"
                          : "Onsite"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobCards;
