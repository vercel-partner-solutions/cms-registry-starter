import { schema } from "./../../../sanity/schemaTypes/index";
import { NextRequest, NextResponse } from "next/server";

/**
 * This route exposes the schema for .well-known/r/cms
 * This is in the same project as the registry for this example
 * In a real project you will need an API in your Studio project
 * to retrieve the schema.
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(schema);
}
