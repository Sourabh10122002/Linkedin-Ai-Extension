import React, { useState, useRef, useEffect } from "react";
import arrowImg from "data-base64:~assets/arrow.svg";
import downImg from "data-base64:~assets/down.svg";
import circleImg from "data-base64:~assets/circle.svg";

export const Modal = ({ onClose, setInputValue, inputValue, messages, setMessages, setAiGeneratedMessage, setShowInsertButton, showInsertButton, setIsTyped }) => {
  const [generateClicked, setGenerateClicked] = useState(false);
  const modalRef = useRef(null);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGenerate = () => {
    setMessages((prevMessages) => [...prevMessages, { text: inputValue, sender: "User" }]);
    setInputValue("");
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.", sender: "AI" },
      ]);
      setShowInsertButton(true);
      setGenerateClicked(true);
    }, 1000);
  };

  useEffect(() => {
    if (messages.length > 0) {
      console.log(messages[messages.length - 1]?.text);
    }
  }, [messages]);

  console.log(messages[messages.length - 1]?.text);

  const handleInsertClick = () => {
    setAiGeneratedMessage(messages[messages.length - 1]?.text);
    setMessages([]);
    setIsTyped(true);
    setShowInsertButton(false);
    onClose();
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50" onClick={handleClickOutside}>
      <div ref={modalRef} className="bg-white p-8 w-[400px] rounded shadow-lg">
        <div className="mb-4 space-y-2 flex flex-col">
          {messages.map((message, index) => (
            <p
              key={index}
              className={`p-2 rounded ${message.sender === "User"
                ? "bg-[#dfe1e7] text-[#666D80] w-fit max-w-[220px] pt-2 pb-2 pr-1 pl-1 self-end"
                : "bg-[#DBEAFE] text-[#666D80] max-w-[220px] w-fit pt-2 pb-2 pr-1 pl-1 self-start"
                }`}
            >
              {message.text}
            </p>
          ))}
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Your prompt"
          className="border p-2 mb-4 w-full"
        />
        <div className="flex justify-end">
          {showInsertButton && (
            <button
              onClick={handleInsertClick}
              className="bg-white text-gray-[#666D80] p-2 border-solid flex items-center border mr-2 border-[#666D80] rounded"
            >
              <img src={downImg} className="w-[12px] mr-2" /> Insert
            </button>
          )}
          <button
            onClick={handleGenerate}
            className={`bg-blue-500 text-white p-2 rounded mr-2 flex items-center ${generateClicked ? "cursor-not-allowed" : ""}`}
            disabled={generateClicked}
            style={{ cursor: generateClicked ? "not-allowed" : "pointer" }}
          >
            {generateClicked ? <><img src={circleImg} className="w-[12px] mr-2" /> Regenerate</> : <><img src={arrowImg} className="w-[12px] mr-2" /> Generate</>}
          </button>
        </div>
      </div>
    </div>
  );
};