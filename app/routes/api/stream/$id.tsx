import { LoaderArgs, Response } from "@remix-run/node";
import ytdl from "ytdl-core";

export async function loader({ params }: LoaderArgs) {
  const ytdlStream = ytdl(`http://www.youtube.com/watch?v=${params.id}`, {
    filter: "audioonly",
  });

  return new Response(ytdlStream, {
    status: 200,
    headers: {
      "Content-Type": "video/webm",
      "Cache-Control": "public, max-age=604800, immutable", // 1 week
    },
  });
}
