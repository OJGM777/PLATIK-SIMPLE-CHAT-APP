import { useEffect, useRef, useState } from "react";
import { handleDelete } from "../handlers/messagehandlers.js";

const OptionMessageMenu = ({
  position,
  messageId,
  chatId,
  toUpdateVar,
  isImage,
  toOpenMenu,
  token,
}) => {

  const menuRef = useRef(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);


  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const menuRect = menu.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();


    let newX = position.x;
    let newY = position.y;

    
    if (menuRect.right > bodyRect.right) {
      newX = Math.max(bodyRect.right - menuRect.width, 0);
    }

    
    if (menuRect.bottom > bodyRect.bottom) {
      newY = Math.max(bodyRect.bottom - menuRect.height, 0);
    }

    
    if (menuRect.left < bodyRect.left) {
      newX = 0;
    }

    
    if (menuRect.top < bodyRect.top) {
      newY = 0;
    }

    setAdjustedPosition({ x: newX, y: newY });
  }, [position]);


  const handleUpdate = async () => {
    toUpdateVar(true);
    toOpenMenu(false);
  };

  return (
    <>
      <ul
        ref={menuRef}
        className={`absolute z-50 dark:bg-slate-500 text-black dark:text-white bg-slate-200 rounded-md list-none p-2 shadow-lg`}
        style={{
          top: adjustedPosition.y,
          left: adjustedPosition.x,
        }}
      >
        {!isImage && (
          <li
            onClick={handleUpdate}
            className="py-1 px-2 hover:bg-blue-400 bg-opacity-60 rounded-md  cursor-pointer"
          >
            Update
          </li>
        )}
        <li
          onClick={() => handleDelete(messageId, chatId, toOpenMenu, token)}
          className="py-1 px-2 hover:bg-red-400 bg-opacity-60 rounded-md  cursor-pointer"
        >
          Delete
        </li>
      </ul>
    </>
  );
};

export default OptionMessageMenu;
