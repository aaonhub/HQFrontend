import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App/App';
import { ApolloClient, InMemoryCache, from, ApolloProvider, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GlobalContextProvider } from './pages/App/GlobalContextProvider';
import { fetch } from 'cross-fetch';

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.forEach(({ message, locations, path }) =>
			console.log(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
			)
		);
	if (networkError) console.log(`[Network error]: ${networkError}`);
});

const graphqlURI = process.env.NODE_ENV === 'production'
	? "https://hqlink.herokuapp.com/graphql/"
	: "http://localhost:8000/graphql/";

const customFetch = (uri: RequestInfo, options?: RequestInit): Promise<Response> => {
	const retries = 3;
	const retryDelay = 500; // milliseconds

	let attempts = 0;
	const fetchWithRetry = (uri: RequestInfo, options?: RequestInit): Promise<Response> => {
		return fetch(uri, options)
			.then(response => {
				if (response.status !== 200) {
					return response.json().then((body) => {
						if (body.errors && body.errors.some((error: any) => error.message === "Refresh token is required")) {
							attempts += 1;
							if (attempts <= retries) {
								return new Promise(resolve =>
									setTimeout(() => resolve(fetchWithRetry(uri, options)), retryDelay)
								) as Promise<Response>;
							}
						}
						throw new Error(body.errors);
					});
				}
				return response;
			})
			.catch(error => {
				attempts += 1;
				if (attempts <= retries) {
					return new Promise(resolve =>
						setTimeout(() => resolve(fetchWithRetry(uri, options)), retryDelay)
					) as Promise<Response>;
				}
				throw error;
			});
	};

	return fetchWithRetry(uri, options);
};


const httpLink = new HttpLink({
	uri: graphqlURI,
	credentials: 'include',
	fetch: customFetch
});


const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: from([errorLink, httpLink]),
});


const root = ReactDOM.createRoot(
	document.getElementById('root')!
);
root.render(
	<ApolloProvider client={client}>
		<React.StrictMode>
			<GlobalContextProvider>
				<App />
			</GlobalContextProvider>
		</React.StrictMode>
	</ApolloProvider >
);