/**
 * Specifies the layout for all pages in the auth folder
 * @param {children} (React.ReactNode): children components
 * @returns (JSX.Element): auth layout for all pages in the auth folder
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full bg-neutral-300 flex items-center justify-center">
      {children}
    </main>
  );
};

export default AuthLayout;
