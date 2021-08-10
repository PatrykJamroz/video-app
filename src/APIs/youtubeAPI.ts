import { API_KEY } from "../crede";

export async function youtubeApi(videoID: string) {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${API_KEY.youtube}&part=snippet,contentDetails,statistics,status`;
  const res = await fetch(url);
  return res.json();
}
