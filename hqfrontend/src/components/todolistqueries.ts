import { gql } from '@apollo/client';

export const GET_TODOS = gql`
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

export const ADD_TODO = gql`
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

export const DELETE_TODO = gql`
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

export const COMPLETE_UNCOMPLETE_TODO = gql`
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
