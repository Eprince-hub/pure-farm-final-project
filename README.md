# Pure Farm

## Description
Pure Farm is a multi Vendor Marketplace for farmers and organic food lovers. It enable farmers to sale thier farm produce easily and simply by just registering on the platform and start uploading the food box that they want to sale. The buyers on the other hand can simply get on the platform and search for the food box they want to buy.

At first glance of the platform, you will be greated with a beautiful landing page and you can see some of the food boxes on the overview of the landing page and on the market is where you see all the food boxes available on the platform. As an unregistered users you can view all the products, view the farmers currently registered on the platform, add food boxes to your cart.

When a user is registered as a customer then the user will have access to a profile page where they can edit thier profile and make some changes if there was a mistake and then onhly they can continue to enter their delivery address and continue to place an order and make purchase.

When a user is registered as a farmer, they have all the privileges of á customer and an extra privileges of having a dashboard where they can manage their digital farm. On this dashboard they can delete an unwanted product or edit the product information. and they can also create a new product where a lot of information would be needed about the food box and what is in it.

## Main Technonolies Used to Build the App
Next.js
Node.js
MongoDB
Material ui
Paypal Payment
Cloudinary

## The application is fully deployed on:
HEROKU:  [Heroku](https://pure-farm.herokuapp.com/)
\
&nbsp;
\
&nbsp;
VERCEL: [Vercel](https://pure-farm.vercel.app/)



## Setup
If you would like to set up the project yourself, follow these steps:

## MongoDB Atlas
- The application requires MongoDB Atlas in order to work.
- It is necessary to create or have a [MongoDB Atlas Account](https://account.mongodb.com/account/login) for that.
- Once your done with that, you need to create a new cluster if you don't have one yet.
- Stick to the instructions of the [Official Documentation](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/) to do that.
- Make sure to select a shared database as it is the only one that is for free.
- After having done all of the previous steps, you should see your cluster under Deployment/Databases.
- Click on 'Browse Collections'.
- Create a new database with a name you would like.
- Once you've created the database go back to the main page under Deployment/Databases.
- Click on 'Connect' and then click on 'Connect your application'.
- Copy the connection string starting with 'mongodb+srv...'. You will need it for the next step.

## Cloning the Project
- Clone the project using git clone.
- Add your project to your GitHub Profile.
- After you're done with that, open your code editor and terminal.
- Run yarn to install all the require dependencies.

- Create a .env.local file in the root directory.

- You need to declare four environment variables in there:

- MONGODB_URI (with the value of the connection string you copied from MongoDB Atlas).

- DB_Name (with the value of the name of the database you created within the cluster).

- JWT_SECRET (This will be needed in case if you want the user authentication functionality).

- PAYPAL_CLIENT_ID (For paypal payment to work,l you will need this, from the paypal delveloper sandbox, you can can follow the instruction there).

- CLOUDINARY_CLOUD_NAME (These are the information you need to get the picture upload functionality).

- CLOUDINARY_API_KEY (These are the information you need to get the picture upload functionality).

- CLOUDINARY_API_SECRET (These are the information you need to get the picture upload functionality).

## SOME VISUALS
![Landing Image](https://i.imgur.com/AgCsF2k.png) 
\
&nbsp;
\
&nbsp;
![Landing Image](https://i.imgur.com/62NYybP.png) 
\
&nbsp;
\
&nbsp;
![Landing Image](https://i.imgur.com/mIXcBNX.png) 

### Thanks For Viewing

