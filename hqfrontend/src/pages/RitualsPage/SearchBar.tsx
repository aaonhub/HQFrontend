import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { useQuery } from "@apollo/client";

import { HabitItem } from "../../models/ritual";
import { GET_ALL_HABITS } from "../../models/habit";
import { List, ListItem } from "@mui/material";




interface SearchBarProps {
	habits: { id: string, title: string }[];
	setHabitToAdd: React.Dispatch<React.SetStateAction<HabitItem | undefined>>;
}




const SearchBar: React.FC<SearchBarProps> = ({ habits, setHabitToAdd }) => {
	const [searchQuery, setSearchQuery] = useState<string>("");

	const { loading, error, data } = useQuery(GET_ALL_HABITS);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleSelect = (item: HabitItem) => {
		setHabitToAdd(item);
	};




	if (loading) { return <p>Loading...</p>; }
	if (error) { return <p>Error :(</p>; }




	// Filter
	const filteredData = data?.myHabits.filter((item: HabitItem) => {
		const lowercaseId = item.id.toLowerCase();
		const lowercaseSearchQuery = searchQuery.toLowerCase();

		// Remove the "h" prefix from the habit IDs
		const habitIds = habits.map((habit) => habit.id.substring(1).toLowerCase());

		console.log(habitIds)

		// Check if the ID includes the search query and there is no matching habit ID
		return (
			lowercaseId.includes(lowercaseSearchQuery) && !habitIds.includes(lowercaseId)
		);
	});





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


			<List>
				{filteredData?.map((item: HabitItem) => (
					<ListItem
						key={item.id}
						onClick={() => handleSelect(item)}
						style={{
							padding: 5,
							justifyContent: "normal",
							fontSize: 20,
							margin: 1,
							width: "250px",
							borderWidth: "10px",
							cursor: "pointer",
						}}
					>
						{item.title}
					</ListItem>
				))}
			</List>




		</div>
	);
};


export default React.memo(SearchBar);