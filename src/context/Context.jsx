import { createContext } from "react";
import runChat from "../config/gemini";
import { useState } from "react";
export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState();

  const delayPara = (index, nextWord) => {
    setTimeout(function name(params) {
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

    let finalPrompt = prompt !== undefined ? prompt : input;
    setRecentPrompt(finalPrompt);
    setPrevPrompts((prev) => {
      if (!prev.includes(finalPrompt)) {
        return [...prev, finalPrompt];
      }
      return prev;
    });

    let response = await runChat(finalPrompt);

    let responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }

    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split("");

    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + "");
    }

    setResultData(newResponse2);
    setLoading(false);
    setInput("");
  };

  // ✅ Call this in useEffect or make it conditional to avoid infinite calls
  //   onSent("what is react.js?");

  const contextValue = {
    onSent,
    prevPrompts,
    setPrevPrompts,
    recentPrompt,
    showResult,
    loading,
    resultData, // <-- fixed name
    input,
    setInput,
    newChat,
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
