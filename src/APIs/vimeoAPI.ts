import { API_KEY } from "../crede";

export async function vimeoApi(videoID: string | null) {
  const url = `https://api.vimeo.com/videos/${videoID}/?access_token=${API_KEY.vimeo}`;
  const res = await fetch(url);
  return res.json();
}
