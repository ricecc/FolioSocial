import { useState } from "react";
import { Input } from "../ui/input";

interface TagsInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, setTags, placeholder }) => {
  const [input, setInput] = useState<string>("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === " ") && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
        setInput("");
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-2  rounded p-2">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-600"
        >
          <span>{tag}</span>
          <button
            type="button"
            className="ml-2 text-slate-600 focus:outline-none"
            onClick={() => removeTag(index)}
          >
            &times;
          </button>
        </div>
      ))}
      
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TagsInput;
