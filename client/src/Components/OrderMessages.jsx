import { useEffect, useState, useRef } from "react";
import { Send, Loader2, MessageCircle } from "lucide-react";

import api from "../Services/api";
import socket from "../socket";
import { useAuth } from "../Context/AuthContext";

function OrderMessages({ orderId }) {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  const currentUserId =
    user?._id ||
    user?.id ||
    user?.userId;

  /* =========================
     SCROLL TO BOTTOM
  ========================= */

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

  /* =========================
     FETCH MESSAGES
  ========================= */

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/messages/order/${orderId}`
        );

        setMessages(
          response.data?.messages ||
            response.data ||
            []
        );
      } catch (error) {
        console.error(
          "GET MESSAGES ERROR:",
          error.response?.data || error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load messages."
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchMessages();
    }
  }, [orderId]);

  /* =========================
     SOCKET CONNECTION
  ========================= */

  useEffect(() => {
    if (!currentUserId || !orderId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit(
      "joinOrder",
      orderId
    );

    const handleNewMessage = (newMessage) => {
      setMessages((previous) => {
        const alreadyExists = previous.some(
          (item) =>
            item._id === newMessage._id
        );

        if (alreadyExists) {
          return previous;
        }

        return [
          ...previous,
          newMessage,
        ];
      });
    };

    socket.on(
      "newMessage",
      handleNewMessage
    );

    return () => {
      socket.off(
        "newMessage",
        handleNewMessage
      );
    };
  }, [currentUserId, orderId]);

  /* =========================
     SEND MESSAGE
  ========================= */

  const handleSend = async (event) => {
    event.preventDefault();

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage || sending) {
      return;
    }

    try {
      setSending(true);

      const response = await api.post(
        `/messages/order/${orderId}`,
        {
          orderId,
          message: trimmedMessage,
        }
      );

      const newMessage =
        response.data?.message;

      if (newMessage) {
        setMessages((previous) => {
          const alreadyExists =
            previous.some(
              (item) =>
                item._id ===
                newMessage._id
            );

          if (alreadyExists) {
            return previous;
          }

          return [
            ...previous,
            newMessage,
          ];
        });
      }

      setMessage("");
    } catch (error) {
      console.error(
        "SEND MESSAGE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2
            size={25}
            className="animate-spin text-violet-500"
          />
        </div>
      </section>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900">

      {/* HEADER */}

      <div className="flex items-center gap-3 border-b border-gray-800 p-6">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
          <MessageCircle size={20} />
        </div>

        <div>
          <h2 className="font-semibold">
            Messages
          </h2>

          <p className="text-xs text-gray-500">
            Communicate about this order
          </p>
        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="border-b border-red-900 bg-red-950/20 px-6 py-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* MESSAGES */}

      <div className="chat-scrollbar h-[400px] overflow-y-auto p-6">

        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">

            <MessageCircle
              size={35}
              className="text-gray-700"
            />

            <p className="mt-4 text-sm text-gray-500">
              No messages yet.
            </p>

            <p className="mt-1 text-xs text-gray-600">
              Start the conversation about this order.
            </p>

          </div>
        ) : (
          <div className="space-y-4">

            {messages.map((item) => {

              const senderId =
                item.sender?._id ||
                item.sender?.id ||
                item.sender;

              const isMine =
                senderId?.toString() ===
                currentUserId?.toString();

              return (
                <div
                  key={item._id}
                  className={`flex ${
                    isMine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 ${
                      isMine
                        ? "bg-violet-600 text-white"
                        : "bg-gray-800 text-gray-200"
                    }`}
                  >

                    {!isMine &&
                      item.sender?.name && (
                        <p className="mb-1 text-xs font-medium text-violet-400">
                          {item.sender.name}
                        </p>
                      )}

                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {item.message}
                    </p>

                    {item.createdAt && (
                      <p
                        className={`mt-1 text-[10px] ${
                          isMine
                            ? "text-violet-200"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(
                          item.createdAt
                        ).toLocaleTimeString(
                          "en-NG",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    )}

                  </div>

                </div>
              );
            })}

            <div ref={messagesEndRef} />

          </div>
        )}

      </div>

      {/* INPUT */}

      <form
        onSubmit={handleSend}
        className="border-t border-gray-800 p-4"
      >

        <div className="flex gap-3">

          <input
            type="text"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Type a message..."
            disabled={sending}
            className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500"
          />

          <button
            type="submit"
            disabled={
              sending ||
              !message.trim()
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-medium transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {sending ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Send size={17} />
            )}

            <span className="hidden sm:inline">
              Send
            </span>

          </button>

        </div>

      </form>

    </section>
  );
}

export default OrderMessages;
