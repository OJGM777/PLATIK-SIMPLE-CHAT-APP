import  { useEffect, useState } from "react";
import { searchUser } from "../API/SearchCalls.js";
import UserComponent from "../Components/UserComponent.jsx";
import SkeletonLoader from "../Skeletons/SkeletonLoader.jsx";
import { useSelector } from "react-redux";

const AddUser = ({ userAdder, section, toAddMoreUsers}) => {
  const [users, setUsers] = useState([]);
  const [selectUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fontSize = useSelector((state) => state.fontSize);
  const token = useSelector((state) => state.tokenInfo);
  const userInfo = useSelector((state) => state.userInfo);


  const searchUsers = async (keyword) => {
    setIsLoading(true);
    try {
      if (keyword.trim().length < 3) return;
      const results = await searchUser(keyword, token);
      setUsers(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterArray = () => {
    setSelectedUsers((prevItems) =>
      prevItems.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id) // Filtra únicos
      )
    );
  };

  useEffect(() => {
    userAdder( [...selectUsers.map((el) => el.id)]);
  }, [selectUsers])

  const UserTag = ({ userName, userId }) => {
    return (
      <div  className="flex p-2 text-nowrap align-middle text-sm gap-2 rounded-md bg-purple-400  text-white">
        <p>{userName}</p>{" "}
        <button
          onClick={() => {
            setSelectedUsers((prev) =>
              prev.filter((user) => user.id !== userId)
            );
          }}
          className="text-[9px] h-[6px] rounded-full w-[11px]"
        >
          X
        </button>{" "}
      </div>
    );
  };

  return (
    <div className={`mb-4 w-[98%] ${toAddMoreUsers ? "" : window.innerWidth < 1020 ? section === 1 ? '':'hidden'  : ""}`}>
      <label className={`block ${fontSize} font-medium dark:text-white`}>Add users</label>
      <input
        type="text"
        placeholder="Search by Email..."
        className={`mt-1 block ${fontSize} w-full px-3 py-2 border dark:border-gray-900 dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 `}
        onChange={(e) => searchUsers(e.target.value)}
      />
      {/* MEMBERS LIST  */}
      <span key={1} className="mt-1 flex gap-3 max-w-full px-3 py-2 bordero overflow-x-scroll bg-gray-200 dark:border-gray-900 dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        {" "}
        {selectUsers.length < 1 ? (
          <p className={`dark:text-gray-400  text-black ${fontSize}`}>No Users Added</p>
        ) : (
          selectUsers.map((el,index) => (
            <UserTag key={index} userName={el.name} userId={el.id} />
          ))
        )}{" "}
      </span>
      {/* ///////// */}
      <div key={2} className="dark:bg-gray-800 bg-gray-200 max-h-[150px] min-h-[150px] mt-2 overflow-auto rounded-md p-4">
        {isLoading ? (
          <SkeletonLoader />
        ) : users?.length > 0 ? (
          <ul className="space-y-2 ">
            {users.map((user, index) => (
              <UserComponent
                key={index}
                user={user}
                userInfo = {userInfo}
                isToShow={true}
                setter={setSelectedUsers} 
                filter={filterArray}
              />
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 w-full flex flex-col align-middle text-center">
            <br />
            SEARCH USERS
          </p>
        )}
      </div>
    </div>
  );
};

export default AddUser;
