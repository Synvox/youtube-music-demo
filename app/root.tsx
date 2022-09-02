import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Styles } from "infused";
import { Main } from "./components/Main";
import { cachedFetch } from "./fetchCached.server";
import { YOUTUBE_KEY } from "./helpers/env.server";
import { qs } from "./helpers/qs";
import { Song } from "./types";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams;

  if (!query.has("id")) return json({ song: null });

  const { items }: { items: any[]; nextPageToken: string | null } =
    await cachedFetch(
      `https://www.googleapis.com/youtube/v3/videos?${qs({
        id: query.get("id"),
        part: "snippet",
        key: YOUTUBE_KEY,
      })}`
    ).then((x) => {
      if (x.ok) return x.json();
      else throw json("Failed to search", { status: 500 });
    });

  return json({
    song: items.slice(0, 1).map((x: any) => ({
      id: x.id as string,
      name: x.snippet.title as string,
      artistName: x.snippet.channelTitle as string,
      img: x.snippet.thumbnails.high.url as string,
      imgWidth: x.snippet.thumbnails.high.width as number,
      imgHeight: x.snippet.thumbnails.high.height as number,
    }))[0] as Song,
  });
}

export default function App() {
  const { song } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <Styles />
      </head>
      <body>
        <Main song={song}>
          <Outlet />
        </Main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
