#!/usr/bin/env -S deno run -A --ext=ts

import "npm:zx@7.2.3/globals";
import { exit } from "./alfred.ts";

$.verbose = false;

//$`git config -l | grep 'remote\..*\.url'`

async function getRemotes(path: string): Promise<
  Array<{
    name: string;
    url: string;
  }>
> {
  cd(path);
  const result = await $`git config -l | grep 'remote\..*\.url'`;
  const remotes = result.stdout
    .trim()
    .split("\n")
    .map((line) => {
      const [name, url] = line.split("=");
      return { name: name.split(".")[1], url };
    });
  return remotes;
}

const URL_PATTERNS: Array<RegExp> = [
  /^(ssh:\/\/)?git@(?<host>.*?)([:/])(?<repo>.*?)(\.git)?$/,
  /^https:\/\/(?<host>.*?)\/(?<repo>.*?)(\.git)?$/,
];

function guessGitHubUrl(remoteUrl: string): string | undefined {
  for (const urlPattern of URL_PATTERNS) {
    const match = remoteUrl.match(urlPattern);
    if (match && match.groups) {
      return `https://${match.groups["host"]}/${match.groups["repo"]}`;
    }
  }
  return undefined;
}

const remotes = await getRemotes(Deno.args[0]);
const result = remotes
  .map((remote) => {
    const url = guessGitHubUrl(remote.url);
    if (url) {
      return {
        title: remote.name,
        subtitle: url,
        arg: url,
      };
    } else {
      return null;
    }
  })
  .filter((item): item is NonNullable<typeof item> => item != null);
exit(0, result);
