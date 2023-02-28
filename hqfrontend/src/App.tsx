import './App.css';
import ToDoList from './components/ToDoList';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:1337/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">

          {/* to do list */}
          <ToDoList />

        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
