import Layout from '../components/MyLayout.js';
import StudentList from '../views/StudentList';
import StudentCreate from '../views/StudentCreate';
import withData from '../lib/withData';

const Index = withData(() => (
  <Layout>
    <StudentList />
    <StudentCreate />
  </Layout>
));

export default Index;
