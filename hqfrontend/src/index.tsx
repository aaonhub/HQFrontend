import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App/App';
import { ApolloClient, InMemoryCache, from, ApolloProvider, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GlobalContextProvider } from './pages/App/GlobalContextProvider';
import { NextUIProvider } from "@nextui-org/react";

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.forEach(({ message, locations, path }) =>
			console.log(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
			)
		);
	if (networkError) console.log(`[Network error]: ${JSON.stringify(networkError)}`);
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


const root = ReactDOM.createRoot(
	document.getElementById('root')!
);
root.render(
	<ApolloProvider client={client}>
		<React.StrictMode>
			<GlobalContextProvider>
				<NextUIProvider>
					<main className="dark text-foreground bg-background">
						<App />
					</main>
				</NextUIProvider>
			</GlobalContextProvider>
		</React.StrictMode>
	</ApolloProvider >
);