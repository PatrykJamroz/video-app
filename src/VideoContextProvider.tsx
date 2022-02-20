import React, { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { youtubeApi } from "./APIs/youtubeAPI";
import { vimeoApi } from "./APIs/vimeoAPI";

interface VideoContext {
  inputURL: string;
  videoData: VideoItem[];
  handleInputURLChange: () => void;
  handleVideoAdd: (e: FormEvent<HTMLFormElement>) => void;
  deleteVideo: (key: string) => void;
  toggleFavourite: (key: string) => void;
  handleFilterChange: (type: FilterType) => void;
  sortDataBy: (sortBy: SortBy) => void;
  deleteAllData: () => void;
  exportToJsonFile: () => void;
  handleJsonImport: () => void;
  handleVideoModalClose: () => void;
  handleVideoModalShow: (videoItem: VideoItem) => void;
  showVideoModal: () => void;
  modalData: ModalData | null;
  showWrongUrlModal: boolean;
  handleWrongUrlModalShow: () => void;
  handleWrongUrlModalClose: () => void;
}

interface ModalData {
  src: string;
  name: string;
}

interface VideoItem {
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

type SortBy = "savedDate" | "likeCount" | "favourite";

type VideoSources = "youtube" | "vimeo" | undefined;

type FilterType = "YouTube" | "Vimeo" | "";

export const VideoAppContext = React.createContext<VideoContext | null>(null);

export function VideoContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [inputURL, setInputURL] = useState("");
  const [videoData, setVideoData] = useState<VideoItem[]>(() => {
    const videoLocalData = localStorage.getItem("videoData");
    if (videoLocalData) {
      return JSON.parse(videoLocalData);
    }
    return [];
  });
  const [filterType, setFilterType] = useState<FilterType>("");
  const [wasSortedBy, setWasSortedBy] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [showWrongUrlModal, setShowWrongUrlModal] = useState(false);

  const createModalSrc = (videoItem: VideoItem) => {
    if (videoItem.source === "YouTube") {
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

  const handleVideoModalShow = (videoItem: VideoItem) => {
    createModalSrc(videoItem);
    setShowVideoModal(true);
  };
  const handleVideoModalClose = () => setShowVideoModal(false);

  const handleWrongUrlModalShow = () => setShowWrongUrlModal(true);

  const handleWrongUrlModalClose = () => setShowWrongUrlModal(false);

  const handleInputURLChange = (e: FormEvent<HTMLFormElement>) => {
    setInputURL(e.currentTarget.value);
  };

  const checkVideoSource = (): VideoSources => {
    if (inputURL.includes("youtu") || inputURL.length === 11) {
      return "youtube";
    }
    return "vimeo";
  };

  const fetchYouTubeData = async (videoID: string) => {
    const data = await youtubeApi(videoID);
    if (data.items.length === 0) {
      handleWrongUrlModalShow();
    } else {
      setVideoData((prevState) => [
        ...prevState,
        {
          id: videoID,
          key: `${videoID}${Math.random()}`,
          name: data.items[0].snippet.title,
          thumbnail: data.items[0].snippet.thumbnails.medium.url, // default, medium, high
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

  const checkInputType = () => {
    if (!inputURL.includes("http") && inputURL.length === 11) {
      return "id";
    }
    if (!inputURL.includes("http") && inputURL.length === 9) {
      return "id";
    }
    return "url";
  };

  const checkURL = () => {
    if (!inputURL.includes("http")) {
      const properURL = `https://${inputURL}`;
      return properURL;
    }
    return inputURL;
  };

  const handleYouTubeVideo = () => {
    const inputType = checkInputType();

    if (inputType === "id") {
      fetchYouTubeData(inputURL);
    } else {
      const checkedURL = checkURL();
      const url = new URL(checkedURL);
      if (inputURL.includes("youtube.com")) {
        const params = url.searchParams;
        const videoID = params.get("v");
        if (videoID) {
          fetchYouTubeData(videoID);
        } else {
          throw new Error("Could not find video id");
        }
      } else {
        const videoID = url.pathname.split("/");
        fetchYouTubeData(videoID[1]);
      }
    }
  };

  const fetchVimeoData = async (videoID: string) => {
    const data = await vimeoApi(videoID);
    // refactor error handling
    if (data.hasOwnProperty("error")) {
      handleWrongUrlModalShow();
    } else {
      setVideoData((state: any) => [
        ...state,
        {
          id: videoID,
          key: `${videoID}${Math.random()}`,
          name: data.name,
          thumbnail: data.pictures.sizes[2].link, // 0-8
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

  const handleVimeoVideo = () => {
    const inputType = checkInputType();

    if (inputType === "id") {
      fetchVimeoData(inputURL);
    } else {
      const checkedURL = checkURL();
      const url = new URL(checkedURL);
      const videoID = url.pathname.split("/");
      fetchVimeoData(videoID[1]);
    }
  };

  const handleVideoAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const source = checkVideoSource();

    if (source === "youtube") {
      handleYouTubeVideo();
    } else if (source === "vimeo") {
      handleVimeoVideo();
    } else {
      handleWrongUrlModalShow();
    }
  };

  const deleteVideo = (key: string) => {
    const newArray = [...videoData].filter((video) => video.key !== key);
    setWasSortedBy(true);
    setVideoData(newArray);
  };

  const deleteAllData = () => {
    setVideoData([]);
  };

  const toggleFavourite = (key: string) => {
    const newArray = [...videoData].map((item) => {
      if (item.key === key) {
        return { ...item, favourite: !item.favourite };
      }
      return item;
    });
    setVideoData(newArray);
  };

  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
  };

  const sourceFiltering = useMemo(() => {
    return filterType
      ? videoData.filter((item) => item.source === filterType)
      : videoData;
  }, [videoData, filterType]);

  const sortDataBy = (sortBy: SortBy) => {
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
    const dataStr = JSON.stringify(videoData);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const exportFileDefaultName = "videoData.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleJsonImport = (e) => {
    e.preventDefault();
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = () => {
      const convertedData: VideoItem[] = JSON.parse(e.target?.result as string);
      setVideoData([...convertedData]);
    };
  };

  useEffect(() => {
    localStorage.setItem("videoData", JSON.stringify(videoData));
  }, [videoData]);

  return (
    <VideoAppContext.Provider
      value={{
        inputURL,
        videoData: sourceFiltering,
        handleInputURLChange,
        handleVideoAdd,
        deleteVideo,
        toggleFavourite,
        handleFilterChange,
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
    </VideoAppContext.Provider>
  );
}

export function useVideoContext() {
  const context = React.useContext(VideoAppContext);
  if (context === null) {
    throw new Error(
      "useVideoContext must be used within a VideoContextProvider"
    );
  }
  return context;
}
