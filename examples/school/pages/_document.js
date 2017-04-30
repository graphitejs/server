import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';

import stylesheet from '../styles/index.scss';
import header from '../styles/header.scss';
import nav from '../styles/nav.scss';
import layout from '../styles/layout.scss';

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
         <style dangerouslySetInnerHTML={{ __html: header }} />
         <style dangerouslySetInnerHTML={{ __html: nav }} />
         <style dangerouslySetInnerHTML={{ __html: layout }} />
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
