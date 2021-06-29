import { useState } from "react";
import { API_KEY } from "../crede";
import { youtubeApi } from "../APIs/youtubeAPI";

export function useVideo() {
  //paste url -> setState
  //add button -> onSubmit
  //check source (youtube, vimeo, etc.)
  //get ID
  //fetch data
  //set state -> view count, likes count, vids name, vids thumbnail, date of add (to our app)

  const [inputURL, setInputURL] = useState("empty");
  const [videoData, setVideoData] = useState([
    {
      id: "7lCDEYXw3mM",
      name: "Google I/O 101: Q&A On Using Google APIs",
      thumbnail: "https://i.ytimg.com/vi/7lCDEYXw3mM/default.jpg",
    },
  ]);

  const handleInputURLChange = (e) => {
    setInputURL(e.currentTarget.value);
    console.log(inputURL);
  };

  const handleVideoAdd = (e) => {
    e.preventDefault();
    if (inputURL.includes("youtu")) {
      handleYouTubeVideo(inputURL);
      //console.log(videoData);
    }
  };

  const fetchYouTubeData = async (videoID) => {
    const data = await youtubeApi(videoID);
    setVideoData((state) => [
      ...state,
      {
        id: videoID,
        name: data.items[0].snippet.title,
        thumbnail: data.items[0].snippet.thumbnails.default.url,
      },
    ]);
  };

  const handleYouTubeVideo = (inputURL) => {
    const url = new URL(inputURL);

    if (inputURL.includes("youtube.com")) {
      const params = url.searchParams;
      const videoID = params.get("v");
      fetchYouTubeData(videoID);
    } else {
      const videoID = url.pathname.split("/");
      fetchYouTubeData(videoID[1]);
    }
  };

  console.log(videoData);

  return { inputURL, videoData, handleInputURLChange, handleVideoAdd };
}
