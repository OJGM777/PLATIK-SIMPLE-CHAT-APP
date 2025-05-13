import React from "react";

const PreviewImage = ({ src, cancelFunct, setter }) => {
  return (
    <div className="flex relative">
      <img
        src={src}
        alt="SELECTED IMAGE"
        onClick={() => setter(src)}
        className="rounded-md max-w-[280px] max-h-[280px] border-[3px] border-purple-800 "
      />
      <span onClick={cancelFunct} className="absolute bottom-[99%] border-gray-300 border cursor-pointer h-5 w-5 flex justify-center items-center rounded-full bg-red-600 left-[100%]">
        <p className="mb-[1px] ml-[1px]">x</p>
      </span>
    </div>
  );
};

export default PreviewImage;
