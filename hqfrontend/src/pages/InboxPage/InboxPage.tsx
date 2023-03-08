import React from 'react';
import ToDoList from '../../components/ToDoList';

interface Props {
  // add any props here
}

const InboxPage: React.FC<Props> = (props: Props) => {
  return (
    <div>
      <ToDoList />
    </div>
  );
};

export default InboxPage;
