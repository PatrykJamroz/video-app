# Video Collection App

App allows user to store YouTube and Vimeo videos. 

### Features
* Add YouTube or Vimeo video via URL or ID
* Local storage
* Import / Export data in JSON
* Delete specific video or all at once
* Add video to favourites
* Watch video in modal view or on source page
* Sort video by source (YouTube, Vimeo) or by data, likes or favourites (eg. favs first)

### Technologies
* React
* Typescript
* Eslint (airbnb typescript)
* Bootstrap

### Future development
App has been written in js before I got first job as frontend dev. After that I re-wrote it to typesciprt, added eslint and did refactor work.
Currenly I'm focused on my frontend job so I have little time to be active here on github. 
In the future I will try to implement following:
* Errors handling
* Loading states
* Tests
* Improve UI

### How to run the app
Besides pulling the repository and installing packages you will have to add your own crede.ts file in src dir which contains [YouTube Data API v3 key](https://developers.google.com/youtube/v3/getting-started) and [Vimeo API token](https://developer.vimeo.com/api/guides/start). This is required to be able to fetch data. I'm not providing my keys, you'll need to generate your own.

```
// src/crede.ts
interface ApiKey {
  youtube: string;
  vimeo: string;
}

// eslint-disable-next-line import/prefer-default-export
export const API_KEY: ApiKey = {
  youtube: "YourYouTubeApiKey",
  vimeo: "YourVimeoApiKey",
};
```

### Screenshots
![App main page with grid](https://user-images.githubusercontent.com/34837954/155882045-789d329d-7842-46d4-8529-893a3f34b45c.png)

![Video Modal](https://user-images.githubusercontent.com/34837954/155882068-df77fff6-bdff-4721-8712-54215feb9faf.png)


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

