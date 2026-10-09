import { NextResponse } from "next/server";
import { db } from "@/db";
import { emails } from "@/db/schema";
import { eq, sql, and, or, desc, asc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "INBOX";
    const q = searchParams.get("q") || "";
    const unread = searchParams.get("unread");
    const starred = searchParams.get("starred");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    // Folder filter
    whereConditions.push(sql`folder = ${folder}`);

    // Search filter
    if (q) {
      whereConditions.push(
        or(
          sql`sender ILIKE ${`%${q}%`}`,
          sql`recipient ILIKE ${`%${q}%`}`,
          sql`subject ILIKE ${`%${q}%`}`,
          sql`bodyText ILIKE ${`%${q}%`}`
        )
      );
    }

    // Unread filter
    if (unread === "true") {
      whereConditions.push(sql`is_read = false`);
    } else if (unread === "false") {
      whereConditions.push(sql`is_read = true`);
    }

    // Starred filter
    if (starred === "true") {
      whereConditions.push(sql`is_starred = true`);
    } else if (starred === "false") {
      whereConditions.push(sql`is_starred = false`);
    }

    whereConditions.push(sql`direction = 'INBOUND'`);

    const whereClause = and(...whereConditions);

    // Count total for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(emails)
      .where(whereClause);

    // Fetch emails with pagination
    const data = await db
      .select({
        id: emails.id,
        messageId: emails.messageId,
        sender: emails.sender,
        recipient: emails.recipient,
        subject: emails.subject,
        bodyText: emails.bodyText,
        bodyHtml: emails.bodyHtml,
        attachments: emails.attachments,
        direction: emails.direction,
        folder: emails.folder,
        isRead: emails.isRead,
        isStarred: emails.isStarred,
        createdAt: emails.createdAt,
        inReplyTo: emails.inReplyTo,
        references: emails.references,
        updatedAt: emails.updatedAt,
      })
      .from(emails)
      .where(whereClause)
      .orderBy(desc(emails.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      data,
      page,
      pages: Math.ceil(Number(count) / limit),
      total: Number(count),
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { id, ...updates } = body;

    if (id) {
      const [updated] = await db
        .update(emails)
        .set({
          ...updates,
          updatedAt: sql`now()`,
        })
        .where(eq(emails.id, id))
        .returning();

      return NextResponse.json(updated);
    } else {
      const [newEmail] = await db
        .insert(emails)
        .values({
          folder: "INBOX",
          isRead: false,
          isStarred: false,
          ...updates,
        })
        .returning();

      return NextResponse.json(newEmail);
    }
  } catch (error) {
    console.error("Error in email POST:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}