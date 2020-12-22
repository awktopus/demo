// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  version: require('../../package.json').version,
  apiLink: 'https://labapi.everleagues.com/api',
 // apiLink: 'https://api.everleagues.com/api',
//  apiEsignLink: 'https://ellab-esign.azurewebsites.net/api',
 // apiEsignLink: 'https://el-esign-staging.azurewebsites.net/api',
  //apiEsignLink: 'http://localhost:55940/api',
 apiEsignLink: "https://elqa-tools.azurewebsites.net/api",
 // roomHubLink: 'https://ellabapi.azurewebsites.net/roomhub',
  orgHubLink: 'https://ellabapi.azurewebsites.net/orghub'
};
