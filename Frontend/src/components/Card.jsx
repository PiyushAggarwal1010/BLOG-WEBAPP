import React from "react";
import { Link } from "react-router-dom";

const Card = ({ data }) => {
  return (
    <Link to={`/post/${data._id}`} className="block">
      <div className="bg-gray-800 text-white rounded-lg p-4 m-3 shadow-md ">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">
          {data.title}
        </h3>

        <p className="text-gray-300 mb-3 line-clamp-3 overflow-hidden">
          {data.content}
        </p>

        {data.author &&
          <div className="text-sm text-gray-400">
            Author: {data.author.username}
          </div>
        }
      </div>
    </Link >
  );
};

export default Card;