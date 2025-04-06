import Logo from "@/components/logo";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "@/store/store";

const GoogleOAuth = () => {
  const navigate = useNavigate();
  const [ params ] = useSearchParams();
  const accessToken = params.get("access_token");
  const currentWorkspace = params.get("current_workspace");
  const { setAccessToken } = useStore();
  useEffect(() => {
    if(accessToken) {
      setAccessToken(accessToken);
      if(currentWorkspace) {
        // console.log("Navigating to workspace");
        navigate(`/workspace/${currentWorkspace}`);
      } else {
        navigate(`/`);
      }
    }
  }, [ accessToken, currentWorkspace, setAccessToken, navigate ]);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
          StudySphere
        </Link>
        <div className="flex flex-col gap-6"></div>
      </div>
      <Card>
        <CardContent>
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Authentication Failed</h1>
            <p>We couldn't sign you in with Google. Please try again.</p>

            <Button onClick={() => navigate("/")} style={{ marginTop: "20px" }}>
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleOAuth;
