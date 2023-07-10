import { gql } from '@apollo/client';

class Settings {
	constructor(
		public theme: string
	) {
		this.theme = theme
	}
}

export default Settings


// Queries
// Update Later
export const GET_SETTINGS = gql`
	query GetSetting($userId: ID!) {
		setting(id: $userId) {
			data {
				id
				attributes {
					theme
				}
			}
		}
	}
`

export const GET_STICKY_NOTE = gql`
	query{
		stickyNote
	}
`

export const GET_HIDDEN_SIDEBAR_ITEMS = gql`
	query {
		hiddenSidebarItems
	}
`


// Mutations
// Update Later
export const UPDATE_SETTING = gql`
	mutation UpdateSetting($userId: ID!, $theme: ENUM_SETTING_THEME) {
		updateSetting(id: $userId, data: { theme: $theme}) {
			data {
				id
				attributes {
					theme
				}
			}
		}
	}
`
// Update Later
export const CREATE_SETTING = gql`
	mutation CreateSetting($userId: ID!, $theme: ENUM_SETTING_THEME) {
		createSetting(data: { user: $userId, theme: $theme }) {
			data {
				id
				attributes {
					theme
				}
			}
		}
	}
`

export const UPDATE_STICKY_NOTE = gql`
	mutation($stickyNote: String!){
		updateStickyNoteContent(stickyNote: $stickyNote){
			settings {
				stickyNote
			}
		}
	}
`

export const UPDATE_HIDDEN_SIDEBAR_ITEMS = gql`
	mutation($HiddenSidebarItems: [String]!){
		updateHiddenSidebarItems(hiddenSidebarItems: $HiddenSidebarItems){
			settings{
				hiddenSidebarItems
			}
		}
	}
`