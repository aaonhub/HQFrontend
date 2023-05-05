import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache, from, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.forEach(({ message, locations, path }) =>
			console.log(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
			)
		);
	if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = createHttpLink({
	uri: 'http://localhost:1337/graphql',
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('jwtToken');
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		}
	}
});

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: from([errorLink, authLink.concat(httpLink)]), // Combine the links
});

const root = ReactDOM.createRoot(
	document.getElementById('root')!
);
root.render(
	<ApolloProvider client={client}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</ApolloProvider>
);
