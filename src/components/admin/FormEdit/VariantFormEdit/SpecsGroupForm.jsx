import React, { useEffect, useState } from "react";

// Spec mặc định
const newSpec = () => ({
    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
    key: "",
    label: "",
    value: "",
    type: "text",
    unit: "",
    note: "",
    order: 1
});

export default function SpecsGroupForm({ specs, onChange }) {

    /* ---------------------------------------------
       1) GROUPING STATE
    --------------------------------------------- */

    const [groups, setGroups] = useState({});

    useEffect(() => {
        if (!specs) return;

        setGroups(prev => {
            // Nếu đã có groups → không overwrite nữa
            if (Object.keys(prev).length > 0) return prev;

            const grouped = {};
            specs.forEach(s => {
                const group = s.group || "Chưa phân nhóm";
                if (!grouped[group]) grouped[group] = [];
                grouped[group].push(s);
            });

            return grouped;
        });
    }, [specs]);

    /* ---------------------------------------------
       2) ACTIVATE BOOTSTRAP POPOVER
    --------------------------------------------- */
    useEffect(() => {
        if (!window.bootstrap) return;

        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        const instances = [...popoverTriggerList].map(el => new window.bootstrap.Popover(el));

        return () => {
            instances.forEach(instance => instance.dispose());
        };
    }, [groups]);




    /* ---------------------------------------------
       3) UPDATE GROUP STATE + SEND TO PARENT
    --------------------------------------------- */
    const updateGroupState = (newGroups) => {
        setGroups(newGroups);

        const flattened = Object.entries(newGroups).flatMap(([groupName, items]) =>
            items.map(item => ({ ...item, group: groupName }))
        );

        if (onChange) onChange(flattened);
    };

    /* ---------------------------------------------
       4) GROUP & SPEC CRUD
    --------------------------------------------- */

    const addGroup = () => {
        const name = prompt("Nhập tên nhóm mới:");
        if (!name) return;

        updateGroupState({ ...groups, [name]: [] });
    };
    const removeGroup = (groupName) => {
        const newGroups = { ...groups };
        delete newGroups[groupName];
        updateGroupState(newGroups);
    };

    const addSpec = (groupName) => {
        updateGroupState({
            ...groups,
            [groupName]: [...groups[groupName], newSpec()]
        });
    };

    const updateSpec = (groupName, id, field, value) => {
        const updated = groups[groupName].map(s =>
            s.id === id ? { ...s, [field]: value } : s
        );

        updateGroupState({ ...groups, [groupName]: updated });
    };

    const removeSpec = (groupName, id) => {
        updateGroupState({
            ...groups,
            [groupName]: groups[groupName].filter(s => s.id !== id)
        });
    };

    /* ---------------------------------------------
       5) UI
    --------------------------------------------- */

    return (
        <div className="p-3 bg-light rounded border">

            {/* ADD GROUP BUTTON */}
            <a className="btn btn-primary mb-3" onClick={addGroup}>
                + Thêm nhóm
            </a>

            {Object.entries(groups).map(([groupName, items]) => (
                <div key={groupName} className="mb-4 p-3 border rounded bg-white">

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold m-0 text-primary">{groupName}</h5>

                        <a
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                                if (window.confirm(`Xóa nhóm "${groupName}"?`)) {
                                    removeGroup(groupName);
                                }
                            }}
                        >
                            Xóa nhóm
                        </a>
                    </div>


                    {items.map(item => (
                        <div key={item.id} className="border rounded p-3 mb-3 bg-light">

                            {/* ROW 1: key / label / value / order */}
                            <div className="row g-2">

                                {/* KEY */}
                                <div className="col-md-3">
                                    <label className="form-label">
                                        Key
                                        <i
                                            className="bi bi-info-circle ms-1 text-primary"
                                            data-bs-toggle="popover"
                                            data-bs-trigger="hover focus"
                                            data-bs-placement="top"
                                            data-bs-content="Key là định danh kỹ thuật, không nhất thiết hiển thị cho người dùng."
                                            style={{ cursor: "pointer" }}
                                        ></i>
                                    </label>

                                    <input
                                        className="form-control"
                                        value={item.key}
                                        onChange={(e) => updateSpec(groupName, item.id, "key", e.target.value)}
                                    />
                                </div>

                                {/* LABEL */}
                                <div className="col-md-3">
                                    <label className="form-label">Label</label>
                                    <input
                                        className="form-control"
                                        value={item.label}
                                        onChange={(e) => updateSpec(groupName, item.id, "label", e.target.value)}
                                    />
                                </div>

                                {/* VALUE */}
                                <div className="col-md-4">
                                    <label className="form-label">Giá trị</label>
                                    <input
                                        className="form-control"
                                        value={item.value}
                                        onChange={(e) => updateSpec(groupName, item.id, "value", e.target.value)}
                                    />
                                </div>

                                {/* ORDER */}
                                <div className="col-md-2">
                                    <label className="form-label">Order</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={item.order}
                                        onChange={(e) => updateSpec(groupName, item.id, "order", Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            {/* ROW 2: type / unit / note */}
                            <div className="row g-2 mt-2">

                                {/* TYPE */}
                                <div className="col-md-3">
                                    <label className="form-label">Type</label>
                                    <select
                                        className="form-select"
                                        value={item.type}
                                        onChange={(e) => updateSpec(groupName, item.id, "type", e.target.value)}
                                    >
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="textarea">Textarea</option>
                                        <option value="select">Select</option>
                                        <option value="boolean">Boolean</option>
                                    </select>
                                </div>

                                {/* UNIT */}
                                <div className="col-md-3">
                                    <label className="form-label">Unit</label>
                                    <input
                                        className="form-control"
                                        value={item.unit || ""}
                                        onChange={(e) => updateSpec(groupName, item.id, "unit", e.target.value)}
                                    />
                                </div>

                                {/* NOTE */}
                                <div className="col-md-6">
                                    <label className="form-label">Ghi chú</label>
                                    <input
                                        className="form-control"
                                        value={item.note || ""}
                                        onChange={(e) => updateSpec(groupName, item.id, "note", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* DELETE BUTTON */}
                            <div className="text-end mt-2">
                                <a
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeSpec(groupName, item.id)}
                                >
                                    Xóa thông số
                                </a>
                            </div>

                        </div>
                    ))}

                    {/* ADD SPEC */}
                    <a
                        className="btn btn-outline-primary"
                        onClick={() => addSpec(groupName)}
                    >
                        + Thêm thông số
                    </a>

                </div>
            ))}
        </div>
    );
}
