import { Component } from 'react';
import StudentEdit from './StudentEdit';
import StudentRemove from './StudentRemove';

export default class StudentWrapEditRemove extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className= "actions">
        <style jsx>{`
          .actions {
            text-align: center;
          }
        `}</style>

        <StudentEdit  { ...this.props } />
        <StudentRemove { ...this.props } />
      </div>
    );
  }
}
