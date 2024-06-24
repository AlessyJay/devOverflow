import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Signin() {
  return (
    <>
      <Image
        src="/assets/images/auth-light.png"
        alt="Logo"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="absolute inset-0 size-full brightness-50"
      />
      <SignIn path="/sign-in" />;
    </>
  );
}
