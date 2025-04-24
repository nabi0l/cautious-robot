import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { generateResponse } from "../config/gemini";
import {
  FaUserCircle,
  FaRobot,
  FaCopy,
  FaShareAlt,
  FaEdit,
} from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { FiSend } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useTheme } from "../Context/ThemeContext";
import { getChatHistory, saveChatHistory } from "../utilis/chatHistory";
import useMediaQuery from "../hooks/useMediaQuery";
import UserAvatar from "../Componets/UserAvatar";

const UserChat = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const initialMessage = location.state?.initialMessage;
  const isNewChat = location.state?.newChat;
  const historyMessages = location.state?.messages;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef(null);
  const isMountedRef = useRef(true);
  const initialRenderRef = useRef(true);
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    if(isNewChat && !initialMessage){
      setMessages([]);
      localStorage.removeItem('chat-messages');
      return;
    }

    if (historyMessages) {
      setMessages(historyMessages);
      return;
    }

    // const storedMessages =
    //   JSON.parse(localStorage.getItem("chat-messages")) || [];

    
      if (initialMessage) {
        const userMessage = {
          id: Date.now(),
          text: initialMessage,
          sender: "user",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        };
        setMessages([userMessage]);
        getAIResponse(initialMessage);
        return;
      }
      const storedMessages=JSON.parse(localStorage.getItem('chat-messages'))||[];
      setMessages(storedMessages);

    return () => {
      isMountedRef.current = false;
    };
  }, [initialMessage, isNewChat, historyMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat-messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  const getAIResponse = async (message) => {
    if (!isMountedRef.current || isLoading) return;

    setIsLoading(true);
    try {
      const aiResponse = await generateResponse(message);

      if (!isMountedRef.current) return;

      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };

      setMessages((prev) => {
        const updated = [...prev, botMessage];
        const summary = {
          title: messages.length === 0 ? message.substring(0, 30) : "",
          lastMessage: aiResponse,
          timeStamp: new Date().toISOString(),
          messages: updated,
        };
        saveChatHistory(summary);
        window.dispatchEvent(new Event("storage"));
        return updated;
      });
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && !isLoading) {
      const userMessage = {
        id: Date.now(),
        text: newMessage.trim(),
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };

      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");
      await getAIResponse(newMessage);
    }
  };

  const handleCopy = (text, messageId) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const handleShare = async (text) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Chat Message",
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard - sharing not supported");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleEditStart = (message) => {
    setEditingMessageId(message.id);
    setEditText(message.text);
  };

  const handleEditSave = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, text: editText } : msg
      )
    );
    setEditingMessageId(null);
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  const MessageContent = ({ text, sender }) => {
    if (sender === "user") {
      return <p className="text-sm whitespace-pre-wrap">{text}</p>;
    }

    return (
      <div className="dark:prose-invert prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-xl sm:text-2xl font-bold my-3 sm:my-4"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-lg sm:text-xl font-bold my-2 sm:my-3"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-base sm:text-lg font-bold my-2" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="my-2 sm:my-3 text-justify" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-5 my-2 sm:my-3" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-5 my-2 sm:my-3" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="my-1 text-justify" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a
                className="text-blue-600 dark:text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <div className="my-3 rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    style={theme === "dark" ? vscDarkPlus : vs}
                    language={match[1]}
                    PreTag="div"
                    showLineNumbers={true}
                    wrapLines={true}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code
                  className={`bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded ${
                    className || ""
                  }`}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-2 sm:my-3 italic"
                {...props}
              />
            ),
            hr: ({ node, ...props }) => (
              <hr
                className="my-3 sm:my-4 border-gray-200 dark:border-gray-700"
                {...props}
              />
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-16 bg-[#F2F9FF] dark:bg-[#2D4356] text-gray-900 dark:text-gray-100">
      <div className={`px-4 sm:px-8 max-w-6xl mx-auto ${isMobile ? "pb-20 pt-4" : "pt-4"}`}>
        {/* Chat Area */}
        <div
          className={`bg-[#F2F9FF] dark:bg-[#1E2A3A] border border-[#2D4356] dark:border-[#053B50] rounded-xl p-4 mb-4 sm:p-6 overflow-y-auto ${
            isMobile
              ? "min-h-[calc(100vh-180px)]"
              : "min-h-[calc(100vh-180px)] sm:h-[calc(100vh-220px)]"
          }`}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-[#053B50] dark:text-[#EEEEEE]">
                Start a conversation with your AI assistant
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex ${
                      message.sender === "user" ? "flex-row-reverse" : ""
                    } ${isMobile ? "max-w-[90%]" : "max-w-[80%]"}`}  
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {message.sender === "user" ? (
                        <UserAvatar size={8} />
                      ) : (
                        <div className="p-1 rounded-full border border-[#053B50] dark:border-[#EEEEEE] bg-white/50 dark:bg-[#1E2A3A]/50">
                          <FaRobot className="text-2xl text-[#053B50] dark:text-[#EEEEEE] w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div
                      className={`mx-2 flex flex-col ${
                        message.sender === "user" ? "items-end" : "items-start"
                      } w-full`}
                    >
                      <div
                        className={`p-3 sm:p-4 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-[#EEEEEE] dark:bg-[#053B50] border border-[#2D4356] dark:border-[#EEEEEE]"
                            : "bg-[#EEEEEE] dark:bg-[#053B50] border border-[#2D4356] dark:border-[#EEEEEE] max-w-[90%]"  
                        }`}
                      >
                        {editingMessageId === message.id &&
                        message.sender === "user" ? (
                          <div className="flex flex-col gap-2 w-full">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-3 text-black dark:text-white bg-white dark:bg-[#2D4356] rounded-lg border border-[#2D4356] dark:border-[#EFF3EA]"
                              rows={4}
                              autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleEditSave(message.id)}
                                className="px-3 py-1 sm:px-4 sm:py-2 bg-[#053B50] hover:bg-[#042a3a] text-white rounded-lg text-sm sm:text-base"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleEditCancel}
                                className="px-3 py-1 sm:px-4 sm:py-2 bg-[#2D4356] hover:bg-[#1E2A3A] text-white rounded-lg text-sm sm:text-base"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <MessageContent
                            text={message.text}
                            sender={message.sender}
                          />
                        )}
                      </div>

                      {/* Message Meta */}
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-[#053B50] dark:text-[#EEEEEE]">
                          {message.timestamp}
                        </span>
                        {message.sender === "bot" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleCopy(message.text, message.id)
                              }
                              className="text-[#053B50] hover:text-[#042a3a] dark:text-[#EEEEEE] dark:hover:text-[#c8d6c3] transition-colors relative"
                              title="Copy to clipboard"
                            >
                              <FaCopy className="w-3 h-3" />
                              {copiedMessageId === message.id && (
                                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#053B50] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                  Copied!
                                </span>
                              )}
                            </button>
                            <button
                              onClick={() => handleShare(message.text)}
                              className="text-[#053B50] hover:text-[#042a3a] dark:text-[#EEEEEE] dark:hover:text-[#c8d6c3] transition-colors"
                              title="Share message"
                            >
                              <FaShareAlt className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {message.sender === "user" && (
                          <button
                            onClick={() => handleEditStart(message)}
                            className="text-[#053B50] hover:text-[#042a3a] dark:text-[#EEEEEE] dark:hover:text-[#c8d6c3] transition-colors"
                            title="Edit message"
                          >
                            <FaEdit className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex items-start gap-2 mb-4">
              <div className="p-1 rounded-full border border-[#053B50] dark:border-[#EEEEEE] bg-white/50 dark:bg-[#1E2A3A]/50">
                <FaRobot className="text-2xl text-[#053B50] dark:text-[#EEEEEE] w-6 h-6" />
              </div>
              <div className="p-4 max-w-[85%]">  {/* Changed from 80% to 75% */}
                <div className="flex items-center gap-2">
                  <ImSpinner8 className="animate-spin text-[#053B50] dark:text-[#EEEEEE]" />
                  <p className="text-sm text-[#053B50] dark:text-[#EEEEEE]">
                    Generating response...
                  </p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="relative mt-4 mb-6 sm:mb-0"
        >
          <div className="flex items-center bg-[#EEEEEE] dark:bg-[#1E2A3A] rounded-xl border border-[#2D4356] dark:border-[#053B50] overflow-hidden">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 p-3 sm:p-4 pr-14 sm:pr-16 focus:outline-none bg-transparent text-black dark:text-white resize-none min-h-[60px] max-h-[120px]"
              rows={1}
              disabled={isLoading}
            />

            <button
              type="submit"
              className={`absolute right-2 bottom-2 p-2 bg-[#053B50] hover:bg-[#042a3a] text-white rounded-full ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserChat;