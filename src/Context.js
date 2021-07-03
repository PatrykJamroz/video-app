import { useState } from "react";
import { youtubeApi } from "./APIs/youtubeAPI";
import { vimeoApi } from "./APIs/vimeoAPI";
import React from "react";

const Context = React.createContext();

function ContextProvider({ children }) {
  const [inputURL, setInputURL] = useState("empty");
  const [videoData, setVideoData] = useState([
    {
      id: "7lCDEYXw3mM",
      key: "7lCDEYXw3mM9",
      name: "Google I/O 101: Q&A On Using Google APIs",
      thumbnail: "https://i.ytimg.com/vi/7lCDEYXw3mM/default.jpg",
      savedDate:
        "Tue Feb 04 1992 21:49:21 GMT+0200 (Central European Summer Time)",
      source: "YouTube/Hardcoded",
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
    } else if (inputURL.includes("vimeo")) {
      const url = new URL(inputURL);
      const videoID = url.pathname.split("/");
      fetchVimeoData(videoID[1]);
    }
  };

  const fetchYouTubeData = async (videoID) => {
    const data = await youtubeApi(videoID);
    setVideoData((state) => [
      ...state,
      {
        id: videoID,
        key: `${videoID}${Math.random()}`,
        name: data.items[0].snippet.title,
        thumbnail: data.items[0].snippet.thumbnails.default.url,
        savedDate: new Date(),
        source: "YouTube",
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

  const fetchVimeoData = async (videoID) => {
    const data = await vimeoApi(videoID);
    setVideoData((state) => [
      ...state,
      {
        id: videoID,
        key: `${videoID}${Math.random()}`,
        name: data.name,
        thumbnail: data.pictures.sizes[0].link,
        savedDate: new Date(),
        source: "Vimeo",
      },
    ]);
  };

  const deleteVideo = (key) => {
    let newArray = [...videoData].filter((video) => video.key !== key);
    setVideoData(newArray);
  };

  return (
    <Context.Provider
      value={{
        inputURL,
        videoData,
        handleInputURLChange,
        handleVideoAdd,
        deleteVideo,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export { ContextProvider, Context };
