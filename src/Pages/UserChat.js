import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { generateResponse } from "../config/gemini";
import Hamburger from "hamburger-react";
import { FaUserCircle, FaRobot } from "react-icons/fa";
import SideBar from "./SideBar";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const UserChat = () => {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSideBarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleInitialMessage(initialMessage);
    }
  }, [initialMessage]);

  const toggleSideBar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleInitialMessage = async (message) => {
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([userMessage]);
    setNewMessage("");
    await getAIResponse(message);
  };

  const getAIResponse = async (message) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const aiResponse = await generateResponse(message);
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((currentMessages) => {
        const isDuplicate = currentMessages.some(
          (msg) => msg.sender === "bot" && msg.text === aiResponse
        );
        if (isDuplicate) return currentMessages;
        return [...currentMessages, botMessage];
      });
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((currentMessages) => [...currentMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && !isLoading) {
      const userMessage = {
        id: Date.now(),
        text: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((currentMessages) => [...currentMessages, userMessage]);
      setNewMessage("");
      await getAIResponse(newMessage);
    }
  };

  const MessageContent = ({ text, sender }) => {
    if (sender === "user") {
      return <p className="text-sm whitespace-pre-wrap">{text}</p>;
    }

    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold my-4 text-gray-900">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold my-3 text-gray-800">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-bold my-2 text-gray-700">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="my-2 text-gray-700">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc ml-4 my-2 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal ml-4 my-2 space-y-1">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="my-1 text-gray-700 text-justify">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 my-2 italic text-gray-600 bg-blue-50 p-2 rounded">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            hr: () => <hr className="my-4 border-gray-200" />,
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md p-4">
        <div className="flex justify-between items-center">
          <div className="left relative">
            <Hamburger toggled={isSideBarOpen} toggle={toggleSideBar} />
            {isSideBarOpen && (
              <div className="absolute left-0 top-12 z-50">
                <SideBar />
              </div>
            )}
          </div>
          <h1 className="text-xl font-semibold">User Chat</h1>
          <div className="right">
            <FaUserCircle className="text-2xl" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-[calc(100vh-200px)] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "user" ? (
                  <>
                    <div className="max-w-[70%] rounded-lg p-3 bg-blue-500 text-white">
                      <MessageContent text={message.text} sender={message.sender} />
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp}
                      </span>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <FaUserCircle className="text-2xl text-blue-500" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-shrink-0 mr-2">
                      <FaRobot className="text-2xl text-gray-600" />
                    </div>
                    <div className="max-w-[70%] rounded-lg p-3 bg-gray-100 text-gray-800">
                      <MessageContent text={message.text} sender={message.sender} />
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  <FaRobot className="text-2xl text-gray-600" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                  <p className="text-sm text-gray-600">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`bg-blue-500 text-white p-3 rounded-lg transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
              disabled={isLoading}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserChat;
