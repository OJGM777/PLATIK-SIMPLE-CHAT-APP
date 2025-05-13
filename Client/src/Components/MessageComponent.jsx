import React, { useState } from "react";
import { formatDate } from "../utilities/formatDate";

const MessageComponent = ({
  msg,
  stateId,
  setterId,
  setterImg,
  clickHandler,
  isMenuOpened,
  innerwidth,
}) => {
  const [openFullText, setOpenFullText] = useState(false);

  return (
    <>
      <div
        key={msg.id}
        className={`flex ${
          stateId === msg.userSenderId ? "justify-end" : "justify-start"
        } relative w-[98%]  text-white items-start m-2  gap-3 mb-2`}
      >
        {stateId !== msg.userSenderId ? (
          <img
            src={msg.senderPic}
            onClick={() => {
              setterId(msg.userSenderId);
            }}
            alt="User Avatar"
            className="w-10 cursor-pointer h-10 mt-4 rounded-full"
          />
        ) : null}

        {/* CLICKHANDLER HANDLES THE OPTION MESSAGE MENU */}
        <div
          onContextMenu={(e) =>
            clickHandler(e, msg.userSenderId, msg.id, msg.isImage, msg.Content)
          }
          className={`max-w-[50%]  max-md:max-w-[75%] `}
        >
          <div className="relative ">
            <p className={`text-sm flex items-center gap-2 `}>
              <span
                onClick={() => setterId(msg.userSenderId)}
                className="font-bold max-w-[70%] max-md:line-clamp-1 hover:text-gray-400 cursor-pointer text-slate-700 dark:text-white"
              >
                {msg.senderName}
              </span>{" "}
              <span className="text-xs text-gray-500">
                {innerwidth > 768
                  ? formatDate(msg.Created)
                  : new Date(msg.Created).toLocaleDateString()}
              </span>
            </p>

            {msg.isImage ? (
              <div className="w-full flex flex-col relative">
                <img
                  onClick={() => setterImg(msg.Content)}
                  src={msg.Content}
                  alt="Image"
                  className="max-w-[350px] max-md:max-w-[200px] cursor-pointer rounded-md h-auto"
                />
                {innerwidth < 768 ? (
                  <span className="w-full text-right mr-5 text-gray-500 text-[12px] ">
                    {formatDate(msg.Created, true)}
                  </span>
                ) : null}
              </div>
            ) : (
              <div className="w-full relative flex flex-col">
                <p
                  className={`text-gray-100   ${
                    isMenuOpened === msg.id
                      ? "dark:shadow-[inset_0px_0px_0px_3px_rgba(190,186,186,0.46)]  shadow-[inset_0px_0px_0px_3px_rgb(132,70,167)]"
                      : ""
                  } ${
                    stateId === msg.userSenderId
                      ? "dark:bg-green-900 bg-green-600"
                      : "dark:bg-gray-700 bg-gray-400"
                  } p-2 rounded-md ${
                    openFullText && msg?.Content?.length > 800
                      ? ""
                      : "line-clamp-[8] max-h-[580px]"
                  }`}
                >
                  {msg.Content}
                </p>
                {innerwidth < 768 ? (
                  <span className="w-full  text-right mr-5 text-gray-500 text-[12px] ">
                    {formatDate(msg.Created, true)}
                  </span>
                ) : null}
              </div>
            )}
            {!openFullText && msg.Content.length > 800 && (
              <span
                onClick={() => setOpenFullText(!openFullText)}
                className={`absolute bottom-0 cursor-pointer p-1  text-blue-600 rounded ${
                  stateId === msg.userSenderId ? "bg-green-900" : "bg-gray-700"
                }    w-full`}
              >
                READ FULL TEXT
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageComponent;
