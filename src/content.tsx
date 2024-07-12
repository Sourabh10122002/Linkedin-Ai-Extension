import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";
import React, { useState, useEffect } from "react";
import imageUrl from "data-base64:~assets/frame.svg";

import { Modal } from "~features/Modal";

export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"],
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

const PlasmoOverlay = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyped, setIsTyped] = useState(false);
  const [aiGeneratedMessage, setAiGeneratedMessage] = useState("");
  const [showInsertButton, setShowInsertButton] = useState(false);

  useEffect(() => {
    if (isTyped) {
      const target = document.querySelector(".msg-form__contenteditable") as HTMLElement;
      if (target) {
        target.focus();
        setTimeout(() => {
          const isTextEntered = document.execCommand("insertText", false, aiGeneratedMessage);
          console.log(isTextEntered);
        }, 1000);
      }
    }
  }, [isTyped]);

  useEffect(() => {
    const addButtonToTarget = (target) => {
      if (target) {
        if (!document.querySelector("#customButton")) {
          const icon = document.createElement("img");
          icon.id = "customButton";
          icon.src = imageUrl;
          icon.style.position = "absolute";
          icon.style.cursor = "pointer";
          icon.style.width = "28px";
          icon.style.bottom = "5px";
          icon.style.right = "5px";
          icon.onclick = () => setIsModalOpen(true);

          target.appendChild(icon);
        }
      }
    };

    const removeButtonFromTarget = () => {
      const existingIcon = document.querySelector("#customButton");
      if (existingIcon) {
        existingIcon.remove();
      }
    };

    const target = document.querySelector(".msg-form__contenteditable") as HTMLElement;
    if (target) {
      target.addEventListener("click", () => addButtonToTarget(target));
    }

    const handleClickOutside = (event) => {
      const target = document.querySelector(".msg-form__contenteditable") as HTMLElement;
      if (target && !target.contains(event.target)) {
        removeButtonFromTarget();
      }
    };

    document.addEventListener("click", handleClickOutside);

    const observer = new MutationObserver(() => {
      const newTarget = document.querySelector(".msg-form__contenteditable") as HTMLElement;
      if (newTarget) {
        newTarget.addEventListener("click", () => addButtonToTarget(newTarget));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (target) {
        target.removeEventListener("click", () => addButtonToTarget(target));
      }
      document.removeEventListener("click", handleClickOutside);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="z-50 flex fixed top-32 right-8">
      {isModalOpen && (
        <Modal
          setInputValue={setInputValue}
          inputValue={inputValue}
          messages={messages}
          setMessages={setMessages}
          setAiGeneratedMessage={setAiGeneratedMessage}
          setShowInsertButton={setShowInsertButton}
          showInsertButton={showInsertButton}
          setIsTyped={setIsTyped}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PlasmoOverlay;