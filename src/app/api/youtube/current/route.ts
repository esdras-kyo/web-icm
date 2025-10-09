// app/api/youtube/current/route.ts
import { NextResponse } from "next/server";

const YT = "https://www.googleapis.com/youtube/v3";

export const revalidate = 300; // cache 5 min (ajuste se quiser)

export async function GET() {
  const channelId = process.env.YT_CHANNEL_ID!;
  const apiKey = process.env.YT_API_KEY!;
  if (!channelId || !apiKey) {
    return NextResponse.json({ error: "Faltam envs YT_CHANNEL_ID/YT_API_KEY" }, { status: 500 });
  }

  // 1) checa LIVE
  const liveUrl = `${YT}/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`;
  const liveRes = await fetch(liveUrl, { next: { revalidate } });
  const liveJson = await liveRes.json();

  if (liveJson?.items?.length > 0) {
    const live = liveJson.items[0];
    return NextResponse.json({
      videoId: live.id.videoId,
      isLive: true,
      title: live.snippet?.title ?? "Transmissão ao vivo",
    });
  }

  // 2) fallback: último vídeo publicado
  const recentUrl = `${YT}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=1&key=${apiKey}`;
  const recentRes = await fetch(recentUrl, { next: { revalidate } });
  const recentJson = await recentRes.json();
  const item = recentJson?.items?.[0];

  if (!item) {
    return NextResponse.json({ error: "Nenhum vídeo encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    videoId: item.id.videoId,
    isLive: false,
    title: item.snippet?.title ?? "Último vídeo",
  });
}