import React from 'react'

export default function Date() {
  return (
    <div>
      <label style={{ fontSize: "15px" }} htmlFor="date" className="form-label fw-bold">
        Chọn ngày
      </label>
      <div className=' w-100'>

        <div class="d-flex flex-column w-100 align-items-center gap-3">
          <div className="input-group w-100 mb-1 d-flex align-items-center">
            <span className="w-25" style={{ fontSize: "15px" }}>
              Từ ngày
            </span>

            <div className="input-group input-group-sm w-75">
              <span className="input-group-text">
                <i className="bi bi-calendar-date"></i>
              </span>
              <input
                type="date"
                id="date"
                className="form-control"
                name="date"
              />
            </div>

          </div>

          <div className="input-group w-100 d-flex align-items-center">
            <span className="w-25" style={{ fontSize: "15px" }}>
              Đến ngày
            </span>

            <div className="input-group input-group-sm w-75 ">
              <span className="input-group-text">
                <i className="bi bi-calendar-date"></i>
              </span>
              <input
                type="date"
                id="date"
                className="form-control"
                name="date"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
