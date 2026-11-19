import { NextResponse } from "next/server";
import { CV_EXTENSIONS, MAX_CV_BYTES, safeCvFileName } from "@/types/career";

export const runtime = "nodejs";

/**
 * Step 1 of a CV upload: checks the file name and size, then tells the browser
 * where to send the file.
 *
 * On the live site the browser uploads the CV straight to file storage. In
 * this copy it is sent back to this same route (see PUT below), which accepts
 * it and throws it away, so the form behaves the same without any storage.
 */
export async function POST(request: Request) {
  try {
    const { fileName, size } = await request.json();

    if (typeof fileName !== "string" || !fileName.trim()) {
      return NextResponse.json({ error: "Missing file name." }, { status: 400 });
    }

    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    if (!CV_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { error: `CV must be one of: ${CV_EXTENSIONS.join(", ")}.` },
        { status: 400 }
      );
    }

    if (typeof size === "number" && size > MAX_CV_BYTES) {
      return NextResponse.json(
        {
          error: `Your CV is larger than ${Math.round(
            MAX_CV_BYTES / (1024 * 1024)
          )} MB. Please upload a smaller file.`,
        },
        { status: 400 }
      );
    }

    const path = `${crypto.randomUUID()}/cv-${safeCvFileName(fileName)}`;

    return NextResponse.json({ uploadUrl: "/api/career/upload-url", path });
  } catch (error) {
    console.error("Error creating upload URL:", error);
    return NextResponse.json(
      { error: "Could not prepare the upload. Please try again." },
      { status: 500 }
    );
  }
}

/** Step 2: receives the CV file and discards it. */
export async function PUT(request: Request) {
  const file = await request.arrayBuffer();
  console.log(
    `[careers] CV received (${Math.round(file.byteLength / 1024)} KB), not stored in this copy.`
  );
  return new NextResponse(null, { status: 200 });
}
