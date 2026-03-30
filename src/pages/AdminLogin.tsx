import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkExistingSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate("/admin/dashboard", { replace: true });
      }
    };

    checkExistingSession();
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message || "Login failed. Please try again.");
      toast.error("Admin login failed.");
      setIsSubmitting(false);
      return;
    }

    toast.success("Admin login successful.");

    const redirectTarget =
      location.state && typeof location.state === "object" && "from" in location.state
        ? "/admin/dashboard"
        : "/admin/dashboard";

    navigate(redirectTarget, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md border-4 border-arcade-pink bg-zinc-950 shadow-[4px_4px_0px_#00FFFF]">
        <div className="px-5 py-4 bg-arcade-pink text-black font-mono font-bold tracking-[0.25em] text-sm uppercase">
          Admin Login
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@college.edu"
              className="bg-black border-2 border-zinc-700 rounded-none focus-visible:ring-0 focus-visible:border-arcade-pink text-white h-12 text-sm font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              className="bg-black border-2 border-zinc-700 rounded-none focus-visible:ring-0 focus-visible:border-arcade-pink text-white h-12 text-sm font-mono"
              required
            />
          </div>

          {errorMessage && (
            <p className="border-2 border-arcade-pink bg-black px-3 py-2 font-mono text-xs text-arcade-pink">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            variant="yellow"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "SIGNING IN..." : "LOGIN"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
