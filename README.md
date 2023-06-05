# Bean Craft Laboratory

## Overview

Bean Craft Laboratory is a store application that uses the [Square API](https://developer.squareup.com/us/en) to provide a service that allows customers to create their own original coffee blends.

During the flow of creating a coffee blend, Coffee AI predicts the taste and aroma of the blend created by the user.
These predictions are described in text and images, which use the [GPT API](https://platform.openai.com/docs/api-reference/completions) and the [Stable Diffusion API](https://platform.stability.ai/rest-api), respectively.

For actual screens of the operation, please check this Youtube video.

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

This application uses many features of Square, so two types of settings are required: on the application, which uses environment variables, and on the Portal of the Square Web site.

### Application Setup

Each item is set using Node.js environment variables.

They can be set individually or, since [dotenv](https://github.com/motdotla/dotenv) is adopted on this project, they can also be set by placing an .evn file in the project root.

### `BASIC_ID`,`BASIC_PASS`

To prevent API Credit exhaustion, we adopt Basic Authentication in [Passport.js](https://github.com/jaredhanson/passport) as a minimum level of authentication.
Use these environment variables to set ID and PASS for login in String Type.

### `GPT_API_KEY`

Set the API key of GPT API as a String Type. See [this link](https://platform.openai.com/docs/api-reference/authentication) for how to obtain it.

### `SD_API_KEY`
Set the API key of Stable Diffusion API as a String Type. See [this link](https://platform.stability.ai/docs/getting-started/authentication#getting-your-api-key) for how to obtain it.

### `SQUARE_ENV`
### `SQUARE_LOCATION_ID`
### `SQUARE_APPLICATION_ID`
### `SQUARE_ACCESS_TOKEN`
### `PRD_SQUARE_APPLICATION_ID`
### `PRD_SQUARE_ACCESS_TOKEN`

### Square Web Portal Setup

Custom properties must be set according to the [SCAA Flavor Wheel](https://notbadcoffee.com/flavor-wheel-en/).

The correspondence between each item and property name is as follows.

|Flavor Wheel Category| Custom Property Name| Sample(all value in 1 line)|
|:----|:----|:----|
|Fruity| Flavor-Wheel-Fruity|lemon,orange|
|Floral| Flavor-Wheel-Floral|rose, jasmine |
|Sweet| Flavor-Wheel-Sweet|sugar,honey|
|Nutty| Flavor-Wheel-Nutty|almond|
|Spices| Flavor-Wheel-Spices|clove,chinnamon,nuteg|
|Roasted| Flavor-Wheel-Roasted|smokey|
|Sour| Flavor-Wheel-Sour|acid|
|Green| Flavor-Wheel-Green|vegetable|
|Other| Flavor-Wheel-Other|bitter|