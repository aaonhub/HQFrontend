import { gql } from '@apollo/client';

export interface ISettingsType {
	habitOrder: string;
	hiddenSidebarItems: string[];
	id: string;
	itineraryOrder: string;
	owner: {
		__typename: string;
		id: string;
		username: string;
		email: string;
	};
	projectOrder: string;
	masterListOrder: string[];
	stickyNote: string;
	theme: string;
	__typename: string;
}


class SettingsObject implements ISettingsType {
	habitOrder: string;
	hiddenSidebarItems: string[];
	id: string;
	itineraryOrder: string;
	owner: {
		__typename: string;
		id: string;
		username: string;
		email: string;
	};
	masterListOrder: string[];
	projectOrder: string;
	stickyNote: string;
	theme: string;
	__typename: string;

	constructor(
		{ habitOrder, hiddenSidebarItems, id, itineraryOrder, owner, projectOrder, masterListOrder, stickyNote, theme, __typename }:
			{
				habitOrder: string, hiddenSidebarItems: string[], id: string, itineraryOrder: string,
				owner: { __typename: string, id: string, username: string, email: string },
				projectOrder: string, masterListOrder: string[], stickyNote: string, theme: string, __typename: string
			}
	) {
		this.habitOrder = habitOrder;
		this.hiddenSidebarItems = hiddenSidebarItems;
		this.id = id;
		this.itineraryOrder = itineraryOrder;
		this.owner = owner;
		this.projectOrder = projectOrder;
		this.masterListOrder = masterListOrder;
		this.stickyNote = stickyNote;
		this.theme = theme;
		this.__typename = __typename;
	}
}

export default SettingsObject;


// Queries
export const GET_SETTINGS = gql`
	query {
		settings{
			id
			owner {
				id
				username
				email
			}
			theme
			habitOrder
			stickyNote
			hiddenSidebarItems
			itineraryOrder
			projectOrder
			masterListOrder
		}
	}
`


// Mutations
export const UPDATE_SETTINGS = gql`
	mutation UpdateSetting(
		$theme: String, 
		$stickyNote: String,
		$hiddenSidebarItems: JSONString,
		$itineraryOrder: String,
		$masterListOrder: String,
		$projectOrder: String
	){
		updateSettings(
			theme: $theme, 
			stickyNote: $stickyNote,
			hiddenSidebarItems: $hiddenSidebarItems,
			itineraryOrder: $itineraryOrder,
			masterListOrder: $masterListOrder,
			projectOrder: $projectOrder
		){
			settings{
				id
				owner{
					id
					username
					email
				}
				theme
				habitOrder
				stickyNote
				hiddenSidebarItems
				itineraryOrder
				masterListOrder
				projectOrder
			}
		}
	}
`

