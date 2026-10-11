import { NextResponse } from "next/server";
import { createUploadTarget } from "@/lib/r2";

const MAX_SIZE = 25 * 1024 * 1024; // 25 MB por archivo

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filename = typeof body.filename === "string" ? body.filename : "";
    const contentType =
      typeof body.contentType === "string" ? body.contentType : undefined;
    const size = Number(body.size) || 0;

    if (!filename) {
      return NextResponse.json(
        { error: "Falta el nombre del archivo" },
        { status: 400 }
      );
    }

    if (size > MAX_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera el límite de 25 MB" },
        { status: 413 }
      );
    }

    const target = await createUploadTarget({ filename, contentType });
    return NextResponse.json(target);
  } catch (error) {
    console.error("Error creando URL de subida:", error);
    return NextResponse.json(
      { error: "No se pudo preparar la subida del archivo" },
      { status: 500 }
    );
  }
}
