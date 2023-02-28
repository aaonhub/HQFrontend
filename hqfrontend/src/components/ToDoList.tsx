import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';

interface ToDoItem {
	id: string;
	attributes: {
		Title: string;
		Completed: boolean;
	};
}

interface ToDoListData {
	toDoInboxes: {
		data: ToDoItem[];
	};
}

interface AddToDoData {
	createToDoInbox: {
		toDoInbox: ToDoItem;
	};
}

interface DeleteToDoData {
	deleteToDoInbox: {
		data: ToDoItem;
	};
}

const GET_TODOS = gql`
  query {
    toDoInboxes {
      data {
        id
        attributes {
          Title
          Completed
        }
      }
    }
  }
`;

const ADD_TODO = gql`
  mutation createToDoInbox($Title: String!) {
    createToDoInbox(data: { Title: $Title, Completed: false }) {
      data {
        id
        attributes {
          Title
          Completed
        }
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteToDoInbox($id: ID!) {
    deleteToDoInbox(id: $id) {
      data {
        id
        attributes {
          Title
          Completed
        }
      }
    }
  }
`;

const COMPLETE_UNCOMPLETE_TODO = gql`
  mutation updateToDoInbox($id: ID!, $Completed: Boolean!) {
    updateToDoInbox(id: $id, data: { Completed: $Completed }) {
      data {
        id
        attributes {
          Title
          Completed
        }
      }
    }
  }
`;

function ToDoList(): JSX.Element {
	const { loading, error, data, refetch } = useQuery<ToDoListData>(GET_TODOS);
	const [newTodo, setNewTodo] = useState<string>('');
	const [addTodo] = useMutation<AddToDoData>(ADD_TODO, {
		onCompleted: () => refetch(),
		onError: (error) => console.log(error.networkError),
	});
	const [deleteTodo] = useMutation<DeleteToDoData>(DELETE_TODO, {
		onCompleted: () => refetch(),
		onError: (error) => console.log(error.networkError),
	});
	const [completeTodo] = useMutation<AddToDoData>(COMPLETE_UNCOMPLETE_TODO, {
		onCompleted: () => refetch(),
		onError: (error) => console.log(error.networkError),
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		addTodo({
			variables: { Title: newTodo },
		});
		setNewTodo('');
	};

	const handleDelete = (id: string): void => {
		deleteTodo({
			variables: { id },
		});
	};

	const handleComplete = (id: string, completed: boolean): void => {
		completeTodo({
			variables: { id, Completed: completed },
		});
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
				/>
				<button type="submit">Add Todo</button>
			</form>
			{data?.toDoInboxes?.data?.map(
				({ id, attributes: { Title, Completed } }: ToDoItem) => (
					<div key={id}>
						<p>
							<span onClick={() => handleComplete(id, !Completed)}>
								{Completed ? "✅" : "❌"}
							</span>
							{Title}
							<button onClick={() => handleDelete(id)}>Delete</button>
						</p>
					</div>
				)
			)}
		</>
	);
}

export default ToDoList;