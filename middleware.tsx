import { clerkMiddleware } from "@clerk/nextjs/server";

// const isProtectedRoutes = createRouteMatcher(["/(.*)"]);

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
