'use client';
import { useSession, signOut } from "next-auth/react";
import LoginButton from "@/components/LoginButton";
import './globals.css';
import { useEffect, useState } from "react";
import Head from "next/head";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {

  const { data: session } = useSession();

  const [solanaAddress, setSolanaAddress] = useState('');
  const [description, setDescription] = useState('');

  const { toast } = useToast()
  const [user, setUser] = useState(null);


  const handleSaveAndShare = async () => {
    // Handle Save & Share logic here
    console.log('Solana Address:', solanaAddress);
    console.log('Description:', description);

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({solanaAddress, description, email: session?.user?.email}),
    }).then((res) => res.json())
    .then((data) => {
      toast({
        title: 'Blink generated',
        description: 'Blink copied to clipboard',
      })
      window.open(encodeURI(`https://dial.to/?action=solana-action:${process.env.NEXT_PUBLIC_ENVIRONMENT_URL}/api/gittip?gituser=${user?.login}`), '_blank');

    });
    console.log('Response:', res);
  };

  const fetchUser = async () => {
    const userFound = await fetch('/api/users?email=' + session?.user?.email)
    .then((res) => res.json())
    .then((data) => data.data)
    .catch((error) => console.error('Error:', error));
    console.log('User:', userFound);

    if (!userFound?.description) {
      const followers = `${userFound?.followers || '-'} Followers 👥 `
      const repos = `${userFound?.public_repos + userFound?.owned_private_repos} Repos 👨🏻‍💻 `
      const hireable = `Looking for opportunities ${userFound?.hireable ? '✅' : '⛔'}`
      setDescription(`${followers} | ${repos} | ${hireable} \n\n${userFound?.bio}`)
    } else {
      setDescription(userFound?.description)
    }

    if (userFound?.solanaAddress) {
      setSolanaAddress(userFound?.solanaAddress);
    }
    setUser(userFound);
  }

  useEffect(() => {
    if (session?.user) {
      console.log('User:', session?.user);
      fetchUser();
    }
  }, [
    session?.user
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white flex flex-col items-center">
      <Head>
        <title>Convert Your GitHub Profile to Solana Blink</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="w-full py-6 flex justify-between items-center bg-opacity-75 bg-black px-8 shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Gittip
        </h1>
        <div>
          {session ? (
            <>
              <p>Signed in as {session?.user?.email}</p>
              <button onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <LoginButton />
          )}
        </div>
      </header>


      <main className="w-full max-w-2xl mt-10 px-6 py-8 bg-white bg-opacity-90 text-gray-800 rounded-lg shadow-lg">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="solanaAddress">
            Solana Address
          </label>
          <Input
            id="solanaAddress"
            type="text"
            value={solanaAddress}
            onChange={(e) => setSolanaAddress(e.target.value)}
            placeholder="Enter your Solana address"
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Write a brief summary on Why should someone donate / hire you?
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a brief summary on Why should someone donate / hire you?"
            className="w-full px-3 py-2 border min-h-56 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button disabled={!Boolean(session?.user) || !description || !solanaAddress} onClick={handleSaveAndShare} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded shadow-md">
          Save & Share
        </Button>
      </main>

    </div>
  );
}
