import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const MenuItem = ({ icon, to, label, children, isOpen, onClick }) => {
    return (
        <li className={`nav-item ${isOpen ? 'menu-open' : ''}`}>
            <Link
                to={to}
                className="nav-link mb-0 "
                onClick={(e) => {
                    onClick();
                }}
            >
                <i className={`nav-icon bi ${icon}`}></i>
                <p style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                    {label}
                    {children && <i className="nav-arrow bi bi-chevron-right"></i>}
                </p>
            </Link>
            <AnimatePresence initial={false}>
                {isOpen && children && (
                    <motion.ul
                        className="nav nav-treeview"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.ul>
                )}
            </AnimatePresence>
        </li>
    );
};

export default MenuItem;
