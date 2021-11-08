import '../styles/globals.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import { StoreProvider } from '../utils/Store';

function MyApp({ Component, pageProps }) {
  // disabling the material ui style reset reset on refresh
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  // wrap our application inside the Store provide so that all the element of the application will have access to the react context state.

  // In order to use the notistack notification bars, we need to wrap the _app.js around the
  // snack bar provider by notistack

  return (
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading={true}>
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </StoreProvider>
    </SnackbarProvider>
  );
}

export default MyApp;
