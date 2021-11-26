import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  TextareaAutosize,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useReducer } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Layout from '../../../components/Layout';
import { getError } from '../../../utils/error';
import { Store } from '../../../utils/Store';
import useStyles from '../../../utils/styles';

// The farmers can edit their products from the page
// creating the reducer for the product
function reducer(state, action) {
  switch (action.type) {
    // Product fetch request reducer
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    // product update reducer

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };

    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };

    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    // product image upload reducer
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };

    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };

    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
}

// The admin users / farmers in can view the products and call for a particular product edit from this component.

function ProductEdit({ params }) {
  // getting the id from the params from serverside props
  const productId = params.id;

  // getting the userInfo from the state of the react context from the Store.js
  const { state } = useContext(Store);

  console.log('State from edit page: ', state);

  // using the reducer defined above
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      // default value
      loading: true,
      error: '',
    });

  // defining the variables from useForm from react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },

    // setting back the values of the users information to each field with this hook
    setValue,
  } = useForm();

  // setting up notistack notification by destructuring the enqeuesnackbar and closesnackbar properties from the usesnackbar according to the documentation.
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  // Css
  const classes = useStyles();

  const { userInfo } = state;

  // this makes sure that only a logged in user can access this page
  useEffect(() => {
    // check if userInfo exists
    if (!userInfo) {
      // if not, redirect to login page
      return router.push('/login');
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: 'FETCH_REQUEST' });

          const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });

          console.log('Token: ', userInfo.token);

          dispatch({ type: 'FETCH_SUCCESS' });

          // Setting the data for the product to be edited
          // this values will populate the edit form and enable edit.
          setValue('name', data.name);
          setValue('slug', data.slug);
          setValue('price', data.price);
          setValue('image', data.image);
          setValue('category', data.category);
          setValue('farmerName', data.farmerName);
          setValue('farmingMethod', data.farmingMethod);
          setValue('description', data.description);
          setValue('contains', data.contains);
          setValue('dietType', data.dietType);
          setValue('packaging', data.packaging);
          setValue('recipe', data.recipe);
          setValue('countInStock', data.countInStock);
          setValue('address', data.address);
          setValue('city', data.city);
          setValue('postCode', data.postCode);
        } catch (err) {
          // if there is an error

          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  // function that handles the image upload to Cloudinary
  const uploadHandler = async (event) => {
    const file = event.target.files[0];

    // define a new form data
    const bodyFormData = new FormData();

    // append the new file to the form data
    bodyFormData.append('file', file);

    // send an ajax request
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });

      const { data } = await axios.post('/api/admin/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data', // multipart file system allows file upload through ajax request
          authorization: `Bearer ${userInfo.token}`,
        },
      });

      dispatch({ type: 'UPLOAD_SUCCESS' });

      // populate the image field with the url from cloudinary
      setValue('image', data.secure_url); // from cloudinary

      enqueueSnackbar('File upload was successful', { variant: 'success' });
    } catch (err) {
      // the upload request was not successful

      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  // function that handles the form submission for the product update
  const submitHandler = async ({
    name,
    slug,
    price,
    image,
    category,
    farmerName,
    farmingMethod,
    description,
    contains,
    dietType,
    packaging,
    recipe,
    countInStock,
    address,
    city,
    postCode,
  }) => {
    closeSnackbar();
    // prevent default
    // event.preventDefault(); // not needed because of react hook form

    // send an ajax post request with the user information
    try {
      dispatch({ type: 'UPDATE_REQUEST' });

      // delete the data variable
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          slug,
          price,
          image,
          category,
          farmerName,
          farmingMethod,
          description,
          contains,
          dietType,
          packaging,
          recipe,
          countInStock,
          address,
          city,
          postCode,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } },
      );

      dispatch({ type: 'UPDATE_SUCCESS' });

      // success message
      enqueueSnackbar('Product Update Was Successful', {
        variant: 'success',
      });

      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  // The above submit handler function is also handling the update of the product information after it has been created from the products.js folder with createProductHandler on that page.
  // i will try to make it better by creating a separate product creation page where the farmer can create their product from scratch

  return (
    <Layout title={`Edit Product ${productId}`}>
      <section className={classes.allPagesPadding}>
        <Typography component="h1" variant="h1">
          Edit Your Product Information {/* Maybe not needed	 */}
        </Typography>

        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <NextLink href="/admin/dashboard" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Farm Manager"></ListItemText>
                  </ListItem>
                </NextLink>

                <NextLink href="/admin/orders" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Orders"></ListItemText>
                  </ListItem>
                </NextLink>

                <NextLink href="/admin/products" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="Products"></ListItemText>
                  </ListItem>
                </NextLink>

                <NextLink href="/admin/users" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Users"></ListItemText>
                  </ListItem>
                </NextLink>
              </List>
            </Card>
          </Grid>

          {/* Main product Edit information */}
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    Edit Product {productId}
                  </Typography>
                </ListItem>

                <ListItem>
                  {loading && <CircularProgress />}
                  {error && (
                    <Typography className={classes.error}> {error}</Typography>
                  )}
                </ListItem>

                <ListItem>
                  <form
                    onSubmit={handleSubmit(submitHandler)}
                    className={classes.form}
                  >
                    <List>
                      {/* product's Name */}
                      <ListItem>
                        <Controller
                          name="name"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="name"
                              label="Name"
                              error={Boolean(errors.name)}
                              helperText={
                                errors.name // errors exists or not
                                  ? 'Name is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's Slug || Slug is going to be removed */}
                      <ListItem>
                        <Controller
                          name="slug"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="slug"
                              label="Slug"
                              error={Boolean(errors.slug)}
                              helperText={
                                errors.slug // errors exists or not
                                  ? 'Slug is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's Price */}
                      <ListItem>
                        <Controller
                          name="price"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="price"
                              label="Price"
                              error={Boolean(errors.price)}
                              helperText={
                                errors.price // errors exists or not
                                  ? 'Price is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's countInStock */}
                      <ListItem>
                        <Controller
                          name="countInStock"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="countInStock"
                              label="Count in stock"
                              error={Boolean(errors.countInStock)}
                              helperText={
                                errors.countInStock // errors exists or not
                                  ? 'Your stock can`t be empty'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's Image */}
                      <ListItem>
                        <Controller
                          name="image"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="image"
                              label="Image"
                              error={Boolean(errors.image)}
                              helperText={
                                errors.image // errors exists or not
                                  ? 'Image is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* Image uplaod to cloudinary */}
                      <ListItem>
                        <Button variant="contained" component="label">
                          Upload File
                          <input type="file" onChange={uploadHandler} hidden />
                        </Button>

                        {loadingUpload && <CircularProgress />}
                      </ListItem>

                      {/* product's Category */}
                      <ListItem>
                        <Controller
                          name="category"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="category"
                              label="Category"
                              error={Boolean(errors.category)}
                              helperText={
                                errors.category // errors exists or not
                                  ? 'Category is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's FarmerName */}
                      <ListItem>
                        <Controller
                          name="farmerName"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="farmerName"
                              label="Farmer name"
                              error={Boolean(errors.farmerName)}
                              helperText={
                                errors.farmerName // errors exists or not
                                  ? 'Farmer name is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's FarmingMethod */}
                      <ListItem>
                        <Controller
                          name="farmingMethod"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              multiline
                              fullWidth
                              id="farmingMethod"
                              label="Farming method"
                              error={Boolean(errors.farmingMethod)}
                              helperText={
                                errors.farmingMethod // errors exists or not
                                  ? 'Farming method is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's Description */}
                      <ListItem>
                        <Controller
                          name="description"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              multiline
                              id="description"
                              label="Description"
                              error={Boolean(errors.description)}
                              helperText={
                                errors.description // errors exists or not
                                  ? 'Description is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's Contains  */}
                      <ListItem>
                        <Controller
                          name="contains"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              multiline
                              id="contains"
                              label="Contains"
                              error={Boolean(errors.contains)}
                              helperText={
                                errors.contains // errors exists or not
                                  ? 'Contains is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's Diet Type */}
                      <ListItem>
                        <Controller
                          name="dietType"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              multiline
                              id="dietType"
                              label="Diet Type"
                              error={Boolean(errors.dietType)}
                              helperText={
                                errors.dietType // errors exists or not
                                  ? 'Diet Type is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's packaging */}
                      <ListItem>
                        <Controller
                          name="packaging"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="packaging"
                              label="packaging"
                              error={Boolean(errors.packaging)}
                              helperText={
                                errors.packaging // errors exists or not
                                  ? 'packaging is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's Recipe */}
                      <ListItem>
                        <Controller
                          name="recipe"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              multiline
                              id="recipe"
                              label="Recipe"
                              error={Boolean(errors.recipe)}
                              helperText={
                                errors.recipe // errors exists or not
                                  ? 'This is important, so people know what they can cook with what is in the box'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's Address */}
                      <ListItem>
                        <Controller
                          name="address"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              multiline
                              id="address"
                              label="Address"
                              error={Boolean(errors.address)}
                              helperText={
                                errors.address // errors exists or not
                                  ? 'Address is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's City */}
                      <ListItem>
                        <Controller
                          name="city"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="city"
                              label="City"
                              error={Boolean(errors.city)}
                              helperText={
                                errors.city // errors exists or not
                                  ? 'City is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      {/* product's PostCode */}
                      <ListItem>
                        <Controller
                          name="postCode"
                          control={control}
                          defaultValue=""
                          rules={{
                            // validations
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="postCode"
                              label="Post code"
                              error={Boolean(errors.postCode)}
                              helperText={
                                errors.postCode // errors exists or not
                                  ? 'Post code is required'
                                  : ''
                              }
                              /* onChange={(event) => setName(event.target.value)} */
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>

                      <ListItem>
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          color="primary"
                        >
                          Update
                        </Button>

                        {loadingUpdate && <CircularProgress />}
                      </ListItem>
                    </List>
                  </form>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </section>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
