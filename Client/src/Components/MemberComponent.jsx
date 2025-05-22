import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleCreateDualChat, handleRemoveUsersFromGroup } from "../handlers/chatHandlers";
import ProfileInfo from "./ProfileInfo";

const MemberComponent = ({
  openVar,
  closeProfileVar,
  closeInfo,
  memberUser,
  image,
  name,
  profileId,
  Id,
  dispatch,
  waitVar,
}) => {
  const activeChat = useSelector((state) => state.activeChat);
  const userProfile = useSelector((state) => state.userInfo);
  const token = useSelector((state) => state.tokenInfo);
  const fontSize = useSelector((state) => state.fontSize);
  const navigate = useNavigate();
  return (
    <>
      {openVar && (
        <ProfileInfo id={Id} closeVar={() => closeProfileVar(null)} />
      )}
      <li
        key={Id}
        onClick={() => closeProfileVar(Id)} 
        className="flex cursor-pointer relative items-center gap-2 p-2 dark:bg-gray-800 bg-gray-300 rounded-md"
      >
        <img
          src={image || "https://via.placeholder.com/40"}
          alt={name || "User"}
          className="w-10 h-10 rounded-full"
        />
        <p className={fontSize}>{name || "Anonymous"}</p>
        {profileId === Id ? (
          <span
            className={`${fontSize} bg-purple-500 text-gray-700 px-1 py-1 rounded absolute right-2 `}
          >
            You
          </span>
        ) : activeChat.data.isGroupChat ? (
          <button
            onClick={async (e) => {
              e.stopPropagation();
              await handleCreateDualChat(
                memberUser,
                userProfile,
                token,
                navigate,
                dispatch,
                waitVar
              );
              closeInfo(false);
            }}
            className={`bg-purple-500 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded absolute right-2 ${fontSize}`}
          >
            Talk
          </button>
        ) : null}
        {activeChat?.data?.ChatAdmin === userProfile.id &&
        activeChat?.data?.isGroupChat &&
        userProfile.id !== Id ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              return handleRemoveUsersFromGroup(
                activeChat.data.id,
                Id,
                token,
                dispatch
              ); 
            }}
            className={`bg-red-500 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded absolute right-20 ${fontSize}`}
          >
            Kick
          </button>
        ) : null}
      </li>
    </>
  );
};

export default MemberComponent;
