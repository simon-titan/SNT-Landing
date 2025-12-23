import { NextRequest, NextResponse } from "next/server";

const ADMIN_USERNAME = process.env.AFFILIATE_ADMIN_USERNAME ?? process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.AFFILIATE_ADMIN_PASSWORD ?? process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_PASSWORD;

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function requireAdminCredentials(request: NextRequest) {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Affiliate admin credentials are not configured." },
      { status: 500 }
    );
  }

  const username = request.headers.get("x-admin-username");
  const password = request.headers.get("x-admin-password");
  if (!username || !password) {
    return unauthorizedResponse();
  }

  if (
    username !== ADMIN_USERNAME ||
    password !== ADMIN_PASSWORD
  ) {
    return unauthorizedResponse();
  }

  return null;
}

