import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider} from "@apollo/client";
import GraphQL_Connect from './API/AppolloConfig';
import './i18n';

import App from './App';
import './App.css';

createRoot(document.getElementById('root')!).render(<ApolloProvider client={GraphQL_Connect}>
                                                        <App/>
                                                    </ApolloProvider>)

