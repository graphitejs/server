import Layout from '../components/MyLayout.js';
import SchoolList from '../views/SchoolList';
import SchoolCreate from '../views/SchoolCreate';
import SchoolRemove from '../views/SchoolRemove';
import withData from '../lib/withData';

const Index = withData(() => (
  <Layout>
    <SchoolList />
    <SchoolCreate />
    <SchoolRemove />
  </Layout>
));

export default Index;
