import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../components/user/css/ChatbotWidget.css";
import ChatBotKido from "../../assets/user/chatbot.png";

const API = `${process.env.REACT_APP_API_URL}/chatbot`;

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [options, setOptions] = useState([]);
    const [currentKey, setCurrentKey] = useState(null);
    const widgetRef = useRef(null);
    const buttonRef = useRef(null);

    const isInit = useRef(false);

    /* ================= LOAD START NODE ================= */
    useEffect(() => {
        if (!isInit.current) {
            initChat();
            isInit.current = true;
        }
    }, []);

    const initChat = async () => {
        const res = await axios.get(`${API}/nodes`);
        const nodes = res.data;

        const startNode = nodes.find(n => n.isStart);
        if (!startNode) {
            console.error("❌ Không có node isStart");
            return;
        }

        pushBot(startNode.content);
        setOptions(fixDeadEnd(startNode.options));
        setCurrentKey(startNode.key);
    };

    /* ================= HELPERS ================= */
    const pushBot = (text) => {
        setMessages(prev => [...prev, { from: "bot", text }]);
    };

    const pushUser = (text) => {
        setMessages(prev => [...prev, { from: "user", text }]);
    };

    const fixDeadEnd = (opts = []) => {
        if (!opts || opts.length === 0) {
            return [{ label: "⬅️ Quay lại menu", nextNodeKey: "welcome" }];
        }
        return opts;
    };

    /* ================= CLICK OPTION ================= */
    const handleOptionClick = async (opt) => {
        if (!opt.nextNodeKey) return;

        pushUser(opt.label);
        setOptions([]);

        const res = await axios.get(`${API}/nodes/${opt.nextNodeKey}`);
        const node = res.data;

        setTimeout(() => {
            pushBot(node.content);
            setOptions(fixDeadEnd(node.options));
            setCurrentKey(node.key);
        }, 300);
    };
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!open) return;

            const widget = widgetRef.current;
            const button = buttonRef.current;

            if (
                widget &&
                !widget.contains(e.target) &&
                button &&
                !button.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <>
            {/* Floating Button */}
            <div
                ref={buttonRef}
                className={`chatbot-button ${open ? "open" : ""}`}
                onClick={() => setOpen(!open)}
            >

                <img src={ChatBotKido} alt="bot" className="bot-avatar-icon" />
            </div>

            {/* Chat Window */}
            <div
                ref={widgetRef}
                className={`chatbot-window ${open ? "show" : "hide"}`}
            >

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

                {options.length > 0 && (
                    <div className="chat-options">
                        {options.map((o, i) => (
                            <button
                                key={i}
                                className="option-btn"
                                onClick={() => handleOptionClick(o)}
                                disabled={!o.nextNodeKey}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
