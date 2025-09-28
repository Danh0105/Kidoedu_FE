import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const SummernoteEditor = ({ content, onChange }) => {
    const [value, setValue] = useState(content || ''); // Đặt giá trị ban đầu từ content prop

    // Cập nhật giá trị của 'value' mỗi khi content thay đổi
    useEffect(() => {
        setValue(content);
    }, [content]);

    const handleChange = (value) => {
        setValue(value);         // Cập nhật giá trị khi editor thay đổi
        onChange(value);         // Trả lại giá trị cho component cha
    };

    return <ReactQuill theme="snow" value={value} onChange={handleChange} />;
};

export default SummernoteEditor;
