import { useEffect, useRef, useCallback } from "react";

const AUTO_LOGOUT_DELAY = 10 * 60 * 1000; // 10 phút

export default function useAutoLogout() {
  const timerId = useRef(null);
  const BASENAME = '';

  const resetTimer = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    timerId.current = setTimeout(() => {
      const token = localStorage.getItem("Authorization");
      if (token) {
        localStorage.removeItem("Authorization");
        localStorage.removeItem("role");
        window.location.href = `${BASENAME}/`;
      }
    }, AUTO_LOGOUT_DELAY);
  }, []);

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];

    for (let event of events) {
      window.addEventListener(event, resetTimer);
    }

    resetTimer(); // khởi tạo lần đầu

    return () => {
      for (let event of events) {
        window.removeEventListener(event, resetTimer);
      }
      clearTimeout(timerId.current);
    };
  }, [resetTimer]);
}
