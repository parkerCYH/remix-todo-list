import type { LinksFunction } from '@remix-run/node';
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { NavigationMenuDemo } from './components/nav';
import stylesheet from './globals.css?url';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
      <header>
        <div className="flex items-center p-9 md:gap-16">
          <Link className="text-xl font-bold sm:text-3xl" to="/">
            Remix Todo List
          </Link>
          <NavigationMenuDemo />
        </div>
      </header>
      {children}
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
);

const App = () => <Outlet />;
export default App;
