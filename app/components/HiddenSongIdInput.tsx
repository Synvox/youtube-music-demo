import { useSearchParams } from "@remix-run/react";
import { toObject } from "~/helpers/qs";

export function HiddenSongIdInput() {
  const { id } = toObject<"id">(useSearchParams()[0]);
  return <>{id && <input hidden name="id" defaultValue={id} />}</>;
}
