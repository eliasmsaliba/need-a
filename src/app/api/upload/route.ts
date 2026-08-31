import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DOCUMENT_TYPES = [...IMAGE_TYPES, "application/pdf"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

interface UploadPayload {
  userId: string;
  kind: "avatar" | "id-document" | "certification" | "portfolio";
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        if (!clientPayload) throw new Error("Missing upload payload.");
        const payload = JSON.parse(clientPayload) as UploadPayload;

        // Signup happens before a session exists, so — same trust level as the
        // existing signup actions (completeCustomerProfile, saveProviderStep) —
        // this just confirms the userId corresponds to a real account.
        const [user] = await db.select().from(users).where(eq(users.id, payload.userId));
        if (!user) throw new Error("Unknown account.");

        return {
          allowedContentTypes: payload.kind === "avatar" || payload.kind === "portfolio" ? IMAGE_TYPES : DOCUMENT_TYPES,
          maximumSizeInBytes: MAX_SIZE_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // No server-side bookkeeping needed here — the client stores the
        // returned URL into its own wizard state and persists it explicitly
        // via completeCustomerProfile/saveProviderStep.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
