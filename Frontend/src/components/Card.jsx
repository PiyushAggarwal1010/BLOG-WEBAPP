import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const Card = ({ data }) => {

  const date = new Date(data.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link to={`/post/${data._id}`} className="block h-full">
      <div className="bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 rounded-xl p-6 border-2 shadow-sm border-stone-200 dark:border-stone-700 hover:shadow-md hover:border-stone-300 dark:hover:border-stone-500 transition-all h-full flex flex-col">
        {data.image?.url && (
          <img
            src={data.image.url}
            alt="post"
            className="w-full h-40 object-contain rounded-xl mb-3"
          />
        )}
        <h3 className={`font-bold text-stone-900 dark:text-white leading-snug wrap-break-word ${data.image?.url ? "text-lg line-clamp-2 mb-3" : "text-xl line-clamp-3 mb-5"
          }`}>
          {data.title}
        </h3>

        <div className={`prose prose-sm prose-stone dark:prose-invert max-w-none text-stone-600 dark:text-stone-400 mb-6 min-h-15 leading-relaxed wrap-break-word ${data.image?.url ? "line-clamp-3" : "line-clamp-5"
          }`}>
          <ReactMarkdown
            components={{
              // making the links inside card content non clickable to prevent error as card is also a link
              a: ({ node, ...props }) => <span className="text-rose-600 dark:text-rose-400 font-medium" {...props} />
            }}
          >
            {data.content}
          </ReactMarkdown>
        </div>

        <div className="mt-auto">
          <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400 mb-1 ">

            <div className="flex items-center gap-1">
              <FaHeart className="text-red-500 dark:text-red-500 text-base" />
              <span>{data.likesCount || 0}</span>
            </div>

            <div className="flex items-center gap-1">
              <FaComment className="text-base" />
              <span>{data.commentsCount || 0}</span>
            </div>

          </div>
          {data.author &&
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-stone-300 dark:bg-stone-700 flex items-center justify-center font-semibold text-xs text-stone-700 dark:text-stone-200">
                  {data.author?.username?.charAt(0).toUpperCase()}
                </div>

                <span className="font-medium capitalize text-stone-700 dark:text-stone-300">
                  {data.author?.username}
                </span>
              </div>

              <span className="text-stone-400 dark:text-stone-500">
                {date}
              </span>
            </div>
          }
        </div>

      </div>
    </Link >
  );
};

export default Card;