import React from "react";

const LoadScreen = ({ message }) => {
  return (
  <>
    <div className="fixed inset-0 w-screen flex flex-col h-screen justify-center bg-black opacity-70 z-[60]">
      <div className="m-auto flex gap-4 flex-col">
        <div className="loader"></div>
        <p className=" text-xl text-white">{message}</p>
      </div>
    </div>
  </>
  );
};
export default LoadScreen;
