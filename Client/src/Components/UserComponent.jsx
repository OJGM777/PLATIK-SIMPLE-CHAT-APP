//THIS USER COMPONENT HAS TWO OBJECTIVES:
// TO SHOW IN THE SEARCH WINDOW
// TO SHOW IN THE CREATE GROUP CHAT COMPONENT AS SELECTABLE OBJECT (TO ADD A NEW MEMBER TO A GROUP CHAT)

import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleCreateDualChat } from "../handlers/chatHandlers";

const UserComponent = ({
  user,
  userProfile,
  isToShow,
  setter,
  waitVar,
  userIdVar,
  filter,
  userInfo,
  closeSearchWindowvar,
}) => {
  const navigate = useNavigate();
  const Token = useSelector((state) => state.tokenInfo);
  const dispatch = useDispatch();

  // SETTER IS FOR ADDING THEM TO A GROUP CHAT  AND FILTER TO FILT ALL THE REPETITIVE OBJS
  const handleClick = () => {
    if (userInfo?.id === user.id) return;
    if (isToShow) {
      setter((prev) => [...prev, { name: user.name, id: user.id }]);
      filter();
      return;
    } else {
      userIdVar(user.id); // userId is to compare your ID and the user's one
    }
  };

  return (
    <>
      <li
        key={user.id}
        className="mb-2 flex relative bg-gray-200 text-black dark:text-gray-100 dark:bg-gray-900 p-3 rounded-lg items-center gap-3 cursor-pointer"
        onClick={handleClick}
      >
        <img
          src={user.ProfilePicture}
          className="w-8 h-8 rounded-full dark:bg-gray-700"
        />
        <div>
          <p className="font-semibold">{user.name}</p>
          {/* <p className="text-sm text-gray-400">{"Last Message"}</p> */}
        </div>
        {isToShow || userProfile.id === user.id ? (
          ""
        ) : (
          <button
            onClick={async (e) => {
              e.stopPropagation();
              await handleCreateDualChat(
                user,
                userProfile,
                Token,
                navigate,
                dispatch,
                waitVar
              ); // IN CASE THAT THE COMPONENT IS ON THE SEARCH WINDOW COMPONENT, THE BUTTON WILL TRIGGER THE CREATE DUAL CHAT FUNCTION.
              if (closeSearchWindowvar) {
                closeSearchWindowvar(false);
              }
            }}
            className="bg-purple-500 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded absolute right-2"
          >
            Talk
          </button>
        )}
      </li>
    </>
  );
};

export default UserComponent;
