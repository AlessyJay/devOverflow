import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex w-full justify-center">
      <div className="flex h-screen w-[520px] flex-col items-center justify-center">
        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          height={200}
          width={200}
        />

        <div className="my-10 flex flex-col text-center">
          <h2 className="text-5xl font-bold">Oops, something went wrong!</h2>
          <p className="mt-5">
            Sorry, we couldn&apos;t find the page you were looking for.
          </p>
        </div>
        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default page;
