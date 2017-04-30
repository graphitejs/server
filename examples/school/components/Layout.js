import PropTypes from 'prop-types';
import Header from './Header';
import Nav from './Nav';
import withData from '../lib/withData';

const items = [{
  name: 'Schools',
  href: '/school',
},
{
  name: 'Students',
  href: '/student',
}];

const Layout = withData(props => (
  <div>
    <Header />
    <Nav items={items} />
    <section className="layout">
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
