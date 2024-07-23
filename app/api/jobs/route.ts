import { replaceSpacesWithPercent20 } from "@/lib/utils";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "Fullstack developer";
  const location = searchParams.get("location");
  try {
    const res = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${replaceSpacesWithPercent20(query)}&page=1&num_pages=10&date_posted=all${location ? `&location=${replaceSpacesWithPercent20(location)}` : ""}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.API_KEY || "",
          "x-rapidapi-host": process.env.API_HOST || "",
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      throw new Error("There is something not right here, try again later.");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch jobs data" },
      { status: 500 },
    );
  }
};
