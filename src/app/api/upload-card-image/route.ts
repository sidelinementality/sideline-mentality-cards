import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function createSafeFileName(originalName: string) {
  const extension = originalName.split(".").pop()?.toLowerCase() || "jpg";
  const uniqueName = crypto.randomUUID();

  return `${uniqueName}.${extension}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file was provided." },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "The selected file must be an image." },
        { status: 400 },
      );
    }

    const maximumFileSize = 10 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      return NextResponse.json(
        { error: "The image must be smaller than 10 MB." },
        { status: 400 },
      );
    }

    const fileName = createSafeFileName(file.name);
    const filePath = `cards/${fileName}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from("card-images")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Image upload error:", uploadError);

      return NextResponse.json(
        { error: "The image could not be uploaded." },
        { status: 500 },
      );
    }

    const { data } = supabaseAdmin.storage
      .from("card-images")
      .getPublicUrl(filePath);

    return NextResponse.json({
      imageUrl: data.publicUrl,
      filePath,
    });
  } catch (error) {
    console.error("Unexpected image upload error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while uploading the image." },
      { status: 500 },
    );
  }
}