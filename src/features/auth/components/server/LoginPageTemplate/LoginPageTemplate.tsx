import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { GoogleSignIn } from '../../client/GoogleSignIn/GoogleSignIn';

export const LoginPageTemplate = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Good Spotにようこそ！</CardTitle>
              <CardDescription>サインインしてください</CardDescription>
            </CardHeader>
            <CardContent>
              <GoogleSignIn />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
