import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';

/**
 * 認証エラーが発生した場合に表示する画面（認証エラーのみのはず）
 */
export const ErrorPageTemplate = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-destructive text-2xl font-bold">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              認証エラーが発生しました。
              <br />
              しばらく経ってから再度お試しください。
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">トップページへ戻る</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
