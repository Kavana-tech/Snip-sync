import React, { useState } from "react";

const TAG_OPTIONS = [
    "syntax", "syntax-correction", "log", "print", "debug", "error-handling",
    "api-call", "unit-test", "optimization", "react", "nodejs", "template",
    "pattern", "refactor", "console", "validation", "data-structure", "parsing",
    "best-practice", "performance", "test-case", "mock", "encryption", "auth",
    "render", "component", "form", "input-validation", "output", "display",
    "typescript", "python", "java", "express", "caching", "Add your own tag"
];

function TagSelectField({ value, onChange }) {
    const [customTag, setCustomTag] = useState("");
    const [showCustomTagInput, setShowCustomTagInput] = useState(false);

    const handleTagClick = (tag) => {
        if (tag === "Add your own tag") {
            setShowCustomTagInput(true);
            return;
        }
        if (value.includes(tag)) {
            onChange(value.filter(t => t !== tag));
        } else {
            onChange([...value, tag]);
        }
    };

    const handleCustomTagAdd = () => {
        const trimmed = customTag.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
        }
        setCustomTag("");
        setShowCustomTagInput(false);
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mt-4">
                {TAG_OPTIONS.map(option => (
                    <button
                        key={option}
                        type="button"
                        className={`px-4 py-2 rounded-md ${value.includes(option)
                                ? "bg-cyan-700 text-white"
                                : "bg-cyan-900 text-white"
                            }`}
                        onClick={() => handleTagClick(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {showCustomTagInput && (
                <div className="flex mt-4 gap-2">
                    <input
                        type="text"
                        value={customTag}
                        onChange={e => setCustomTag(e.target.value)}
                        placeholder="Enter your custom tag"
                        className="border-2 border-gray-700 p-2 rounded-md bg-gray-900 text-white"
                    />
                    <button
                        type="button"
                        onClick={handleCustomTagAdd}
                        className="bg-cyan-900 text-white px-3 py-1 rounded"
                    >
                        Add
                    </button>
                </div>
            )}
            {/* Show selected tags as chips */}
            <div className="flex flex-wrap gap-2 mt-2">
                <p>Tags: </p>
                {value.map(tag => (
                    <span
                        key={tag}
                        className="bg-cyan-700 text-white px-2 py-1 rounded-full text-xs cursor-pointer"
                        title="Click to remove"
                        onClick={() => onChange(value.filter(t => t !== tag))}
                    >
                        {tag} &times;
                    </span>
                ))}
            </div>
        </div>
    );
}

export default TagSelectField;