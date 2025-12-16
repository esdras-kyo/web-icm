import { NextResponse } from "next/server";

const YT = "https://www.googleapis.com/youtube/v3";
export const revalidate = 300;

type Item = { videoId: string; title: string };

export async function GET() {
  const channelId = process.env.YT_CHANNEL_ID!;
  const apiKey = process.env.YT_API_KEY!;
  const max = Number(process.env.YT_POPULAR_LIMIT ?? 3);

  if (!channelId || !apiKey) {
    return NextResponse.json(
      { error: "Faltam envs YT_CHANNEL_ID/YT_API_KEY" },
      { status: 500 }
    );
  }

  // 1) pega uma lista recente (API não ordena por viewCount em search)
  const listUrl = `${YT}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=20&key=${apiKey}`;
  const listRes = await fetch(listUrl, { next: { revalidate } });
  const listJson = await listRes.json();

  const ids: string[] =
    listJson?.items?.map((it: { id?: { videoId?: string } }) => it?.id?.videoId).filter(Boolean) ?? [];

  if (ids.length === 0) {
    return NextResponse.json({ items: [] as Item[] });
  }

  // 2) busca estatísticas e ordena por viewCount
  const statsUrl = `${YT}/videos?part=snippet,statistics&id=${ids.join(
    ","
  )}&key=${apiKey}`;
  const statsRes = await fetch(statsUrl, { next: { revalidate } });
  const statsJson = await statsRes.json();

  const items: (Item & { views: number })[] =
    statsJson?.items?.map((v: { id: string; snippet?: { title?: string }; statistics?: { viewCount?: string } }) => ({
      videoId: v.id,
      title: v.snippet?.title ?? "Vídeo",
      views: Number(v.statistics?.viewCount ?? 0),
    })) ?? [];

  items.sort((a, b) => b.views - a.views);

  return NextResponse.json({
    items: items.slice(0, Math.max(2, Math.min(max, 3))).map(({ views, ...rest }) => rest),
  });
}