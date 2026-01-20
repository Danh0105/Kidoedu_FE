import React from 'react';

export default function PromotionSidebar({ promotions, selected, onSelect }) {
    return (
        <ul className="list-group list-group-flush">
            {promotions.map(promo => (
                <li
                    key={promo.id}
                    className={`list-group-item list-group-item-action
                        ${selected?.id === promo.id ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelect(promo)}
                >
                    {promo.name}
                </li>
            ))}
        </ul>
    );
}
