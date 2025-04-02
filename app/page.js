// import { Button } from "../components/ui/button";



// export default function Home() {
//   return (
//     <div>
//       <h1>hi myself harsh agarwal</h1>
//       <Button>Click me</Button>
//     </div>
//   )
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Correct import for App Router
import { Button } from "../components/ui/button";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard"); // Redirect to Dashboard automatically
  }, []);

  return (
    <div>
      <h1>Redirecting to Dashboard...</h1>
      <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
    </div>
  );
}
