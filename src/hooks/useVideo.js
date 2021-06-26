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

  const handleYouTubeVideo = (url) => {
    let params = new URL(url).searchParams;
    let videoID = params.get("v");
    return videoID;
  };

  return { inputURL, handleInputURLChange, handleVideoAdd };
}
