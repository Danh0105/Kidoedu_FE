import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../components/user/css/ChatbotWidget.css";
import ChatBotKido from "../../assets/user/chatbot.png"
export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [options, setOptions] = useState([]);

    const callMenu = async (key = "welcome") => {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/chatbot/menu`, { key });
        console.log("res.data.text", res.data)
        setMessages(prev => [...prev, { from: "bot", text: res.data.text }]);
        setOptions(res.data.options);
    };

    const isInit = useRef(false);

    useEffect(() => {
        if (!isInit.current) {
            callMenu();
            isInit.current = true;
        }
    }, []);


    const handleOptionClick = (opt) => {
        setMessages(prev => [...prev, { from: "user", text: opt.label }]);

        setTimeout(() => {
            callMenu(opt.backTo || opt.key);
        }, 300);
    };

    return (
        <>
            {/* Floating Button */}
            <div className={`chatbot-button ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
                <img
                    src={ChatBotKido}
                    alt="bot"
                    className="bot-avatar-icon"
                />
            </div>

            {/* Chat Window */}
            <div className={`chatbot-window ${open ? "show" : "hide"}`}>
                <div className="chatbot-header">
                    <img src={ChatBotKido} className="bot-avatar" alt="bot" />
                    <div>
                        <div className="chat-title">KidoBot – Trợ lý ảo</div>
                        <div className="chat-status">Đang hoạt động</div>
                    </div>
                </div>

                <div className="chatbot-body">
                    {messages.map((m, i) => (
                        <div key={i} className={`msg ${m.from}`}>
                            <div className="bubble">{m.text}</div>
                        </div>
                    ))}
                </div>

                <div className="chat-options">
                    {options.map((o, i) => (
                        <button key={i} className="option-btn" onClick={() => handleOptionClick(o)}>
                            {o.label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
