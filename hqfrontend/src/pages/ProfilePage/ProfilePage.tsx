import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_CURRENT_USER = gql`
  query {
    me {
      id
      username
      email
    }
  }
`;

const ProfilePage = () => {
	const { loading, error, data } = useQuery(GET_CURRENT_USER);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	return (
		<div>
			<h3>Current User Information:</h3>
			<p>Username: {data.me.username}</p>
			<p>Email: {data.me.email}</p>
		</div>
	);
};

export default ProfilePage;
