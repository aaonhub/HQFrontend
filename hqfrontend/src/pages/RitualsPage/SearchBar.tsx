import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { useQuery } from "@apollo/client";
import CustomList from "../../components/CustomChecklist";

import { GET_ALL_HABITS } from "../../models/habit";
import { List, ListItem } from "@mui/material";
import { RitualItemType } from "./NewRitualDialog";




interface SearchBarProps {
	habits: RitualItemType[];
	setHabitToAdd: React.Dispatch<React.SetStateAction<RitualItemType | undefined>>;
}




const SearchBar: React.FC<SearchBarProps> = ({ habits, setHabitToAdd }) => {
	const [searchQuery, setSearchQuery] = useState<string>("");

	const { loading, error, data } = useQuery(GET_ALL_HABITS, {
		onCompleted: () => {
			console.log(data)
		}
	});


	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleSelect = (item: any) => {
		setHabitToAdd(item);
	};




	if (loading) { return <p>Loading...</p>; }
	if (error) { return <p>Error :(</p>; }




	// Filter
	const filteredData = data.myHabits.filter((habit: any) => {
		const lowercaseTitle = habit.title.toLowerCase();
		const lowercaseSearchQuery = searchQuery.toLowerCase();


		const habitIds = habits.map((habit) => habit.id);


		return (
			lowercaseTitle.includes(lowercaseSearchQuery) && !habitIds.includes(habit.id)
		);
	});





	return (
		<div>
			{/* <TextField
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
			</IconButton> */}


			{/* Checklist */}
			<CustomList list={filteredData} handleCheckItem={handleSelect} checklistType="highlight" />



		</div>
	);
};


export default React.memo(SearchBar);