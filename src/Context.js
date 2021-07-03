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
      name: "Google I/O 101: Q&A On Using Google APIs",
      thumbnail: "https://i.ytimg.com/vi/7lCDEYXw3mM/default.jpg",
      savedDate:
        "Tue Feb 04 1992 21:49:21 GMT+0200 (Central European Summer Time)",
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
        name: data.items[0].snippet.title,
        thumbnail: data.items[0].snippet.thumbnails.default.url,
        savedDate: new Date(),
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
        name: data.name,
        thumbnail: data.pictures.sizes[0].link,
        savedDate: new Date(),
      },
    ]);
  };

  const deleteVideo = (id) => {
    let newArray = [...videoData].filter((video) => video.id !== id);
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
