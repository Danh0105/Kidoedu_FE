const SkeletonCard = () => (
    <div
        className="card border-0 shadow-sm rounded-4 overflow-hidden p-2 placeholder-glow"
        style={{ maxWidth: 300 }}
    >
        <div
            className="bg-light placeholder rounded w-100 mb-3"
            style={{ height: 200 }}
        />
        <div className="card-body text-center">
            <p className="placeholder-glow mb-2">
                <span className="placeholder col-8" />
            </p>
            <p className="placeholder-glow mb-3">
                <span className="placeholder col-5" />
            </p>
            <div className="d-flex justify-content-center">
                <span className="placeholder btn btn-primary col-6" />
            </div>
        </div>
    </div>
);
export default SkeletonCard;