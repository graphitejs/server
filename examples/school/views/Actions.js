import { Component } from 'react';
import LinkUpdate from './LinkUpdate';
import Remove from './Remove';

export default class Actions extends Component {
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

      <LinkUpdate { ...this.props } />
      <Remove { ...this.props } />
      </div>
    );
  }
}
