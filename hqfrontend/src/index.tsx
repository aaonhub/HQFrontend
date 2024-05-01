import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App/App';
import { ApolloClient, InMemoryCache, from, ApolloProvider, HttpLink, Observable } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GlobalContextProvider } from './pages/App/GlobalContextProvider';

import { REFRESH_TOKEN_MUTATION } from './auth';


let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
	if (graphQLErrors) {
		for (let err of graphQLErrors) {
			switch (err.message) {
				case "You do not have permission to perform this action":
					if (!isRefreshing) {
						isRefreshing = true;
						console.log("Refreshing token...");
						return new Observable(observer => {
							client.mutate({
								mutation: REFRESH_TOKEN_MUTATION,
							})
								.then(response => {
									isRefreshing = false;
									pendingRequests.forEach(callback => callback());
									pendingRequests = [];
									// Retry the original operation
									forward(operation).subscribe({
										next: observer.next.bind(observer),
										error: observer.error.bind(observer),
										complete: observer.complete.bind(observer),
									});
								})
								.catch(error => {
									isRefreshing = false;
									pendingRequests = [];
									observer.error(error);
								});
						});
					} else {
						return new Observable(observer => {
							pendingRequests.push(() => {
								forward(operation).subscribe({
									next: observer.next.bind(observer),
									error: observer.error.bind(observer),
									complete: observer.complete.bind(observer),
								});
							});
						});
					}
				default:
					if (graphQLErrors)
						graphQLErrors.forEach(({ message, locations, path }) =>
							console.log(
								`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
							)
						);
					if (networkError) console.log(`[Network error]: ${JSON.stringify(networkError)}`);
			}
		}
	}
});

const graphqlURI = process.env.NODE_ENV === 'production'
	? "https://hqlink.herokuapp.com/graphql/"
	: "http://localhost:8000/graphql/";

// const graphqlURI = "https://hqlink.herokuapp.com/graphql/";


const httpLink = new HttpLink({
	uri: graphqlURI,
	credentials: 'include'
});


const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: from([errorLink, httpLink]),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<ApolloProvider client={client}>
		<React.StrictMode>
			<GlobalContextProvider>
				<App />
			</GlobalContextProvider>
		</React.StrictMode>
	</ApolloProvider >
);
