import {
  mdiCompassOutline,
  mdiFaceManProfile,
  mdiHomeOutline,
  mdiMagnify,
  mdiPlayCircleOutline,
} from "@mdi/js";
import { NavLink as RemixNavLink, useSearchParams } from "@remix-run/react";
import { StyleSheet } from "infused";
import { ReactNode } from "react";
import { qs, toObject } from "~/helpers/qs";
import { Song } from "~/types";
import { IconButton } from "./Button";
import { Flex } from "./Flex";
import { iconOf } from "./Icons";
import { Player } from "./Player";
import { Stack } from "./Stack";

const { createGlobalStyle, styled } = StyleSheet("main");

const PlayIcon = iconOf(mdiPlayCircleOutline);
const HomeIcon = iconOf(mdiHomeOutline);
const SearchIcon = iconOf(mdiMagnify);
const CompassIcon = iconOf(mdiCompassOutline);
const UserIcon = iconOf(mdiFaceManProfile);

export function Main({
  children,
  song,
}: {
  children: ReactNode;
  song: Song | null;
}) {
  const { id } = toObject<"id">(useSearchParams()[0]);

  const queryString = qs({
    id,
  });

  return (
    <>
      <GlobalStyle />
      <Nav>
        <NavLink to={`/?${queryString}`} end>
          <PlayIcon />
        </NavLink>
        <Flex direction="row">
          <Stack space="large">
            <NavLink to={`/home?${queryString}`}>
              <HomeIcon />
            </NavLink>
            <NavLink to={`/explore?${queryString}`}>
              <CompassIcon />
            </NavLink>
            <NavLink to={`/search?${queryString}`}>
              <SearchIcon />
            </NavLink>
          </Stack>
        </Flex>
        <NavLink to={`/profile?${queryString}`}>
          <UserIcon />
        </NavLink>
      </Nav>
      <Container isPlaying={Boolean(id)}>{children}</Container>
      {song && <Player song={song} />}
    </>
  );
}

const GlobalStyle = createGlobalStyle`
*, ::before, ::after {box-sizing: border-box;}html {line-height: 1.15;-webkit-text-size-adjust: 100%;-moz-tab-size: 4;tab-size: 4;}body {margin: 0;font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';}hr {height: 0;color: inherit;}abbr[title] {text-decoration: underline dotted;}b, strong {font-weight: bolder;}code, kbd, samp, pre {font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;font-size: 1em;}small {font-size: 80%;}sub, sup {font-size: 75%;line-height: 0;position: relative;vertical-align: baseline;}sub {bottom: -0.25em;}sup {top: -0.5em;}table {text-indent: 0;border-color: inherit;}button, input, optgroup, select, textarea {font-family: inherit;font-size: 100%;line-height: 1.15;margin: 0;}button, select {text-transform: none;}button, [type='button'], [type='reset'], [type='submit'] {-webkit-appearance: button;}::-moz-focus-inner {border-style: none;padding: 0;}:-moz-focusring {outline: 1px dotted ButtonText;}:-moz-ui-invalid {box-shadow: none;}legend {padding: 0;}progress {vertical-align: baseline;}::-webkit-inner-spin-button, ::-webkit-outer-spin-button {height: auto;}[type='search'] {-webkit-appearance: textfield;outline-offset: -2px;}::-webkit-search-decoration {-webkit-appearance: none;}::-webkit-file-upload-button {-webkit-appearance: button;font: inherit;}summary {display: list-item;}

  :root {
    --bg: #000;
    --surface-1: #24282e;
    --surface-2: #111318;
    --surface-3: #02040a;
    --border-color: #303437;
    --text-color: #ffffffcc;
    --theme-color: #1d9bf0; 
  }
  html {
    box-sizing: border-box;
    font-size: 14px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    background: var(--bg);
    color: #fff;
  }
`;

const Nav = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 4rem;
  border-bottom: 1px solid #fff3;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  z-index: 100;
`;

const Container = styled.div<{ isPlaying: boolean }>`
  display: flex;
  flex-direction: column;
  margin-top: 4rem;
  min-height: calc(100vh - 4rem);
  &.isPlaying {
    margin-bottom: 5rem;
    min-height: calc(100vh - 5rem);
  }
`.classes({ isPlaying: (p) => p.isPlaying });

const NavLink = styled(RemixNavLink)`
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  width: 2.5rem;
  aspect-ratio: 1;
  border-radius: 1000px;
  transition-duration: 250ms;
  padding: 0;
  opacity: 0.7;
  svg {
    width: 1.75rem;
    height: 1.75rem;
  }
  &:hover {
    background: #fff1;
  }
  &:active {
    background: #0008;
    transition-duration: 0ms;
  }
  &.size-large {
    width: 3.5rem;
    svg {
      width: 2.75rem;
      height: 2.75rem;
    }
  }
  &.active {
    opacity: 1;
  }
`.attrs({
  className: (p: { isActive?: boolean }) => (p.isActive ? "active" : ""),
});
