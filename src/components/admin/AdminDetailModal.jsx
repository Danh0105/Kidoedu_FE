import React from "react";

const AdminDetailModal = ({ admin, onClose }) => {
    if (!admin) return null;

    return (
        <>
            <div className="modal fade show d-block">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                Thông tin quản trị viên
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            />
                        </div>

                        <div className="modal-body">

                            <div className="mb-2">
                                <strong>ID:</strong> {admin.user_id}
                            </div>

                            <div className="mb-2">
                                <strong>Họ tên:</strong> {admin.username}
                            </div>

                            <div className="mb-2">
                                <strong>Email:</strong> {admin.email}
                            </div>

                            <div className="mb-2">
                                <strong>Vai trò:</strong> {admin.role.name}
                            </div>



                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Đóng
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default AdminDetailModal;
