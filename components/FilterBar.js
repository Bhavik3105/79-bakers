// components/FilterBar.js
import { useState } from 'react';

export default function FilterBar({ onSearch, onFilter }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    const handleFilterChange = () => {
        onFilter({ category, price, rating });
    };

    return (
        <div className="bg-white shadow p-4 rounded-xl flex flex-col md:flex-row gap-4 mb-6">
            <input
                type="text"
                placeholder="Search cakes..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3"
            />

            <select
                value={category}
                onChange={(e) => {
                    setCategory(e.target.value);
                    handleFilterChange();
                }}
                className="border border-gray-300 rounded-md px-4 py-2"
            >
                <option value="">All Categories</option>
                <option value="Chocolate">Chocolate</option>
                <option value="Fruit">Fruit</option>
                <option value="Eggless">Eggless</option>
            </select>

            <select
                value={price}
                onChange={(e) => {
                    setPrice(e.target.value);
                    handleFilterChange();
                }}
                className="border border-gray-300 rounded-md px-4 py-2"
            >
                <option value="">Any Price</option>
                <option value="low">Under ₹700</option>
                <option value="medium">₹700 - ₹800</option>
                <option value="high">Above ₹800</option>
            </select>

            <select
                value={rating}
                onChange={(e) => {
                    setRating(e.target.value);
                    handleFilterChange();
                }}
                className="border border-gray-300 rounded-md px-4 py-2"
            >
                <option value="">Any Rating</option>
                <option value="4.5">4.5 and above</option>
                <option value="4">4 and above</option>
                <option value="3.5">3.5 and above</option>
            </select>
        </div>
    );
}
