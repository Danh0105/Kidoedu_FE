import "./WinnerModal.css";
import frameWinner from '../../../assets/user/winnerbg.png';
export default function WinnerModal({ winner, onClose }) {
    if (!winner) return null;

    return (
        <div className="winner-backdrop">
            <div className="winner-modal">

                <div className="frame-wrapper">
                    <img src={process.env.REACT_APP_API_URL + winner.avatar} className="winner-avatar-img" />
                    <img src={frameWinner} className="frame-img" />

                    <div className="winner-content">
                        <div className="winner-icon">🎉</div>
                        <div className="winner-title">Người trúng thưởng</div>
                        <div className="winner-name">{winner.fullName}</div>
                        <div className="winner-type">{winner.position}</div>
                    </div>
                </div>

            </div>
        </div>


    );
}
