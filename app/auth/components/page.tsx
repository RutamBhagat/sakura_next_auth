import React from "react";

type Props = { imageSrc: string };

export default function ZoomingBackground({ imageSrc }: Props) {
  return (
    <div className="group relative items-center justify-center m-3 overflow-hidden shadow-xl rounded-2xl w-1/2 hidden md:flex">
      <img
        src={imageSrc}
        className="absolute w-full h-full transition-all duration-500 ease-in-out transform object-center object-cover hover:scale-150 group-hover:scale-150"
      ></img>
      <h1 className="absolute cursor-default text-5xl font-black transition-all duration-500 ease-in-out transform scale-150 text-gray-50 opacity-60 text-center hover:scale-100 group-hover:scale-100">
        NORD
        <br />
        STONE
      </h1>
    </div>
  );
}
