import { NextResponse } from "next/server";

import { queryProducts } from "@/lib/products";
import type { SearchParams } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: SearchParams = {
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    rating: searchParams.get("rating") ?? undefined,
    page: searchParams.get("page") ?? undefined
  };

  const result = await queryProducts(params);
  return NextResponse.json(result);
}
