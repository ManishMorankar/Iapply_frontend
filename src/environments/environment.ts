// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  hmr: false,
  backend: false,
//apiBaseUrl: 'http://103.68.10.234:5191/api/',
    apiBaseUrl: 'https://iapplyuatapp.azurewebsites.net/API/api/',
   //apiBaseUrl: 'http://localhost:5002/api/',
  //  linkedInRedirectUri: 'http://localhost:3000/app/personal-profile',
  //paymentredirecturl: 'http://localhost:5002/api/CustomerProfile/PaymentResponse',
  paymentredirecturl: 'https://iapplyuatapp.azurewebsites.net/API/api/CustomerProfile/PaymentResponse',
   linkedInRedirectUri: 'https://iapplyuatapp.azurewebsites.net/linkedinredirect.html',
  linkedInClientId: '86d23ekcgqjduc',
  linkedInProfile:'r_liteprofile',
  google_client_id:'',
    //Link:'https://iapplyuatapp.azurewebsites.net/visitor',
  Link:'https://iapplyuatapp.azurewebsites.net/visitor',
  //Link:'http://localhost:3000/visitor'

};
