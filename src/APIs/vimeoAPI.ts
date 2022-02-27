import { API_KEY } from "../crede";

export default async function vimeoApi(videoID: string) {
  const url = `https://api.vimeo.com/videos/${videoID}/?access_token=${API_KEY.vimeo}`;
  const res = await fetch(url);
  return res.json();
}
