/**
 * Specifies the layout for all pages in the landing folder
 * @param {children} (React.ReactNode): children components for the landing page
 * @returns (JSX.Element): landing layout for all pages in the landing folder
 */
const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full bg-neutral-900 overflow-auto">
      <div className="mx-auto max-w-screen-xl h-full w-full">{children}</div>
    </main>
  );
};

export default LandingLayout;
