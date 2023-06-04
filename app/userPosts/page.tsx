import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="flex-1 bg-blue-600">
      <h1>Only authenticated users should access this page</h1>
    </div>
  );
}
