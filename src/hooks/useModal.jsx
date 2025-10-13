// useModal.js
import { useCallback, useEffect, useRef } from 'react';

export function useModal(modalId) {
  const instanceRef = useRef(null);

  const ensure = useCallback(() => {
    const el = document.getElementById(modalId);
    if (!el || !window?.bootstrap?.Modal) return null;
    instanceRef.current = window.bootstrap.Modal.getOrCreateInstance(el, { backdrop: true, keyboard: true });
    return instanceRef.current;
  }, [modalId]);

  const show = useCallback(() => ensure()?.show(), [ensure]);
  const hide = useCallback(() => instanceRef.current?.hide(), []);
  const dispose = useCallback(() => instanceRef.current?.dispose(), []);

  useEffect(() => () => dispose(), [dispose]); // cleanup khi unmount
  return { show, hide };
}
