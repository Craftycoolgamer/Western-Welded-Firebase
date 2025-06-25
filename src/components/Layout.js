import React from 'react';
import NavigationBar from './NavigationBar';

function Layout({ children }) {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
    </>
  );
}

export default Layout;