import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmojisToUse } from "../store/chatSlice";

const EmojiContainer = ({ setMessageContent }) => {
  const emojiList = useSelector((state) => state.emojisToUse);
  const dispatch = useDispatch();
  const [searchResult, setSearchResult] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const fetchEmojis = async () => {
      const response = await fetch(
        `https://emoji-api.com/emojis?access_key=f0edc4882d8199835f4475575519d626f80d4309`
      );
      const data = await response.json();
      dispatch(setEmojisToUse({ emojis: data }));
    };

    if (emojiList.length < 1) {
      fetchEmojis();
    }
  }, []);



  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 100); 

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const filteredEmojis = emojiList.filter((emoji) => {
      return emoji.slug.toLowerCase().includes(debouncedQuery.toLowerCase());
    });

    setSearchResult(filteredEmojis);
  }, [debouncedQuery]);

  return (
    <>
     
        <div className="absolute min-w-[30%] max-w-[30%] left-[5%] max-lg:min-w-[80%] max-lg:max-w-[80%] bottom-[8vh] h-[300px] max-h-[720px] overflow-auto flex flex-col gap-2 items-center  min-h-[70%] dark:bg-gray-900 bg-gray-300  p-2 rounded-xl">
          <nav className="w-full ">
            <input
              type="text"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Search An Emoji"
              className="dark:bg-gray-700 text-gray-800 bg-gray-500 p-2 border w-full border-gray-500 rounded-xl dark:text-white"
            />
          </nav>
          <div className="dark:bg-gray-700 text-gray-800 bg-gray-500 w-full overflow-y-auto min-h-[80%] p-2 rounded-xl grid grid-cols-6 overflow-x-hidden max-lg:grid-cols-5 gap-2 justify-center">
            {emojiList.length === 0
              ? Array.from({ length: 30 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-8 w-8 bg-gray-600 rounded-full animate-pulse"
                  />
                ))
              : (searchResult.length > 0 ? searchResult : emojiList).map(
                  (emoji, index) => (
                    <span
                      key={index}
                      onClick={() => {
                        setMessageContent((prev) => prev + emoji.character);
                      }}
                      className="text-[24px] cursor-pointer rounded-full px-2 transition-colors"
                    >
                      {emoji.character}
                    </span>
                  )
                )}
          </div>
        </div>
    </>
  );
};

export default EmojiContainer;
