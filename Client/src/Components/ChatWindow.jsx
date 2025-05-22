// Import React and necessary hooks
import  { useEffect, useState, useRef } from "react";

// Import components and utilities
import MessageComponent from "./MessageComponent.jsx";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // For routing
import ChatInfo from "./ChatInfo.jsx"; // Chat information modal
import { useDispatch, useSelector } from "react-redux"; // For state management
import { getChatInfo } from "../API/chatCalls.js"; // API call to fetch chat details
import { getMessagesFromChat } from "../API/messageCalls.js"; // API calls for fetching chat messages
import ProfileInfo from "./ProfileInfo.jsx"; // Profile information modal
import ChatWindowSkeleton from "../Skeletons/ChatWindowSkeleton.jsx"; // Loading skeleton
import { socket } from "../API/SOCKET_IO.js"; // Socket.io for real-time communication
import {
  setMessages,
  setPaginationMessages,
  setPendingMessagesFromBottomToZero,
} from "../store/chatSlice.js";
import OriginalSizePicture from "../Widgets/OriginalSizePicture.jsx";
import LoadScreen from "./LoadScreen.jsx";
import PreviewImage from "../Widgets/PreviewImage.jsx";
import OptionMessageMenu from "../Widgets/OptionMessageMenu.jsx";
import { handleUpdate } from "../handlers/messagehandlers.js";
import {
  handleDeleteAllMessages,
  handleDeletedChat,
  handleDeleteMessage,
  handleExitClick,
  handleKickedUser,
  handlePressEnter,
  handleTyping,
  handleUpdatedMessage,
  handleUserTyping,
  sendImageInfo,
  sendMessageInfo,
} from "../handlers/chatHandlers.js";
import EmojiContainer from "../Widgets/EmojiContainer.jsx";
import { verifySize } from "../utilities/verifyImageSize.js";

const ChatWindow = () => {
  const location = useLocation(); // Get router location
  const { chatId } = useParams(); // Get chat ID from URL parameters
  const { chatImage, chatName } = location.state; // Extract state passed with routing

  // Select global state values
  const token = useSelector((state) => state.tokenInfo); // Auth token
  const messagesList = useSelector((state) => state.messages); // List of messages
  const user = useSelector((state) => state.userInfo); // Current user info
  const fontSize = useSelector((state) => state.fontSize); // Font size setting
  const activeChat = useSelector((state) => state.activeChat);
  const pendingMessageOnBottom = useSelector(
    (state) => state.pendingMessagesFromBottom
  );
  // Define local state variables
  const [openChatInfo, setOpenChatInfo] = useState(false); // Chat info modal visibility
  const [userToShow, setUserToShow] = useState(null); // Selected user for profile view
  const [newMessageContent, setNewMessageContent] = useState(""); // Input message content
  const [onLoading, setOnLoading] = useState(false); // Loading state for chat data
  const [isTyping, setIstyping] = useState({
    typing: false,
    name: "",
    userId: "",
    roomId: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Reference for scrolling to the bottom of the chat
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = (isMessage) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: isMessage ? "smooth" : "instant",
      });
    }

    dispatch(setPendingMessagesFromBottomToZero());
  };

  // Fetch chat information and messages
  const fetchChatInfo = async () => {
    setOnLoading(true);
    try {
      const chatInfoResult = await getChatInfo(chatId, dispatch, token); // Fetch chat info
      if (chatInfoResult.error) {
        handleDeletedChat(navigate, dispatch);
      }
      const result = await getMessagesFromChat(chatId, dispatch, token, 0); // Fetch messages
      dispatch(setMessages({ messages: result }));
    } catch (error) {
      console.error(error);
    } finally {
      setOnLoading(false); // End loading state
      setTimeout(() => {
        scrollToBottom();
      }, 200);
      setOffset(0);
    }
  };

  /////

  // join the chat //SOCKET IO
  useEffect(() => {
    socket.emit("join_chat", { room: activeChat?.data?.id, userId: user.id }); // Join the active chat room

    return () => {
      socket.off("join_chat");
    };
  }, [activeChat, chatId]);

  //

  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setInnerWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  ///

  // Fetchs chat information when chat ID changes
  useEffect(() => {
    dispatch(setMessages({ messages: [] })); // CLEAN THE MESSAGES AT THE GLOBAL STATE
    dispatch(setPendingMessagesFromBottomToZero());
    setOffset(0); // RESTARTS THE OFFSET
    setHasMore(true);
    setPreviewImage(null);
    setNewImage(null);
    setSelectedId(null);
    setInputToUpdate(false);
    setOldMessageToShow("");
    setNewMessageContent("");
    fetchChatInfo(); //CALLS THIS FUNCTION TO GET THE NEW MESSAGES OF THE CHAT
  }, [chatId]);

  ///

  //////////////////////

  /// THIS IS SECTION HANDLES THE MESSAGES PAGINATION AS AN INFINITE SCROLL

  const [offset, setOffset] = useState(0);
  const [isFetching, setIsFetching] = useState(false); //A LOCK TO THE PETITION, TO AVOID LOOPS
  const [hasMore, setHasMore] = useState(true);
  const [showArrowBTN, setShowArrowBTN] = useState(false); // THIS VARIABLE HANDLES WHEN TO SHOW THE ARROW DOWN BTN

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleScroll = debounce(async (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // SHOWS OR HIDES THE ARROW BUTTON
    if (distanceFromBottom > 150) {
      setShowArrowBTN(true);
    } else {
      dispatch(setPendingMessagesFromBottomToZero());
      setShowArrowBTN(false);
    }

    if (scrollTop === 0 && !isFetching && hasMore) {
      setIsFetching(true);
      const currentScrollPosition = scrollHeight;

      const newOffset = offset + 50;
      try {
        const results = await getMessagesFromChat(
          chatId,
          dispatch,
          token,
          newOffset
        );
        results.length < 50 ? setHasMore(false) : setHasMore(true);
        dispatch(setPaginationMessages({ messages: results }));
        setOffset(newOffset);

        setTimeout(() => {
          const newScrollHeight = e.target.scrollHeight;
          e.target.scrollTop = newScrollHeight - currentScrollPosition;
        }, 0);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    }
  }, 100);

  //////////////////////////////////

  // SCROLLS SMOOTHLY WHEN A NEW MESSAGE IS SENT IN THE CHAT AND THE USER IS IN THE BOTTOM OF THE CHAT
  useEffect(() => {
    if (showArrowBTN) return;
    scrollToBottom(true);
  }, [messagesList]);

  ///////////////

  ///HANDLES THE IMAGE BEFORE IT GETS SEND

  const [newImage, setNewImage] = useState(null);
  const [showFullImage, setShowFullImage] = useState(null);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // THIS FUNCTION IS TO REFERENCE THE INPUT TO ANOTHER HTML OBJECT
  const fileInputRef = useRef(null);
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  /// THIS FUNCTION IS USED TO CHARGE THE IMAGE IN THE BROWSER BEFORE IT GETS SENT
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const verifyingSize = verifySize(file, 5);
      if(!verifyingSize){
        return alert("File must not exceed the 5MB")
      }
      else{
          setNewImage(file);
      if (previewImage) {
        URL.revokeObjectURL(previewImage); // DELETES THE PREVIEW OF THE SELECTED IMAGE TO ADD A THE NEW ONE IN CASE THAT THE USER CHANGES THE IMAGE
      }

      const imageURL = URL.createObjectURL(file); //THE "URL"  IS TO SHOW A PREVIEW TO THE USER BY CREATING A NEW URL
      setPreviewImage(imageURL);
      }
    } else {
      setPreviewImage(null);
    }
  };

  // DISCARDS THE PREVIEW AND SENDING OF THE IMAGE
  const discardImage = () => {
    URL.revokeObjectURL(previewImage);
    setPreviewImage(null);
    setNewImage(null);
  };

  ///// THIS SECTION HANDLES THE "OPTIONMESSAGE" MENU

  const [position, setPosition] = useState({ x: 0, y: 0 }); /// THIS VAR WILL SET THE MENU IN THE EXACT PLACE WHERE YOU CLICKED THE MOUSE
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedId, setSelectedId] = useState(null); 
  const [selectedMessageContent, setSelectedMessageContent] = useState(null); 
  const [isImage, setIsImage] = useState(false);

  const handleLeftClick = (e, senderId, messageId, isImage, messageContent) => {
    e.preventDefault();
    if (user.id !== senderId) return;
    setPosition({ x: e.clientX, y: e.clientY });
    setSelectedId(messageId);
    setSelectedMessageContent(messageContent);
    setOldMessageToShow(messageContent);
    setIsImage(isImage);
    setOpenMenu(true);
  };

  const closeMenu = () => {
    setPosition({ x: 0, y: 0 });
    setOpenMenu(false);
    setSelectedId(null);
    setSelectedMessageContent(null);
  };

  //////////////////

 
  const [inputToUpdate, setInputToUpdate] = useState(false);
  const [oldMessageToShow, setOldMessageToShow] = useState(null);

  const discardUpdate = () => {
    setInputToUpdate(false);
    setSelectedMessageContent("");
    setOldMessageToShow("");
    setSelectedId(null);
  };
  ///

  useEffect(() => {
    socket.on("message_removed", (deletedMessageId) =>
      handleDeleteMessage(deletedMessageId, dispatch)
    );

    return () => {
      socket.off("message_removed");
    };
  }, []);

  useEffect(() => {
    socket.on("message_updated", (updatedMessageData) =>
      handleUpdatedMessage(updatedMessageData, dispatch)
    );

    return () => {
      socket.off("message_updated");
    };
  }, []);

  socket.on("typing", (typingInfo) =>
    handleUserTyping(typingInfo, setIstyping, socket)
  );

  useEffect(() => {
    socket.on("delete_all_messages", () => handleDeleteAllMessages(dispatch));
    socket.on("chat_deleted", () => {
      handleDeletedChat(navigate, dispatch);
    });
    socket.on("kicked_user", (kickedUserId) =>
      handleKickedUser(kickedUserId, user, navigate, dispatch)
    );

    return () => {
      socket.off("delete_all_messages");
      socket.off("chat_deleted");
      socket.off("kicked_user");
    };
  }, []);

  /////

  const [openedEmojiMenu, setOpenedEmojiMenu] = useState(false);

  return (
    <>
      {/* Render profile info modal if a user is selected */}
      {userToShow && (
        <ProfileInfo id={userToShow} closeVar={() => setUserToShow(null)} />
      )}
      {openMenu && (
        <OptionMessageMenu
          position={position}
          chatId={activeChat.data.id}
          token={token}
          messageId={selectedId}
          toUpdateVar={setInputToUpdate}
          isImage={isImage}
          toOpenMenu={setOpenMenu}
        />
      )}

      {openMenu && (
        <div
          onClick={closeMenu}
          onContextMenu={closeMenu}
          className="absolute inset-0  z-40"
        ></div>
      )}

      {/* Render chat info modal if open */}
      {openChatInfo && (
        <ChatInfo closeVar={setOpenChatInfo} image={chatImage} />
      )}
      {showFullImage && (
        <OriginalSizePicture src={showFullImage} setter={setShowFullImage} />
      )}
      {loadingScreen && <LoadScreen message={"UPLOADING IMAGE"} />}

      {/* Render chat content or loading skeleton */}
      {onLoading ? (
        <ChatWindowSkeleton />
      ) : (
        <div className="flex-1 relative max-lg:fixed z-20 text-white max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:h-full dark:bg-gray-800 bg-slate-50 p-4 flex overflow-x-hidden flex-col">
          {/* Chat header */}
          <div
            onClick={() => setOpenChatInfo(true)}
            className="flex items-center gap-3 dark:bg-gray-900 bg-gray-200 border dark:border-none dark:text-white text-black rounded-lg p-3 mb-4"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleExitClick(dispatch, navigate, activeChat?.data, user);
              }}
              className="text-xl p-2 w-12 h-12 max-lg:block hidden bg-gray-600 rounded-full"
            >
              {" "}
              {"<"}{" "}
            </button>
            <div className="flex dark:hover:bg-gray-800 hover:bg-gray-300 p-2  rounded-md cursor-pointer items-center gap-3">
              <div className="flex justify-center mb-4">
                <img
                  src={chatImage}
                  alt="Profile"
                  className="min-w-20 min-h-20 max-w-20 max-h-20 object-cover rounded-full border-2 border-gray-300"
                />
              </div>
              <div>
                <p className={`font-bold ${fontSize} line-clamp-1`}>
                  {chatName}
                </p>
              </div>
            </div>
          </div>

          {/* Chat messages */}
          <div
            onScroll={handleScroll}
            onClick={() => setOpenedEmojiMenu(false)}
            className="flex-1 flex flex-col max-h-[500px] max-md:max-h-[90vh] overflow-y-auto  overflow-x-hidden p-4 gap-3 text-black"
          >
            {messagesList.length < 1 && (
              <span className="flex relative top-[-4%] rounded-lg  justify-center w-full m-auto p-1 ">
                <p className="font-bold text-center text-gray-500 text-[18px]">
                  START THE CONVERSATION :)
                </p>
              </span>
            )}
            {hasMore && messagesList.length > 40 && (
              <span className="flex relative top-[-4%] rounded-lg  w-full m-auto p-1 animate-pulse bg-gray-700">
                <p className="font-bold text-white text-[18px]">
                  LOADING MESSAGES...
                </p>
              </span>
            )}
            {messagesList.map((msg) => (
              <MessageComponent
                key={msg.id}
                msg={msg}
                stateId={user.id}
                setterId={setUserToShow}
                setterImg={setShowFullImage}
                clickHandler={handleLeftClick}
                isMenuOpened={selectedId}
                innerwidth={innerWidth}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div
            onKeyDown={(e) => {
              handlePressEnter(
                e,
                discardUpdate,
                inputToUpdate,
                setLoadingScreen,
                activeChat,
                user,
                token,
                chatImage,
                socket,
                newImage,
                setNewImage,
                setPreviewImage,
                selectedId,
                selectedMessageContent,
                newMessageContent,
                setNewMessageContent,
                setOpenedEmojiMenu
              );
            }}
            className="pt-2 flex relative items-center gap-2"
          >
            {/* THIS PART SHOWS A MESSAGES IF ANOTHER USER FROM THE CHAT IS TYPING */}
            {isTyping.typing &&
              isTyping.userId !== user.id &&
              isTyping.roomId === activeChat.data.id && (
                <span className="flex absolute bottom-[50px] rounded-lg w-[30%] m-auto p-1 animate-pulse bg-gray-700">
                  <p className="font-bold text-[18px]">
                    {activeChat?.data?.isGroupChat
                      ? `${isTyping.name} is Writing...`
                      : `Writing...`}{" "}
                  </p>
                </span>
              )}
            {inputToUpdate && (
              <span className="flex flex-col absolute bottom-[50px] left-[4%] w-[90%] rounded-lg  p-1 border bg-slate-500  dark:bg-gray-700">
                <span className="absolute bottom-[99%] border-gray-300 border cursor-pointer h-5 w-5 flex justify-center items-center rounded-full bg-gray-700 left-[100%]">
                  <p onClick={discardUpdate} className="mb-[1px] ">
                    x
                  </p>
                </span>
                <p className="text-[14px] font-bold line-clamp-2">Original:</p>
                <p className="text-[14px] line-clamp-2">{oldMessageToShow}</p>
              </span>
            )}
            {/* ////7 */}
            {/* INPUT FOR IMAGES */}
            {previewImage && newImage && (
              <>
                <span className="absolute bottom-12 cursor-pointer   flex justify-center items-center rounded-full bg-red-700 left-[5px]">
                  <PreviewImage
                    src={previewImage}
                    cancelFunct={discardImage}
                    setter={setShowFullImage}
                  />
                </span>
              </>
            )}
            <div
              onClick={handleImageClick}
              className={`min-w-11 min-h-11 max-w-11 max-h-11 max-md:min-h-8 max-md:max-h-8 max-md:max-w-8 max-md:min-w-8 flex cursor-pointer relative bg-slate-300 dark:bg-slate-700 rounded-full ${
                newImage ? "border-[3px] border-purple-600" : ""
              }`}
            >
              <button className="dark:text-white text-black font-bold m-auto text-sm">
                {innerWidth > 768 ? "IMG" : "🖼️"}
              </button>
            </div>
            <div
              onClick={() => setOpenedEmojiMenu(!openedEmojiMenu)}
              className={` max-md:hidden min-w-11 min-h-11 max-w-11 max-h-11 max-md:min-h-11 max-md:max-h-11 max-md:max-w-11 max-md:min-w-11 flex cursor-pointer relative bg-slate-300 dark:bg-slate-700 rounded-full ${
                openedEmojiMenu ? "border-[3px] border-purple-600" : ""
              }`}
            >
              <button className="dark:text-white max-md:hidden text-black font-bold m-auto text-sm">
                {innerWidth > 768 ? "Emoji" : "😊"}
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e)}
            />
            {openedEmojiMenu && (
              <EmojiContainer setMessageContent={setNewMessageContent} />
            )}

            {/* /////// */}
            <input
              onChange={(e) => {
                if (inputToUpdate) {
                  setSelectedMessageContent(e.target.value);
                } else {
                  setNewMessageContent(e.target.value);
                  handleTyping(socket, user, activeChat);
                }
              }}
              value={inputToUpdate ? selectedMessageContent : newMessageContent}
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-2 rounded border dark:bg-gray-900 dark:text-white text-black bg-gray-200 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {showArrowBTN && (
              <>
                <button
                  onClick={() => scrollToBottom()}
                  className="fixed bg-slate-700 bottom-[20%] right-[5%] hover:bg-gray-500 hover: w-12 h-12 border border-gray-500 rounded-full"
                >
                  ↓
                  {pendingMessageOnBottom > 0 && (
                    <span className="absolute bottom-12 cursor-pointer h-5 w-5 flex justify-center items-center rounded-full bg-purple-700 right-0">
                      <p className="mt-[2px]">{pendingMessageOnBottom}</p>
                    </span>
                  )}
                </button>
              </>
            )}
            <button
              onClick={() => {
                if (newImage) {
                  sendImageInfo(
                    setLoadingScreen,
                    activeChat,
                    user,
                    token,
                    chatImage,
                    socket,
                    newImage,
                    setNewImage,
                    setPreviewImage
                  );
                }
                if (inputToUpdate) {
                  handleUpdate(
                    selectedId,
                    activeChat.data.id,
                    selectedMessageContent,
                    token
                  );
                  return discardUpdate();
                }

                sendMessageInfo(
                  setNewMessageContent,
                  newMessageContent,
                  user,
                  activeChat,
                  socket,
                  token,
                  chatImage
                );

                setOpenedEmojiMenu(false);
              }}
              className={`bg-purple-500 ${
                newMessageContent.trim().length < 1 &&
                !newImage &&
                !inputToUpdate
                  ? "opacity-50"
                  : "hover:bg-purple-600 cursor-pointer"
              } text-white px-4 py-2 rounded-md`}
            >
              {inputToUpdate ? "Done" : " Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWindow;
