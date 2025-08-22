'use client';


import { signOut } from "next-auth/react";
import { Button } from "@heroui/react";
import { FaRegSmile } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
 return (
 <div>
  <h1 className ="text -3xl">Hello App!</h1>
  <h3 className="text-2xl font-semibold">User session data:</h3>
  {session ?(
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <form action ={async () => {
        
        await signOut();
      }}>
      <Button 
        type = 'submit'
        color="primary"
        variant="bordered"
        startContent={<FaRegSmile size={20}/>}
      >
        Sign out
      </Button>
      </form>
      </div>
  ) :(
    <div> Not signed in </div>
  )}
  
    </div>
  );
}

  