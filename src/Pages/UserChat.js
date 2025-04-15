import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { generateResponse } from "../config/gemini";
import { FaUserCircle, FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import SideBar from '../Pages/SideBar';

import '../CSS/output.css';

const UserChat = () => {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleInitialMessage(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chat-messages')) || [];
    setMessages(storedMessages);
  }, []);

  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages));
  }, [messages]);

  const saveChatHistory = (messagesToSave) => {
    if (!messagesToSave.length) return;

    const summaries = JSON.parse(localStorage.getItem('chatSummaries')) || [];
    const newSummary = {
      title: messagesToSave[0]?.text || 'chat',
      lastMessage: messagesToSave[messagesToSave.length - 1]?.text || [],
      timeStamp: new Date().toISOString(),
      messages: messagesToSave,
    };

    const isDuplicate = summaries.some(
      (summary) =>
        summary.timeStamp === newSummary.timeStamp &&
        summary.title === newSummary.title
    );

    if (!isDuplicate) {
      summaries.push(newSummary);
      localStorage.setItem("chatSummaries", JSON.stringify(summaries));
    }
  };

  const handleInitialMessage = async (message) => {
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => {
      const updated = [...prev, userMessage];
      localStorage.setItem('chat-messages', JSON.stringify(updated));
      return updated;
    });

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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => {
        const updated = [...prev, botMessage];
        saveChatHistory(updated);
        return updated;
      });
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => {
        const updated = [...prev, errorMessage];
        localStorage.setItem('chat-messages', JSON.stringify(updated));
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && !isLoading) {
      const messageToSend = newMessage;
      const userMessage = {
        id: Date.now(),
        text: messageToSend.trim(),
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages(prev => {
        const updated = [...prev, userMessage];
        saveChatHistory(updated);
        return updated;
      });

      setNewMessage("");
      await getAIResponse(messageToSend);
    }
  };

  const handleChatHistoryClick = (messagesFromSummary) => {
    setMessages(messagesFromSummary);
  };

  const handleClearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem('chat-messages');
    localStorage.removeItem('chatSummaries');
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
            h1: ({ children }) => <h1 className="text-2xl font-bold my-4 text-gray-900">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold my-3 text-gray-800">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-bold my-2 text-gray-700">{children}</h3>,
            p: ({ children }) => <p className="my-2 text-gray-700">{children}</p>,
            ul: ({ children }) => <ul className="list-disc ml-4 my-2 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal ml-4 my-2 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="my-1 text-gray-700 text-justify">{children}</li>,
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
      <SideBar
        isOpen={sidebarOpen}
        onChatHistoryClick={handleChatHistoryClick}
        onClearChatHistory={handleClearChatHistory}
      />

      <div className="pt-24 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 sm:p-6 overflow-y-auto min-h-[600px] sm:h-[calc(100vh-220px)]">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-20">Start New Chat!!</p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col">
                <div className={`flex items-center gap-2 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                  {message.sender === "user" ? (
                    <>
                      <div className="icon-wrapper">
                        <FaUserCircle className="text-2xl text-blue-500 w-8 h-8 flex items-center justify-center" />
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="max-w-[80%] sm:max-w-[70%] md:max-w-[75%] lg:max-w-[80%] bg-blue-500 text-white text-justify p-3 rounded-lg">
                          <MessageContent text={message.text} sender={message.sender} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-center w-full mb-4">
                          {message.timestamp}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="icon-wrapper">
                        <FaRobot className="text-2xl text-gray-600 w-8 h-8 flex items-center justify-center" />
                      </div>
                      <div className="flex flex-col items-start">
                        <div className="max-w-[90%] sm:max-w-[70%] md:max-w-[75%] lg:max-w-[90%] bg-gray-100 text-gray-800 p-3 text-justify rounded-lg">
                          <MessageContent text={message.text} sender={message.sender} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-center w-full mb-4">
                          {message.timestamp}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2 animate-fadeIn">
              <FaRobot className="text-2xl text-gray-600" />
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%] sm:max-w-[70%] md:max-w-[75%] lg:max-w-[80%]">
                <p className="text-sm text-gray-600">Thinking...</p>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="flex flex-col sm:flex-row items-stretch gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`p-3 bg-blue-500 text-white rounded-lg text-base transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserChat;
