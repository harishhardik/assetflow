import { useState, useRef, useEffect } from "react";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "👋 Hi! I'm AssetFlow AI. Ask me anything about assets, bookings, maintenance, audits, or reports.",
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      { sender: "You", text: userMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: "⚠ Unable to connect to the AI server.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-2xl text-3xl z-50"
      >
        🤖
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-xl shadow-2xl border flex flex-col z-50">

          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">

            <div>
              <h2 className="font-bold text-lg">
                AssetFlow AI
              </h2>

              <p className="text-sm">
                Enterprise Assistant
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-2xl"
            >
              ×
            </button>

          </div>

          {/* Messages */}

          <div className="flex-1 overflow-y-auto p-4 bg-gray-100">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  msg.sender === "You"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-xl max-w-[80%] ${
                    msg.sender === "You"
                      ? "bg-blue-600 text-white"
                      : "bg-white shadow"
                  }`}
                >
                  <div className="font-bold text-sm mb-1">
                    {msg.sender}
                  </div>

                  <div>{msg.text}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-gray-500">
                AssetFlow AI is typing...
              </div>
            )}

            <div ref={messagesEndRef}></div>

          </div>

          {/* Input */}

          <div className="p-3 border-t flex gap-2">

            <input
              type="text"
              value={message}
              placeholder="Ask AssetFlow AI..."
              className="flex-1 border rounded-lg p-2 outline-none"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700"
            >
              Send
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default Chatbot;