import React, { useEffect, useState } from "react";
import PolicyList from "../../../components/admin/policy/PolicyList";

export default function PolicyManagerPage() {
    const [policies, setPolicies] = useState([]);

    const fetchPolicies = async () => {
        try {
            const res = await fetch("http://localhost:3000/policies");
            const data = await res.json();
            setPolicies(data);
        } catch (err) {
            console.error("Lỗi tải danh sách chính sách:", err);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    return (
        <div className="container my-5">
            <PolicyList policies={policies} onUpdated={fetchPolicies} />
        </div>
    );
}
