import React from 'react';
import Layout from '../components/MyLayout.js';
import StudentList from '../views/studentList';
import withData from '../lib/withData';

const Index = withData(() => (
  <Layout>
    <StudentList />
  </Layout>
));

export default Index;
