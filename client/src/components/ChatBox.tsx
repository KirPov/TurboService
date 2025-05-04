// src/components/ChatBox.tsx
import { FC, useEffect, useRef, useState } from 'react';
import { socket } from '../api/socket';
import { useAuth } from '../hooks/userAuth';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  applicationId: number;
  text: string;
  createdAt: string;
}

interface ChatBoxProps {
  peerId: number;
  applicationId: number;
}

const ChatBox: FC<ChatBoxProps> = ({ peerId, applicationId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.id || !peerId || !applicationId) return;

    const loadHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:4100/api/chat/history?userId=${user.id}&peerId=${peerId}&applicationId=${applicationId}`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.warn('История чата пришла не в виде массива:', data);
        }
      } catch (err) {
        console.error('Ошибка при загрузке истории сообщений:', err);
      }
    };

    loadHistory();

    const handleReceive = (message: Message) => {
      if (
        message.applicationId === applicationId &&
        [message.senderId, message.receiverId].includes(user.id) &&
        [message.senderId, message.receiverId].includes(peerId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('receiveMessage', handleReceive);

    return () => {
      socket.off('receiveMessage', handleReceive);
    };
  }, [user?.id, peerId, applicationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !user?.id || !peerId || !applicationId) return;

    const messagePayload = {
      senderId: user.id,
      receiverId: peerId,
      applicationId,
      text: text.trim(),
    };

    socket.emit('sendMessage', messagePayload);
    setText('');
  };

  return (
    <div className="bg-gray-100 border rounded-lg p-4 max-w-md mx-auto shadow">
      <div className="h-64 overflow-y-auto mb-4 flex flex-col space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded max-w-[75%] ${
              msg.senderId === user?.id
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-300 text-black self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Введите сообщение"
          className="flex-1 p-2 border rounded-l text-black bg-white focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
