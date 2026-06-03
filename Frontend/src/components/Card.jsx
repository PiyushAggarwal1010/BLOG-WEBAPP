import React from "react";

const Card = ({data}) => {
  return (
    <div className="bg-gray-800 text-white rounded-lg p-4 m-3 shadow-md">
      <h3 className="text-xl font-bold mb-2">
        {data.title}
      </h3>

      <p className="text-gray-300 mb-3">
        {data.content}
      </p>

      <div className="text-sm text-gray-400">
        Author: {data.author?.username}
      </div>
    </div>
  );
};

export default Card;