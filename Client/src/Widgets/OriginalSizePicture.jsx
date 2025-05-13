import React from "react";
const OriginalSizePicture = ({ src, setter }) => {
    return (
      <>
        {/* Fondo negro con opacidad */}
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50"
          onClick={() => setter(false)}
        ></div>
  
        {/* Contenedor principal */}
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          onClick={() => setter(false)}
        >
          <img
            src={src}
            alt="Imagen"
            className="rounded-md max-w-full max-h-full"
          />
        </div>
      </>
    );
  };
  
  export default OriginalSizePicture;