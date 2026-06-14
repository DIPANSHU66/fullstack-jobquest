import React, { useState } from "react";

import axios from "axios";

import { motion } from "framer-motion";

import { Bot, Send, X } from "lucide-react";



const AIChatbot = () => {

  const [open, setOpen] = useState(false);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([
      {
        sender: "bot",
        text: "Hi 👋 I'm your AI Career Assistant. Ask me about jobs, resumes, interviews, or career guidance.",
      },
    ]);

  const [loading, setLoading] =
    useState(false);

  const [sessionId, setSessionId] =
    useState("");


  // =====================================
  // Send Message
  // =====================================
  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    const currentMessage = message;

    setMessage("");

    try {

      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/chatbot/chat`,

        {
          message: currentMessage,
          sessionId,
        },

        {
          withCredentials: true,
        }
      );

      setSessionId(res.data.sessionId);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data.reply,
        },
      ]);

    } catch (error) {

      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "AI service unavailable right now.",
        },
      ]);

    } finally {

      setLoading(false);
    }
  };


  return (
    <>

      {/* Floating Button */}
      <motion.button

        whileHover={{ scale: 1.1 }}

        whileTap={{ scale: 0.9 }}

        onClick={() => setOpen(!open)}

        className="
          fixed
          bottom-5
          right-5
          bg-[#6A38C2]
          text-white
          p-4
          rounded-full
          shadow-2xl
          z-50
        "
      >

        {
          open ? (
            <X size={24} />
          ) : (
            <Bot size={24} />
          )
        }

      </motion.button>



      {/* Chat Window */}
      {
        open && (

          <motion.div

            initial={{
              opacity: 0,
              y: 50,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            className="
              fixed
              bottom-24
              right-5
              w-[350px]
              h-[500px]
              bg-white
              rounded-2xl
              shadow-2xl
              border
              flex
              flex-col
              overflow-hidden
              z-50
            "
          >

            {/* Header */}
            <div
              className="
                bg-[#6A38C2]
                text-white
                p-4
                flex
                items-center
                gap-2
                font-semibold
              "
            >
              <Bot size={20} />
              AI Career Assistant
            </div>


            {/* Messages */}
            <div
              className="
                flex-1
                overflow-y-auto
                p-4
                space-y-3
                bg-gray-50
              "
            >

              {
                messages.map((msg, index) => (

                  <div
                    key={index}

                    className={`
                      flex
                      ${
                        msg.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }
                    `}
                  >

                    <div
                      className={`
                        max-w-[80%]
                        px-4
                        py-2
                        rounded-2xl
                        text-sm
                        ${
                          msg.sender === "user"
                            ? "bg-[#6A38C2] text-white"
                            : "bg-white border text-gray-800"
                        }
                      `}
                    >
                      {msg.text}
                    </div>

                  </div>
                ))
              }


              {/* Loading */}
              {
                loading && (
                  <div className="text-sm text-gray-500">
                    AI is typing...
                  </div>
                )
              }

            </div>


            {/* Input */}
            <div
              className="
                p-3
                border-t
                flex
                gap-2
                bg-white
              "
            >

              <input
                type="text"

                value={message}

                onChange={(e) =>
                  setMessage(e.target.value)
                }

                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}

                placeholder="Ask something..."

                className="
                  flex-1
                  border
                  rounded-xl
                  px-4
                  py-2
                  outline-none
                  focus:ring-2
                  focus:ring-[#6A38C2]
                "
              />


              <button

                onClick={sendMessage}

                className="
                  bg-[#6A38C2]
                  text-white
                  p-3
                  rounded-xl
                  hover:opacity-90
                "
              >
                <Send size={18} />
              </button>

            </div>

          </motion.div>
        )
      }

    </>
  );
};

export default AIChatbot;