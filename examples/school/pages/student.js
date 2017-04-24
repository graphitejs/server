import Layout from '../components/Layout.js';
import StudentList from '../views/StudentList';
import StudentCreate from '../views/StudentCreate';
import StudentRemove from '../views/StudentRemove';

export default () => (
  <Layout>
    <StudentList />
    <StudentCreate />
    <StudentRemove />
  </Layout>
);
