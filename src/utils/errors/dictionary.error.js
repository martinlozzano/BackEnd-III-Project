const clientError = { message: "Client Error", statusCode: 400 }
const badAuth = { message: "Bad Auth", statusCode: 401 }
const forbidden = { message: "Forbidden", statusCode: 403 }
const notFound = { message: "Not Found", statusCode: 404 }
const serverError = { message: "Fatal Server Error", statusCode: 500 }

export { clientError, badAuth, forbidden, notFound, serverError }