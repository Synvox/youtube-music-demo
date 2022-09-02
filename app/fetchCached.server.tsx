import packageDirectory from "pkg-dir";
import mkdir from "make-dir";
import { promises as fs } from "fs";

interface SerializedResponse {
  headers: string[][];
  status: number;
  statusText: string;
  body: string;
}

let getCachePath = async () => {
  const dirPath = `${await packageDirectory()}/node_modules/.cache/youtube-demo-cache`;
  const filePath = `${dirPath}/cache.json`;

  try {
    await mkdir(dirPath);
    await fs.writeFile(filePath, "{}", { flag: "wx" });
  } catch (_) {
    // file exists
  }

  getCachePath = async () => filePath;
  return filePath;
};

async function get(url: string): Promise<Response | undefined> {
  const cache: Record<string, SerializedResponse> = JSON.parse(
    await fs.readFile(await getCachePath(), "utf-8")
  );

  const r = cache[url];
  if (!r) return r;

  const response = new Response(r.body, {
    headers: r.headers,
    status: r.status,
    statusText: r.statusText,
  });

  return response;
}

async function set(url: string, resp: Response) {
  const cache: Record<string, SerializedResponse> = JSON.parse(
    await fs.readFile(await getCachePath(), "utf-8")
  );

  const r: SerializedResponse = {
    headers: [...resp.headers.entries()],
    status: resp.status,
    statusText: resp.statusText,
    body: await resp.text(),
  };

  cache[url] = r;

  await fs.writeFile(await getCachePath(), JSON.stringify(cache), "utf-8");

  return resp;
}

export async function cachedFetch(
  input: RequestInfo | URL,
  options: RequestInit = {}
) {
  const url = input.toString();
  if (options.method && options.method !== "GET") return fetch(url, options);

  const fromCache = await get(url);
  if (fromCache) {
    return fromCache;
  }

  const response = await fetch(input, options);
  if (response.ok) set(url, response.clone());

  return response;
}
