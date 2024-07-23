import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data!");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 },
    );
  }
};
