import { NextResponse } from "next/server";

// Revalidate server response every 10 minutes
export const revalidate = 600;

// Query terms biased to martial arts
const MARTIAL_Q = encodeURIComponent(
  '(martial arts OR mma OR ufc OR bjj OR "brazilian jiu-jitsu" OR judo OR karate OR "muay thai" OR kickboxing OR wrestling)'
);

type NewsItem = {
  id: string;
  title: string;
  url: string;
  image: string | null;
  excerpt: string;
  byline?: string;
  publishedAt?: string;
  source?: string;
};

function mapGuardianItem(r: any): NewsItem {
  return {
    id: r.id,
    title: r.webTitle,
    url: r.webUrl,
    image: r.fields?.thumbnail ?? null,
    excerpt: r.fields?.trailText ?? "",
    byline: r.fields?.byline,
    publishedAt: r.webPublicationDate,
    source: "The Guardian",
  };
}

export async function GET() {
  const key = process.env.GUARDIAN_API_KEY;

  // If key missing, return empty gracefully instead of 500
  if (!key) {
    console.error("GUARDIAN_API_KEY is missing");
    return NextResponse.json<NewsItem[]>([], { status: 200 });
  }

  // Guardian Content API: filter to sport section + our martial query
  const url =
    `https://content.guardianapis.com/search` +
    `?order-by=newest` +
    `&page-size=24` +
    `&section=sport` +
    `&q=${MARTIAL_Q}` +
    `&show-fields=thumbnail,trailText,byline` +
    `&api-key=${key}`;

  try {
    const res = await fetch(url, { next: { revalidate: 600 } });

    if (!res.ok) {
      const text = await res.text();
      console.error("Guardian API error:", res.status, text);
      return NextResponse.json<NewsItem[]>([], { status: 200 });
    }

    const json = await res.json();
    const items = (json?.response?.results ?? []).map(mapGuardianItem);
    return NextResponse.json<NewsItem[]>(items);
  } catch (err) {
    console.error("Guardian fetch failed:", err);
    return NextResponse.json<NewsItem[]>([], { status: 200 });
  }
}
