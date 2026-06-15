import React from "react";
import { Link } from "react-router-dom";

const Card = ({ data }) => {
  return (
    <Link to={`/post/${data._id}`} className="block h-full">
      <div className="bg-white text-stone-800 rounded-xl p-6 border-2 shadow-sm border-stone-200 hover:shadow-md hover:border-stone-300 transition-all h-full flex flex-col">
        {data.image?.url && (
          <img
            src={data.image.url}
            alt="post"
            className="w-full h-40 object-cover rounded-xl mb-3"
          />
        )}
        <h3 className="text-lg font-bold mb-3 line-clamp-2 text-stone-900 leading-tight">
          {data.title}
        </h3>

        <p className="text-stone-600 mb-6 line-clamp-3 overflow-hidden text-sm leading-relaxed grow">
          {data.content}
        </p>

        {data.author &&
          <div className="text-xs font-medium text-stone-500 uppercase mt-auto pt-4 border-t border-stone-100">
            By {data.author.username}
          </div>
        }
      </div>
    </Link >
  );
};

export default Card;