import { Component } from 'react';
import SchoolEdit from './SchoolEdit';
import SchoolRemove from './SchoolRemove';

export default class SchoolWrapEditRemove extends Component {
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

        <SchoolEdit  { ...this.props } />
        <SchoolRemove { ...this.props } />
      </div>
    );
  }
}
