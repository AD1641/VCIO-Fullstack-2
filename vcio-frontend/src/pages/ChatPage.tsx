import { useState, useEffect, useRef } from "react";

type Message = {
  id: string;
  sessionId: string;
  role: "user" | "bot";
  content: string;
  createdAt: string;
};

export default function ChatPage() {
  //Load sessionId from localStorage initially
  const [sessionId, setSessionId] = useState<string | null>(() =>
    localStorage.getItem("sessionId")
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/chat/${sessionId}`
        );

        const data = await response.json();

        setMessages(data);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    fetchMessages();
  }, [sessionId]);



  //Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const isChatEmpty = messages.length === 0;

  //Handle sending a message
  const handleSend = async () => {
    if (!input.trim()) return;

    const messageContent = input;

    const userMessage: Message = {
      id: "user-" + Date.now(),
      sessionId: sessionId || "",
      role: "user",
      content: messageContent,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          content: messageContent,
        }),
      });

      const returnedMessages: Message[] = await response.json();

      // Set sessionId if first message
      if (!sessionId && returnedMessages.length > 0) {
        const newSid = returnedMessages[0].sessionId;
        setSessionId(newSid);
        localStorage.setItem("sessionId", newSid);
      }

      // Extract only the bot message
      setTimeout(async () => {
        const refresh = await fetch(
          `http://localhost:8080/chat/${returnedMessages[0].sessionId}`
        );

        const refreshedMessages = await refresh.json();

        setMessages(refreshedMessages);
        setIsTyping(false);
      }, 900);
    } catch (err) {
      console.error("SendMessage error:", err);
      setIsTyping(false);
    }
  };

  //Clear Chat
  const handleClearClick = () => {
    if (window.confirm("Clear all chat history?")) {
      setMessages([]);
      setSessionId(null);
      localStorage.removeItem("sessionId");
    }
  };

  const handlePDFClick = () => alert("PDF report feature coming soon!");

  return (
    <main className="chat-layout">
      {/* Top Buttons */}
      <div className="top-actions">
        <button className="ghost-btn" onClick={handlePDFClick}>
          PDF report
        </button>
        <button className="ghost-btn" onClick={handleClearClick}>
          Clear history
        </button>
      </div>

      {/* Chat / Welcome Area */}
      <div className="chat-scroll-area">
        {isChatEmpty ? (
          <div className="welcome-container">
            <div className="welcome-header">
              <span className="brand-icon">
                <img
                  src="/icons/smileVcio.svg"
                  alt="Vcio Icon"
                  style={{ width: 32, height: 32 }}
                />
              </span>
              <h2>Welcome to Vcio</h2>
            </div>

            <p className="subtitle">
              I’m your AI-powered Chief Information Officer. Here are some things you can ask me about:
            </p>

            <div className="cards-grid">
              <div
                className="red-card"
                onClick={() =>
                  setInput("What managed devices are employees using?")
                }
              >
                <div className="card-content">
                  <h3>People</h3>
                  <p>
                    What managed devices are employees using to access company
                    data?
                  </p>
                  <span className="go-link">Go →</span>
                </div>
                <div className="card-image" />
              </div>

              <div
                className="red-card"
                onClick={() =>
                  setInput("What managed devices are employees using?")
                }
              >
                <div className="card-content">
                  <h3>People</h3>
                  <p>
                    What managed devices are employees using to access company
                    data?
                  </p>
                  <span className="go-link">Go →</span>
                </div>
                <div className="card-image" />
              </div>

              <div
                className="red-card"
                onClick={() => setInput("Have my employees got MFA enabled?")}
              >
                <div className="card-content">
                  <h3>Cybersecurity & Compliance</h3>
                  <p>
                    Have my employees got multi-factor authentication enabled?
                  </p>
                  <span className="go-link">Go →</span>
                </div>
                <div className="card-image" />
              </div>
              <div
                className="red-card"
                onClick={() => setInput("Have my employees got MFA enabled?")}
              >
                <div className="card-content">
                  <h3>Cybersecurity & Compliance</h3>
                  <p>
                    Have my employees got multi-factor authentication enabled?
                  </p>
                  <span className="go-link">Go →</span>
                </div>
                <div className="card-image" />
              </div>
            </div>



            <div className="suggestion-pills">
              <button>Lorem ipsum dolor sit amet</button>
              <button>Lorem ipsum dolor sit amet</button>
              <button>Lorem ipsum dolor sit amet</button>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((m) => (
              <div key={m.id} className={`message ${m.role}`}>
                <div className="bubble">{m.content}</div>
                <span className="time">
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {isTyping && <div className="typing">vCIO is typing...</div>}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="input-area-wrapper">
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            autoFocus
          />

          <button className="send-btn" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </main>
  );
}