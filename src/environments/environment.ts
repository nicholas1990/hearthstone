// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // response_type: 'code',
  client_id: 'f901e9aa49944a8db7de799555203c02',
  secret_id: 'jpAa2SZ9oErVOP6UF3UdtGbVdIc6Zcpa',
  redirect_uri: 'http://localhost:8100',
  authorize_url: 'https://eu.battle.net/oauth/authorize',
  token_url: 'https://eu.battle.net/oauth/token',
  hearthstone: 'https://us.api.blizzard.com/hearthstone/'
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
