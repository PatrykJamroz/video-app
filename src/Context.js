import { useEffect, useMemo, useState } from "react";
import { youtubeApi } from "./APIs/youtubeAPI";
import { vimeoApi } from "./APIs/vimeoAPI";
import React from "react";

const Context = React.createContext();

function ContextProvider({ children }) {
  const [inputURL, setInputURL] = useState("");
  const [videoData, setVideoData] = useState(() => {
    const videoData = localStorage.getItem("videoData");
    if (videoData) {
      return JSON.parse(videoData);
    }
    return [];
  });
  const [filterType, setFilterType] = useState("");
  const [videoSources, setVideoSources] = useState([""]);
  const [wasSortedBy, setWasSortedBy] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const createModalSrc = (videoItem) => {
    if (checkVideoSource(videoItem.id) === "youtube") {
      setModalData({
        src: `http://www.youtube.com/embed/${videoItem.id}`,
        name: videoItem.name,
      });
    } else {
      setModalData({
        src: `https://player.vimeo.com/video/${videoItem.id}`,
        name: videoItem.name,
      });
    }
  };

  const handleModalShow = (videoID) => {
    createModalSrc(videoID);
    setShowModal(true);
  };
  const handleModalClose = () => setShowModal(false);

  const handleInputURLChange = (e) => {
    setInputURL(e.currentTarget.value);
  };

  const handleVideoAdd = (e) => {
    e.preventDefault();

    const source = checkVideoSource(inputURL);

    if (source === "youtube") {
      handleYouTubeVideo(inputURL);
    } else if (source === "vimeo") {
      handleVimeoVideo(inputURL);
    } else {
      console.log("Incorrect URL! - handleVideoAdd");
    }
  };

  const checkVideoSource = (inputURL) => {
    if (inputURL.includes("youtu") || inputURL.length === 11) {
      return "youtube";
    } else if (inputURL.includes("vimeo") || inputURL.length === 9) {
      return "vimeo";
    } else {
      console.log("incorrect URL!");
    }
  };

  const checkURL = (inputURL) => {
    if (!inputURL.includes("http")) {
      const properURL = `https://${inputURL}`;
      return properURL;
    } else {
      return inputURL;
    }
  };

  const checkInputType = (inputURL) => {
    if (!inputURL.includes("http") && inputURL.length === 11) {
      return "id";
    } else if (!inputURL.includes("http") && inputURL.length === 9) {
      return "id";
    } else {
      return "url";
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
        thumbnail: data.items[0].snippet.thumbnails.medium.url, //default, medium, high
        viewCount: data.items[0].statistics.viewCount,
        likeCount: data.items[0].statistics.likeCount,
        savedDate: new Date(),
        favourite: false,
        source: "YouTube",
        url: inputURL,
      },
    ]);
    setInputURL("");
  };

  const handleYouTubeVideo = (inputURL) => {
    const inputType = checkInputType(inputURL);

    if (inputType === "id") {
      fetchYouTubeData(inputURL);
    } else {
      const checkedURL = checkURL(inputURL);
      const url = new URL(checkedURL);
      if (inputURL.includes("youtube.com")) {
        const params = url.searchParams;
        const videoID = params.get("v");
        fetchYouTubeData(videoID);
      } else {
        const videoID = url.pathname.split("/");
        fetchYouTubeData(videoID[1]);
      }
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
        thumbnail: data.pictures.sizes[2].link, //0-8
        savedDate: new Date(),
        viewCount: data.stats.plays,
        likeCount: data.metadata.connections.likes.total,
        savedDate: new Date(),
        favourite: false,
        source: "Vimeo",
        url: inputURL,
      },
    ]);
    setInputURL("");
  };

  const handleVimeoVideo = (inputURL) => {
    const inputType = checkInputType(inputURL);

    if (inputType === "id") {
      fetchVimeoData(inputURL);
    } else {
      const checkedURL = checkURL(inputURL);
      const url = new URL(checkedURL);
      const videoID = url.pathname.split("/");
      fetchVimeoData(videoID[1]);
    }
  };

  const deleteVideo = (key) => {
    let newArray = [...videoData].filter((video) => video.key !== key);
    setWasSortedBy(true);
    setVideoData(newArray);
  };

  const deleteAllData = () => {
    setVideoData([]);
  };

  const toggleFavourite = (key) => {
    let newArray = [...videoData];
    newArray.map((item) => {
      if (item.key === key) {
        item.favourite = !item.favourite;
      }
    });
    setVideoData(newArray);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const sourceFiltering = useMemo(() => {
    return filterType
      ? videoData.filter((item) => item.source === filterType)
      : videoData;
  }, [videoData, filterType]);

  const sortDataBy = (sortBy) => {
    if (wasSortedBy) {
      const reversedArr = [...videoData].reverse();
      setVideoData(reversedArr);
    } else {
      const sortedArr = [...videoData].sort((a, b) => b[sortBy] - a[sortBy]);
      setWasSortedBy(true);
      setVideoData(sortedArr);
    }
  };

  const exportToJsonFile = () => {
    let dataStr = JSON.stringify(videoData);
    let dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    let exportFileDefaultName = "videoData.json";

    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleJsonImport = (e) => {
    e.preventDefault();
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const convertedData = JSON.parse(e.target.result);
      setVideoData([...convertedData]);
    };
  };

  useEffect(() => {
    localStorage.setItem("videoData", JSON.stringify(videoData));
  }, [videoData]);

  return (
    <Context.Provider
      value={{
        inputURL,
        videoData: sourceFiltering,
        handleInputURLChange,
        handleVideoAdd,
        deleteVideo,
        toggleFavourite,
        handleFilterChange,
        videoSources,
        sortDataBy,
        deleteAllData,
        exportToJsonFile,
        handleJsonImport,
        handleModalClose,
        handleModalShow,
        showModal,
        modalData,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export { ContextProvider, Context };

//hardcoded state
// {
//   id: "7lCDEYXw3mM",
//   key: "7lCDEYXw3mM9",
//   name: "Google I/O 101: Q&A On Using Google APIs",
//   thumbnail: "https://i.ytimg.com/vi/7lCDEYXw3mM/default.jpg",
//   savedDate:
//     "Tue Feb 04 1992 21:49:21 GMT+0200 (Central European Summer Time)",
//   source: "YouTube/Hardcoded",
// },
