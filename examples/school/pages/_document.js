import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';
import stylesheet from '../styles/index.scss';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head } = renderPage();
    const styles = flush();
    return { html, head, styles };
  }

  render() {
    return (
     <html>
       <Head>
         <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
       </Head>
       <body className="custom_class">
         {this.props.customValue}
         <Main />
         <NextScript />
       </body>
     </html>
    );
  }
}
