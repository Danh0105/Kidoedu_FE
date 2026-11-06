import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useModalManager } from "./ModalContext";

const AUTO_LOGOUT_DELAY = 5 * 60 * 1000;

export default function useAutoLogout() {
  const timerId = useRef(null);
  const navigate = useNavigate();

  // ✅ GỌI HOOK TRỰC TIẾP – KHÔNG ĐIỀU KIỆN
  const { closeAllModals } = useModalManager();

  const resetTimer = useCallback(() => {
    if (timerId.current) clearTimeout(timerId.current);

    timerId.current = setTimeout(() => {
      const token = localStorage.getItem("access_token");
      if (token) {
        localStorage.removeItem("access_token");

        closeAllModals();
        navigate("/", { replace: true });
      }
    }, AUTO_LOGOUT_DELAY);
  }, [navigate, closeAllModals]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(timerId.current);
    };
  }, [resetTimer]);
}
