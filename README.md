# Bean Craft Laboratory

## Overview

Bean Craft Laboratory is a store application that uses the [Square API](https://developer.squareup.com/us/en) to provide a service that allows customers to create their own original coffee blends.

During the flow of creating a coffee blend, Coffee AI predicts the taste and aroma of the blend created by the user.
These predictions are described in text and images, which use the [GPT API](https://platform.openai.com/docs/api-reference/completions) and the [Stable Diffusion API](https://platform.stability.ai/rest-api), respectively.

For actual screens of the operation, please check this Youtube video.

[![](https://img.youtube.com/vi/szYAryVjdro/0.jpg)](https://www.youtube.com/watch?v=szYAryVjdro)

## Execution of Project

This application is a Node.js app and consists of OSS such as Vue3, Vite, and Express.

To run the application, follow the steps below in the same order as a typical Node.js application.

### Install Dependencies

```sh
npm install
```

### Compile and Minify Frontend Sources

```sh
npm run build
```

### Run Backend Server

```sh
npm start
```

## Project Setup

This application uses many features of Square, so two types of settings are required: on the application, which uses environment variables, and on the Portal of the Square Web site ( Seller Dashboard ).

### Application Setup

Each item is set using Node.js environment variables.

They can be set individually or, since [dotenv](https://github.com/motdotla/dotenv) is adopted on this project, they can also be set by placing an .env file in the project root.

#### Basic auth

##### `BASIC_ID`,`BASIC_PASS`

To prevent API Credit exhaustion, we adopt Basic Authentication in [Passport.js](https://github.com/jaredhanson/passport) as a minimum level of authentication.
Use these environment variables to set ID and PASS for login in String Type.

#### Generative AI

##### `GPT_API_KEY`

Set the API key of GPT API as a String Type. See [this link](https://platform.openai.com/docs/api-reference/authentication) for how to obtain it.

##### `SD_API_KEY`
Set the API key of Stable Diffusion API as a String Type. See [this link](https://platform.stability.ai/docs/getting-started/authentication#getting-your-api-key) for how to obtain it.

#### Square
To configure the following settings, you must register in advance with the Developer Portal. See [this link](https://developer.squareup.com/docs/square-get-started) for more information on setting up your Square environment.

##### `SQUARE_ENV`
Set the environment setting for Square as a String Type. Use either "sandbox" or "production". This allows you to switch between a test environment and a production environment. See [this link](https://developer.squareup.com/docs/devtools/sandbox/overview) for more information on setting up.

##### `SQUARE_APPLICATION_ID`
Set the Application ID of Square as a String Type. You can obtain this ID from the Credentials tab on the Square dashboard's left-side menu. Follow [this guide](https://developer.squareup.com/docs/devtools/sandbox/overview) to learn how to create an application and obtain the Application ID and Access Token.

##### `SQUARE_ACCESS_TOKEN`
Set the Access Token of Square as a String Type. You can obtain this token from the Credentials tab on the Square dashboard's left-side menu. Follow [this guide](https://developer.squareup.com/docs/devtools/sandbox/overview) to learn how to create an application and obtain the Application ID and Access Token.

##### `SQUARE_LOCATION_ID`
Set the Location ID of Square as a String Type. You can find this token from the Locations tab on the Square dashboard's left-side menu. See [this help page](https://developer.squareup.com/forums/t/how-to-find-location-id/2625) to learn how to find your Location ID.

##### `SQUARE_TERMINAL_DEVICE_ID`

Basically, please set with `9fa747a2-25ff-48ee-b078-04381f7c828f`

This ID is only needed for the sandbox environment and is set as the Terminal Device ID of Square, which is a String Type. This ID is a unique code assigned to the Terminal device. Since it's not expected to actually connect and use Terminal in the sandbox environment, the test can be run using the virtual registered device ID. Various response types can be simulated, as detailed in [the guide](https://developer.squareup.com/docs/devtools/sandbox/testing).

In a production environment, i.e., when `SQUARE_ENV` is set to "production", the application is designed to use the ID of the first registered payment device. Therefore, there is no need to enter this ID if the device is already registered.

Please refer to [this guide](https://squareup.com/help/us/en/article/7428-connect-your-square-terminal-to-spos#:~:text=On%20your%20Square%20Terminal%2C%20tap,display%20%E2%80%9CPowered%20by%20Square.%E2%80%9D) to register terminal devices.


### Catalog Items setup in the Seller Dashboard

Follow the instructions provided in [this guide](https://squareup.com/help/us/en/article/5115-create-and-manage-items-online) for the initial setup of your catalog.

#### Definition Attribute

##### Category Definition
Create a new category for your items. The application is designed to display products categorized under "CoffeeBean", so it's needed to create a category named `CoffeeBean"`.

##### Units Definition
Set up the units for your items. This application is built with the assumption that coffee will be sold in `grams`. Therefore, create a new unit and set its precision to `.00`. 

##### Taxes Definition
Establish the tax settings for your products. For more details, refer to this guide on [Managing Your Tax Settings](https://squareup.com/help/us/en/article/5061-create-and-manage-your-tax-settings). Basically, please set with `Sales Taxes`.

##### Custom Attributes Definition
Create nine types of flavors as custom attributes. Note that these attributes must be registered individually for each product. Custom attributes should align with the [SCAA Flavor Wheel](https://notbadcoffee.com/flavor-wheel-en/).

Here's the correlation between each item and its property name:

|Flavor Wheel Category| Custom Property Name|
|:----|:----|
|Fruity| Flavor-Wheel-Fruity|
|Floral| Flavor-Wheel-Floral|
|Sweet| Flavor-Wheel-Sweet|
|Nutty| Flavor-Wheel-Nutty|
|Spices| Flavor-Wheel-Spices|
|Roasted| Flavor-Wheel-Roasted|
|Sour| Flavor-Wheel-Sour|
|Green| Flavor-Wheel-Green|
|Other| Flavor-Wheel-Other|


#### Items Registration
After defining the additional properties, register your item details, which include the Name, Category, Image, Description, and Taxes, Custom Attributes. Make sure to set the unit to "grams"/g.


##### Item Example

| Attribute | Value |
|:----|:----|
|Name| Colombia |
|Category| CoffeeBean |
|Image| <img src="./bin/script/img/Colombia.png" alt="A picture of Colombia coffee beans" width="100"> |
|Description| Colombian coffee is characterized by its mellow sweetness, soft bitterness, full body, and rich fruity taste. It is a well-balanced, mild coffee with no prominent acidity. It is easy to use as a base for blending and can be enjoyed in a variety of ways. |
|Taxes| All Locations |
|Taxes| Sales Tax |
|Unit| Per Gram (.00) |
|Price| $0.02/g |
|Custom Attributes | * Listed in the table that follows below |


| Custom Attribute | Value |
|:----|:----|
|Flavor-Wheel-Fruity| lemon, orange |
|Flavor-Wheel-Floral| rose, jasmine |
|Flavor-Wheel-Sweet| sugar,honey |
|Flavor-Wheel-Nutty| almond |
|Flavor-Wheel-Spices| love,cinnamon,nutmeg |
|Flavor-Wheel-Roasted| smoky |
|Flavor-Wheel-Sour| None |
|Flavor-Wheel-Green| vegetable |
|Flavor-Wheel-Other| None |

