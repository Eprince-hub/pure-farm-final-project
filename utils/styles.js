import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  navbar: {
    backgroundColor: '#4D5056',
    height: 50,
    '& a': {
      color: '#002B2B',
      marginRight: 10,
      fontSize: '1.2rem',
      color: '#FFFFFF',
    },
  },

  lowerNavigation: {
    width: '100%',
    height: '6.6rem',
    backgroundColor: '#FFFFFF',
    color: '#002B2B',
  },

  navMenu: {
    width: 'inherit',
    height: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    color: '#002B2B',
  },

  logo: {
    /*  maxWidth: 160, */
    width: 260,
  },

  searchBar: {
    '& input': {
      backgroundColor: 'red',
    },
  },

  navbarButtons: {
    width: '40%',
    height: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    color: '#002B2B',

    '& a': {
      color: '#002B2B',
      fontFamily: 'Oswald',
    },
  },

  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    '& a[href="/cart"]': { marginRight: 20 },

    '& a[href="/login"]': {
      background: '#77B050',
      marginBottom: 10,
      textAlign: 'center',
      borderRadius: 5,

      width: 108,
      height: 30,
    },

    '& a[href="/register-type"]': {
      background: '#77B050',
      marginBottom: 10,

      textAlign: 'center',
      borderRadius: 5,

      width: 108,
      height: 30,
    },
  },

  cartIcon: {
    width: 30,
  },

  profileIcon: {
    marginRight: 5,
  },

  lineUp: {
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    marginBottom: 10,
    marginRight: 10,
  },

  heroPage: {
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(182, 242, 109, 0.3)',
    width: '100%',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroPageHeader: {
    color: '#002B2B',
    marginTop: '5rem',
    display: 'flex',
    flexDirection: 'column',
    justContent: 'center',
    alignItems: 'center',
    padding: '1rem',

    '& h1': {
      fontSize: '480%',

      /* fontSize: 'calc(50%  5rem)', */
    },

    '& a': {
      color: '#002B2B',

      borderRadius: 16,
      padding: '0rem 1.8rem',
      background: '#FFC745',
    },
  },

  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },

  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: '80vh',
  },

  section: {
    marginTop: 20,
    marginBottom: 20,
  },

  categorySection: {
    width: '100%',
    /* padding: '0rem 1rem', */
    textAlign: 'center',
    margin: '2rem 0rem',
  },

  categorySectionHeader: {
    background: 'rgba(77, 115, 50, 0.2)',
    height: '100%',
    padding: '1rem 0rem',
    borderRadius: 5,

    '& h2': {
      color: 'rgba(0, 43, 43, 1)',
      LineHeight: 53.35,
      fontWeight: 500,
      fontSize: 36,
    },

    '& div': {
      height: 190,
    },
  },

  homePageProductsStyle: {
    '& h3': {
      marginBottom: '1.2rem',
    },
  },

  form: {
    width: '100%',
    /* textAlign: 'center', */
    maxWidth: 800,
    margin: '0 auto',
  },

  navbarButton: {
    color: '#ffffff',
    textTransform: 'initial',
  },

  loginLayoutStyle: {
    backgroundColor: 'rgba(182, 242, 109, 0.3)',
  },

  loginPageStyle: {
    width: '100%',
    height: '60vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    zIndex: 1,
    marginTop: '2rem',
    padding: '0 1rem',
    borderRadius: 40,
    filter: 'drop-shadow(0 0 0.75rem green)',
  },

  loginGrid: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginPageImage: {
    width: '100%',
    height: '100%',
    textAlign: 'right',
  },

  loginFormContainer: {
    width: '100%',
    height: '100%',

    '& form': {
      textAlign: 'center',
      width: '100%',
      height: '100%',
    },
  },

  loginFormTexts: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    '& li': {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },

  transparentBackground: {
    background: 'transparent',
  },

  error: {
    color: '#F04040',
  },

  fullWidth: {
    width: '100%',
  },

  siteAdminStyle: {
    '& h2': {
      textAlign: 'center',

      marginBottom: '-1.2rem',
    },
  },

  chooseRegistration: {
    height: '60vh',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',

    '& h2': {
      color: '#002B2B',
      fontSize: '2rem',
    },
  },

  centerAligned: {
    textAlign: 'center',
    fontSize: '2rem',
    marginTop: '3rem',
  },

  cartContinueShopping: {
    '& h1': {
      fontSize: '1.5rem',
      display: 'inline',
    },
  },

  footer: {
    padding: '1rem',
    marginTop: 60,
    color: '#FFFFFF',
    backgroundColor: '#002B2B',

    '& span p:last-of-type': {
      textAlign: 'center',
    },

    '& input': {
      borderRadius: 16,
      marginRight: 5,
      border: '2px solid white',
      height: '6px',
    },
  },

  footerSocialIcons: {
    paddingTop: '0.5rem',
    width: 200,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  icons: {
    width: 20,
  },

  footerButton: {
    background: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  formInputContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    padding: '20px 0px',
  },
});
export default useStyles;
