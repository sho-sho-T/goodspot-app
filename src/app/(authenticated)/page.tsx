import { AuthenticatedHomePageTemplate } from '@/features/auth/components/server/AuthenticatedHomePageTemplate';

const AuthenticatedHomePage = (_props: PageProps<'/'>) => {
  return <AuthenticatedHomePageTemplate />;
};

export default AuthenticatedHomePage;
