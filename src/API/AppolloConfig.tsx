import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { useCookies } from "react-cookie";
import { ParseCookies } from "../Component/Public_Data/Public_Application";

const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql/',
  });
  
const authLink = setContext((_, { headers }) => {

    const token = ParseCookies(window.document.cookie).access;

    // return the headers to the context so httpLink can read them
    return {
        headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const GraphQL_Connect = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default GraphQL_Connect;