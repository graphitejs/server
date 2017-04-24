import Layout from '../components/Layout.js';
import StudentList from '../views/StudentList';
import StudentCreate from '../views/StudentCreate';
import StudentRemove from '../views/StudentRemove';
import withData from '../lib/withData';

const Index = withData(() => (
  <Layout>
    <StudentList />
    <StudentCreate />
    <StudentRemove />
  </Layout>
));

export default Index;
