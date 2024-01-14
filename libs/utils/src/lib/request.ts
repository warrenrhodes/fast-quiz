import * as axios from 'axios';
import * as https from 'https';

export type RequestResponse = {
  status: StatusCode;
  data?: unknown;
};

/**
 * List all the status code request for mtn payment.
 */
export enum StatusCode {
  // Successfully created api user.
  apiUserCreated = 201,

  // Successfully created access token.
  accessTokenCreated = 200,

  // Successfully initiate the payment.
  paymentInitiated = 202,

  // Unauthorized
  unauthorized = 401,

  // Bad request, e.g. invalid data was sent in the request.
  badRequest = 400,

  // Not found, reference id not found or closed in sandbox.
  notFound = 404,

  // Conflict, duplicated reference id.
  conflictError = 409,

  // Internal error. Check log for information.
  internalError = 500,

  // No response.
  noResponse = 0,
}

/**
 * Posts an http request to the given route.
 * @param {Record<string, string | undefined> | string} data The data to be posted.
 * @param {string} route The end point url.
 * @param {Record<string, string>} headers The type content  of request.
 * @param {consoleInterface} console The console to use when posting data.
 * @return {Promise<unknown | undefined>} The server response.
 */
export async function postRequest({
  data,
  route,
  headers,
}: {
  data?: unknown;
  route: string;
  headers?: Record<string, string>;
}): Promise<RequestResponse> {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const response = await axios.default({
      method: 'post',
      url: route,
      headers: headers,
      data: data,
      httpsAgent: agent,
    });
    console.info(
      `Request on the route ${route} completed successfully with status ${
        response.status
      } and data : ${JSON.stringify(response.data)}`
    );
    return { data: response.data, status: response.status };
  } catch (err) {
    if (axios.default.isAxiosError(err)) {
      const error: axios.AxiosError = err;
      const response = error.response;
      if (response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.warn(
          `The POST request was made on the router ${route} and the server responded with a status code ${
            response.status
          } with data response: ${JSON.stringify(response.data)}`
        );
        return { status: response.status, data: response.data };
      }
      if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.warn(
          `The POST request was made on the router ${route} but no response was received. config data: ${error.config?.data}`
        );
        return { status: 0, data: error.config?.data };
      }

      console.warn(
        `The POST request was made on the router ${route} but Something happened in setting up the request that triggered an Error. Error message: ${error.message}`
      );
      return { status: 404, data: error.message };
    }
    console.warn(
      `[Axios] failed to send post request on the route: ${route}\n error: ${err}`
    );
    return { status: 404, data: err };
  }
}

/**
 * Gets an http request to the given route.
 * @param {Record<string, string | undefined> | string} data The data to be posted.
 * @param {string} route The end point url.
 * @param {Record<string, string>} headers The type content  of request.
 * @param {consoleInterface} console The console to use when getting data.
 * @return {Promise<unknown | undefined>} The server response.
 */
export async function getRequest({
  data,
  route,
  headers,
}: {
  data?: Record<string, string | undefined> | string;
  route: string;
  headers?: Record<string, string>;
}): Promise<RequestResponse> {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const response = await axios.default({
      method: 'get',
      url: route,
      headers: headers,
      data: data,
      httpsAgent: agent,
    });
    console.info(
      `Request on the route ${route} completed successfully with status ${
        response.status
      } and data : ${JSON.stringify(response.data)}`
    );
    return { status: response.status, data: response.data };
  } catch (error) {
    if (axios.default.isAxiosError(error)) {
      const response = error.response;
      if (response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.warn(
          `The GET request was made on the router ${route} and the server responded with a status code ${
            response.status
          } with data response: ${JSON.stringify(response.data)}`
        );
        return { status: response.status, data: response.data };
      }
      if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.warn(
          `The GET request was made on the router ${route} but no response was received. config data: ${error.config?.data}`
        );
        return { status: 0, data: error.config?.data };
      }

      console.warn(
        `The GET request was made on the router ${route} but Something happened in setting up the request that triggered an Error. Error message: ${error.message}`
      );
      return { status: 404, data: error.message };
    }
    console.warn(
      `[Axios] failed to send post request on the route: ${route}\n error: ${error}`
    );
    return { status: 404, data: error };
  }
}

/**
 * Encode the body of the request.
 * @param {Record<string, string>} bodyRequest the body request.
 * @return {string} the encoded body request result.
 */
export function encodeTheBodyOfRequest(
  bodyRequest: Record<string, string>
): string {
  const formBody = [];
  for (const key in bodyRequest) {
    if ({}.hasOwnProperty.call(bodyRequest, key)) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(bodyRequest[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
  }
  return formBody.join('&');
}

/**
 * Generates a hash using the given key and secret.
 *
 * @param {string} key - The key to be hashed.
 * @param {string} secret - The secret to be hashed.
 * @return {string} - The generated hash.
 */
export function hash(key: string, secret: string): string {
  const toHash = `${key}:${secret}`;
  if (!global.btoa) {
    return Buffer.from(toHash).toString('base64');
  }
  return global.btoa(toHash);
}
