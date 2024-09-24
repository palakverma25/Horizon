import { createContext, useState } from "react";
import run from "../config/horizon.js";

export const Context = createContext();

const ContextProvider = ({ children }) => { // Destructure children directly
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompt, setPreviousPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    let response;
    try {
      if (prompt && prompt.trim()) {
        response = await run(prompt);
        setRecentPrompt(prompt);
      } else if (input.trim()) {
        setPreviousPrompt((prev) => [input, ...prev]);
        setRecentPrompt(input);
        response = await run(input);
      } else {
        setLoading(false);
        return;
      }

      let responseArray = response.split("**");
      let newArray = responseArray
        .map((item, i) => (i % 2 === 1 ? `<b>${item}</b>` : item))
        .join("");

      let newArray2 = newArray.split("*").join("</br>");
      let newResponseArray = newArray2.split(" ");
      newResponseArray.forEach((nextWord, i) => delayPara(i, nextWord + " "));
    } catch (error) {
      console.error("Error in onSent:", error);
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    previousPrompt,
    setPreviousPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {children} {/* Correctly using children here */}
    </Context.Provider>
  );
};

export default ContextProvider;
