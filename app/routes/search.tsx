import { mdiArrowLeft } from "@mdi/js";
import { json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { StyleSheet } from "infused";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FormButton, FormIconButton } from "~/components/Button";
import { Flex } from "~/components/Flex";
import { HiddenSongIdInput } from "~/components/HiddenSongIdInput";
import { iconOf } from "~/components/Icons";
import { Input } from "~/components/Input";
import { Loader, LoaderWrapper } from "~/components/Loader";
import { Padding } from "~/components/Padding";
import { Stack } from "~/components/Stack";
import { Text } from "~/components/Text";
import { cachedFetch } from "~/fetchCached.server";
import { YOUTUBE_KEY } from "~/helpers/env.server";
import { Song } from "~/types";
import { qs, toObject } from "../helpers/qs";

const { styled } = StyleSheet();

const ArrowBackIcon = iconOf(mdiArrowLeft);

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const { q, cursor } = toObject<"q" | "cursor">(url.searchParams);

  const {
    items: songs,
    nextPageToken,
  }: { items: any[]; nextPageToken: string | null } = !q
    ? { items: [] }
    : await cachedFetch(
        `https://www.googleapis.com/youtube/v3/search?` +
          qs({
            q,
            maxResults: "20",
            part: "snippet",
            key: YOUTUBE_KEY,
            pageToken: cursor ?? undefined,
          })
      ).then(async (x) => {
        if (x.ok) return x.json();
        console.error("error", await x.text());
        throw json("Failed to search", { status: 500 });
      });

  return json({
    searchQuery: q,
    nextCursor: nextPageToken,
    songs: songs
      .filter((x: any) => x.id.videoId)
      .map(
        (x: any) =>
          ({
            id: x.id.videoId as string,
            name: x.snippet.title as string,
            artistName: x.snippet.channelTitle as string,
            img: x.snippet.thumbnails.high.url as string,
            imgWidth: x.snippet.thumbnails.high.width as number,
            imgHeight: x.snippet.thumbnails.high.height as number,
          } as Song)
      ),
  });
}

export default function Search() {
  const loaderData = useLoaderData<typeof loader>();
  const searchParams = toObject<"id" | "q" | "cursor">(useSearchParams()[0]);
  const [songs, setSongs] = useState(loaderData.songs);

  useEffect(() => {
    setSongs(loaderData.songs);
  }, [loaderData.searchQuery]);

  useEffect(() => {
    setSongs((s) => [...s, ...loaderData.songs]);
  }, [loaderData.nextCursor]);

  return (
    <>
      <SearchNav>
        <FormIconButton
          action={`/?${qs({
            id: searchParams.id,
          })}`}
        >
          <ArrowBackIcon />
        </FormIconButton>
        <Form action=".">
          <Flex direction="row">
            <Stack>
              <HiddenSongIdInput />
              <Input
                variant="large"
                name="q"
                defaultValue={loaderData.searchQuery}
                placeholder="Search"
              />
            </Stack>
          </Flex>
          <button hidden>Submit</button>
        </Form>
      </SearchNav>
      {songs.length !== 0 ? (
        <>
          {songs.map((song, index) => (
            <Song key={index} song={song} />
          ))}
          <Flex alignItems="center">
            <Padding>
              {loaderData.nextCursor && (
                <FormButton
                  action={`?${qs({
                    ...searchParams,
                    cursor: loaderData.nextCursor,
                  })}`}
                >
                  Next
                </FormButton>
              )}
            </Padding>
          </Flex>
        </>
      ) : (
        <Flex grow alignItems="center" justifyContent="center">
          <Text variant="light">Search For Something</Text>
        </Flex>
      )}
    </>
  );
}

function Song({ song }: { song: Song }) {
  const searchParams = toObject<"id" | "q" | "cursor">(useSearchParams()[0]);
  return (
    <SongContainer
      to={"?" + qs({ ...searchParams, id: song.id })}
      active={searchParams.id === song.id}
    >
      <Stack>
        <SongImg imgSrc={song.img}>
          <Loader />
        </SongImg>
        <Flex>
          <Stack space="xsmall">
            <Text variant="title" nowrap>
              {song.name}
            </Text>
            <Text variant="light" nowrap>
              {song.artistName}
            </Text>
          </Stack>
        </Flex>
      </Stack>
    </SongContainer>
  );
}

const SearchNav = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 4rem;
  border-bottom: 1px solid #fff3;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: stretch;
  z-index: 100;
  padding: 0rem 1rem;
  & > form:last-child {
    flex: 1;
  }
`;

const SongContainer = styled(Link)<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: inherit;
  text-decoration: none;
  padding: 10px;
  & + & {
    border-top: 1px solid #fff3;
  }
  &:hover {
    background: #fff1;
  }
  ${Loader} {
    opacity: 0;
  }
  &.active {
    ${Loader} {
      opacity: 1;
    }
  }
`.classes({ active: (p) => p.active });

const SongImg = styled.div<{ imgSrc: string }>`
  width: 4rem;
  height: 4rem;
  background-image: ${(p) => `url(${p.imgSrc})`};
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;
