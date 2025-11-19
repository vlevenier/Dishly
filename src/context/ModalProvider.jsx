import { useState, useCallback } from "react";
import { ModalContext } from "./ModalContext";

export default function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [options, setOptions] = useState({});

  const showModal = useCallback((content, options = {}) => {
    setContent(content);
    setOptions(options);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setContent(null);
    setOptions({});
  }, []);

  return (
    <ModalContext.Provider
      value={{ isOpen, content, options, showModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}
