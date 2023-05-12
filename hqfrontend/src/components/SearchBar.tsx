import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

interface Item {
    id: number;
    title: string;
}

interface SearchBarProps {
    data: Item[];
    onSelect: (item: Item) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ data, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setSelectedItem(null);
    };

    const handleSelect = (item: Item) => {
        setSelectedItem(item);
        onSelect(item);
    };

    const filteredData = data.filter(
        (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            item.id !== (selectedItem?.id || null)
    );

    return (
        <div>
            <TextField
                id="search-bar"
                className="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                label="Search..."
                variant="outlined"
                size="small"
            />
            <IconButton aria-label="search">
                <SearchIcon style={{ fill: "blue" }} />
            </IconButton>
            {filteredData.map((item) => (
                <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    style={{
                        padding: 5,
                        justifyContent: "normal",
                        fontSize: 20,
                        color: item.id === selectedItem?.id ? "red" : "blue",
                        margin: 1,
                        width: "250px",
                        borderColor: item.id === selectedItem?.id ? "red" : "green",
                        borderWidth: "10px",
                        cursor: "pointer",
                    }}
                >
                    {item.title}
                </div>
            ))}
        </div>
    );
};

export default SearchBar;