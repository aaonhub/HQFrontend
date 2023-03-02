import { gql } from '@apollo/client';

// Queries
export const GET_HABITS = gql`
  query {
    habits {
      data {
        id
        attributes {
          Title
          Active
          Frequency
          LastCompleted
        }
      }
    }
  }
`;

// Mutations
export const ADD_HABIT = gql`
  mutation createHabit($Title: String!, $Active: Boolean!, $Frequency: Enumeration!, $LastCompleted: Date) {
    createHabit(data: { Title: $Title, Active: $Active, Frequency: $Frequency, LastCompleted: $LastCompleted }) {
      habit {
        id
        attributes {
          Title
          Active
          Frequency
          LastCompleted
        }
      }
    }
  }
`;

export const DELETE_HABIT = gql`
  mutation deleteHabit($id: ID!) {
    deleteHabit(id: $id) {
      habit {
        id
        attributes {
          Title
          Active
          Frequency
          LastCompleted
        }
      }
    }
  }
`;

export const UPDATE_HABIT = gql`
  mutation updateHabit($id: ID!, $Active: Boolean, $Frequency: Enumeration, $LastCompleted: Date) {
    updateHabit(id: $id, data: { Active: $Active, Frequency: $Frequency, LastCompleted: $LastCompleted }) {
      habit {
        id
        attributes {
          Title
          Active
          Frequency
          LastCompleted
        }
      }
    }
  }
`;
