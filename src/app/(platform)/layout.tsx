import { ClerkProvider } from "@clerk/nextjs";
// import { dark, neobrutalism } from "@clerk/themes";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
    // appearance={{
    //   baseTheme: [dark, neobrutalism],
    // }}
    >
      {children}
    </ClerkProvider>
  );
};

export default PlatformLayout;
