import { ReactNode, ReactText, useEffect, useMemo, useState } from "react";
import { youtubeApi } from "./APIs/youtubeAPI";
import { vimeoApi } from "./APIs/vimeoAPI";
import React from "react";
import type { FormEvent } from "react";

interface ContextInterface {
  inputURL?: string;
  videoData?: any;
  handleInputURLChange?: any;
  handleVideoAdd?: any;
  deleteVideo?: any;
  toggleFavourite?: any;
  handleFilterChange?: any;
  videoSources?: any;
  sortDataBy?: any;
  deleteAllData?: () => void;
  exportToJsonFile?: () => void;
  handleJsonImport?: any;
  handleVideoModalClose?: () => void;
  handleVideoModalShow?: any;
  showVideoModal?: any;
  modalData?: ModalDataInterface;
  showWrongUrlModal?: boolean;
  handleWrongUrlModalShow?: () => void;
  handleWrongUrlModalClose?: () => void;
}

interface ModalDataInterface {
  src?: string;
  name?: string;
}

interface VideoItemInterface {
  id: string;
  key: string;
  name: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  savedDate: Date;
  favourite: boolean;
  source: string;
  url: string;
}

const Context = React.createContext<ContextInterface>({});

const ContextProvider: React.FC = ({ children }) => {
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
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [showWrongUrlModal, setShowWrongUrlModal] = useState(false);

  const createModalSrc = (videoItem: VideoItemInterface) => {
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

  const handleVideoModalShow = (videoItem: VideoItemInterface) => {
    createModalSrc(videoItem);
    setShowVideoModal(true);
  };
  const handleVideoModalClose = () => setShowVideoModal(false);

  const handleWrongUrlModalShow = () => setShowWrongUrlModal(true);

  const handleWrongUrlModalClose = () => setShowWrongUrlModal(false);

  const handleInputURLChange = (e: FormEvent<HTMLFormElement>) => {
    setInputURL(e.currentTarget.value);
  };

  const handleVideoAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const source = checkVideoSource(inputURL);

    if (source === "youtube") {
      handleYouTubeVideo(inputURL);
    } else if (source === "vimeo") {
      handleVimeoVideo(inputURL);
    } else {
      handleWrongUrlModalShow();
    }
  };

  const checkVideoSource = (inputURL: string) => {
    if (inputURL.includes("youtu") || inputURL.length === 11) {
      return "youtube";
    } else if (inputURL.includes("vimeo") || inputURL.length === 9) {
      return "vimeo";
    }
  };

  const checkURL = (inputURL: string) => {
    if (!inputURL.includes("http")) {
      const properURL = `https://${inputURL}`;
      return properURL;
    } else {
      return inputURL;
    }
  };

  const checkInputType = (inputURL: string) => {
    if (!inputURL.includes("http") && inputURL.length === 11) {
      return "id";
    } else if (!inputURL.includes("http") && inputURL.length === 9) {
      return "id";
    } else {
      return "url";
    }
  };

  const fetchYouTubeData = async (videoID: string | null) => {
    const data = await youtubeApi(videoID);
    if (data.items.length === 0) {
      handleWrongUrlModalShow();
    } else {
      setVideoData((state: any) => [
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
    }
  };

  const handleYouTubeVideo = (inputURL: string) => {
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

  const fetchVimeoData = async (videoID: string | null) => {
    const data = await vimeoApi(videoID);

    if (data.hasOwnProperty("error")) {
      handleWrongUrlModalShow();
    } else {
      setVideoData((state: any) => [
        ...state,
        {
          id: videoID,
          key: `${videoID}${Math.random()}`,
          name: data.name,
          thumbnail: data.pictures.sizes[2].link, //0-8
          savedDate: new Date(),
          viewCount: data.stats.plays,
          likeCount: data.metadata.connections.likes.total,
          favourite: false,
          source: "Vimeo",
          url: inputURL,
        },
      ]);
      setInputURL("");
    }
  };

  const handleVimeoVideo = (inputURL: string) => {
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

  const deleteVideo = (key: string) => {
    let newArray = [...videoData].filter((video) => video.key !== key);
    setWasSortedBy(true);
    setVideoData(newArray);
  };

  const deleteAllData = () => {
    setVideoData([]);
  };

  const toggleFavourite = (key: string) => {
    let newArray = [...videoData];
    newArray.map((item) => {
      if (item.key === key) {
        item.favourite = !item.favourite;
      }
    });
    setVideoData(newArray);
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
  };

  const sourceFiltering = useMemo(() => {
    return filterType
      ? videoData.filter(
          (item: VideoItemInterface) => item.source === filterType
        )
      : videoData;
  }, [videoData, filterType]);

  const sortDataBy = (sortBy: string) => {
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

  const handleJsonImport = (e: any) => {
    e.preventDefault();
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e: any) => {
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
        handleVideoModalClose,
        handleVideoModalShow,
        showVideoModal,
        modalData,
        showWrongUrlModal,
        handleWrongUrlModalShow,
        handleWrongUrlModalClose,
      }}
    >
      {children}
    </Context.Provider>
  );
};
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
