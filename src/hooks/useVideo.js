import { useState } from "react";
import { API_KEY } from "../crede";

export function useVideo() {
  //paste url -> setState
  //add button -> onSubmit
  //check source (youtube, vimeo, etc.)
  //get ID
  //fetch data
  //set state -> view count, likes count, vids name, vids thumbnail, date of add (to our app)

  const [inputURL, setInputURL] = useState("empty");
  const [videoData, setVideoData] = useState([]);

  const handleInputURLChange = (e) => {
    setInputURL(e.currentTarget.value);
    console.log(inputURL);
  };

  const handleVideoAdd = (e) => {
    e.preventDefault();
    if (inputURL.includes("youtu")) {
      console.log(handleYouTubeVideo(inputURL));
    }
  };

  const handleYouTubeVideo = (inputURL) => {
    const url = new URL(inputURL);

    if (inputURL.includes("youtube.com")) {
      const params = url.searchParams;
      const videoID = params.get("v");
      return videoID;
    } else {
      const videoID = url.pathname.split("/");
      return videoID[1];
    }
  };

  return { inputURL, handleInputURLChange, handleVideoAdd };
}
