export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preload" as="image" href="/images/home2.png" />
      {children}
    </>
  );
}
