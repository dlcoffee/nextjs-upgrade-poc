import Document, { Html, Head, Main, NextScript } from "next/document";
import flush from "styled-jsx/server";

class RootDocument extends Document {
  static async getInitialProps(ctx) {
    let pageContext;

    const { renderPage } = ctx;
    // render _app to pull out pageContext that will have styles necessary for SSR
    const page = renderPage(Component => {
      const WrappedComponent = props => {
        pageContext = props.pageContext;
        return <Component {...props} />;
      };

      return WrappedComponent;
    });

    let css;
    // It might be undefined, e.g. after an error.
    if (pageContext) {
      css = pageContext.sheetsRegistry.toString();
    }

    return {
      ...page,
      pageContext,
      styles: (
        <React.Fragment>
          <style
            id="jss-server-side"
            dangerouslySetInnerHTML={{
              __html: css
            }}
          />
          {flush() || null}
        </React.Fragment>
      )
    };
  }

  render() {
    return (
      <Html>
        <Head />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default RootDocument;
