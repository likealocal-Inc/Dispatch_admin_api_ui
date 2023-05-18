import sleep from "sleep-promise";
import { APIURLs } from "./client/constants";
import { callAPI } from "./client/call/call";

export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export async function getRandomImage({
  size = 100,
  delay = 0,
}: {
  size?: number;
  delay?: number;
}): Promise<Response> {
  if (delay) {
    await sleep(delay);
  }
  return await fetch(`https://picsum.photos/${size}`);
}
