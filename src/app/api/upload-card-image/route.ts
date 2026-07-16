import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please select an image to upload." },
        { status: 400 }
      );
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload a JPG, PNG, or WEBP image.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "The image must be smaller than 10 MB." },
        { status: 400 }
      );
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";

    const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;

    const storagePath = `cards/${uniqueFileName}`;

    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from("card-images")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase image upload error:", uploadError);

      return NextResponse.json(
        { error: "The image could not be uploaded." },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("card-images")
      .getPublicUrl(storagePath);

    return NextResponse.json({
      message: "Image uploaded successfully.",
      imageUrl: publicUrlData.publicUrl,
      storagePath,
    });
  } catch (error) {
    console.error("Unexpected image upload error:", error);

    return NextResponse.json(
      { error: "Something went wrong while uploading the image." },
      { status: 500 }
    );
  }
}