import React from "react";

interface CardProps {
  title: string;
  description: string;
  size?: "small" | "medium" | "large";
  primary?: boolean;
  onClick?: () => void;
}

export const Card = ({ primary, size, title, description }: CardProps) => {
  const mode = primary ? "bg-sky-200" : "bg-white";

  console.log(mode);

  let sizeClasses;
  switch (size) {
    case "small":
      sizeClasses = "w-32 h-32";
      break;
    case "medium":
      sizeClasses = "w-64 h-64";
      break;
    case "large":
      sizeClasses = "w-96 h-96";
      break;
    default:
      sizeClasses = "";
  }

  console.log(size);

  return (
    <div
      className={`${mode} ${sizeClasses} flex flex-col p-2 border-4  border-gray-300`}
    >
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};
