import PropTypes from 'prop-types';
import Header from './Header';
import Nav from './Nav';
import withData from '../lib/withData';

const items = [{
  name: 'Student',
  href: '/student',
}, {
  name: 'School',
  href: '/school',
}];

const Layout = withData(props => (
  <div>
    <style jsx>{`
      section {
        float: left;
        width: calc(100% - 200px);
      }
    `}
    </style>
    <Header />
    <Nav items={items} />
    <section>
      {props.children}
    </section>
  </div>
));

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.object,
  ]),
};

export default Layout;
