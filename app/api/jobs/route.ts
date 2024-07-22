import { API_HOST, API_KEY } from "@/Types/SecretKey";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const res = await fetch(
      "https://jsearch.p.rapidapi.com/search?query=developers&page=1&num_pages=1&date_posted=all",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": API_KEY || "",
          "x-rapidapi-host": API_HOST || "",
        },
      },
    );

    if (!res.ok) {
      throw new Error("There is something not right here, try again later.");
    }

    const data = res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
  }
};
