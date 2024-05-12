const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className=" h-full flex items-center justify-center">
      {children}
    </section>
  );
};

export default ClerkLayout;
