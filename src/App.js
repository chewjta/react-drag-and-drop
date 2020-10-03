import React from 'react';
import './App.css';
import '@atlaskit/css-reset';
import initialData from './initial-data';
import Column from './Column'
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import styled from 'styled-components'

const Container = styled.div`
  display:flex
`;

class App extends React.Component {

state= initialData;

onDragStart = start => {
  const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);
  this.setState({
    homeIndex,
  });
};  


onDragEnd = result => {
  this.setState({
    homeIndex: null,
  })
  document.body.style.color = 'inherit';
  document.body.style.backgroundColor = 'inherit';
  const {destination, source, draggableId,type } = result;

  if(!destination) {
    return;
  }

  if(type === 'column') {
    const newColumnOrder = Array.from(this.state.columnOrder);
    newColumnOrder.splice(source.index, 1);
    newColumnOrder.splice(destination.index, 0, draggableId);
  
    const newState = {
      ...this.state,
      columnOrder: newColumnOrder,
    };
    this.setState(newState);
    return;
  }


  const start = this.state.columns[source.droppableId];
  const finish = this.state.columns[destination.droppableId];

  if(start === finish) {
    const newTaskIds = Array.from(start.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

  const newColumn = {
    ...finish,
    taskIds: newTaskIds,
  };

  const newState = {
    ...this.state,
    columns: {
      ...this.state.columns,
      [newColumn.id]: newColumn,
    },
  };
  this.setState(newState);
  return; 
}

// Moving from one list to another
const startTaskIds = Array.from(start.taskIds);
startTaskIds.splice(source.index, 1);
const newStart = {
  ...start,
  taskIds: startTaskIds,
};

const finishTaskIds = Array.from(finish.taskIds);
finishTaskIds.splice(destination.index, 0, draggableId);
const newFinish = {
  ...finish,
  taskIds: finishTaskIds,
};

const newState = {
  ...this.state,
  columns: {
    ...this.state.columns,
    [newStart.id]: newStart,
    [newFinish.id]: newFinish,
  },
};
this.setState(newState);
};



render(){
  return (
    <DragDropContext
     onDragStart={this.onDragStart}
     onDragEnd={this.onDragEnd} 
    >
    <Droppable droppableId="all-columns" direction="horizontal" type="column">
    {(provided)=>(<Container
     {...provided.droppableProps}
     ref={provided.innerRef} 
    >
    {this.state.columnOrder.map((columnId,index)=>{
    const column = this.state.columns[columnId];
    const tasks = column.taskIds.map(taskId=>this.state.tasks[taskId]);
    const isDropDisabled = index < this.state.homeIndex;
    return <Column key={column.id} column={column} tasks={tasks} isDropDisabled={isDropDisabled} index={index}/>;
    })}
    {provided.placeholder}
    </Container>)}
    </Droppable>
    </DragDropContext>
    )
  }
}

export default App