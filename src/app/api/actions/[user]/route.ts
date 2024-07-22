import { connectToDatabase } from "@/lib/mongodb";
import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import {
  Authorized,
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  StakeProgram,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import OpenAI from "openai";
import urlMetadata from "url-metadata";
import {getAssociatedTokenAddressSync,createTransferInstruction} from "@solana/spl-token";


export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);

    const splitPath = requestUrl.pathname.split("/");

    const username = splitPath[splitPath.length - 1];

    let solanaAddress = '';

    const { title, ...metadata } = await urlMetadata(`https://github.com/${username}`);

    const image = metadata["og:image"];
    let description = metadata?.description;


    const { db } = await connectToDatabase();
    try {
      const user = await db.collection('users').findOne({ login: username });
      if (user?.description) {
        description = user.description;
      }
      if (user?.solanaAddress) {
        solanaAddress = user.solanaAddress;
      }
    } catch (error) {
      console.log(error);
    }

    console.log(metadata);
    // const openai = new OpenAI({
    //   apiKey: process.env.OPENAI_API_KEY,
    // });

    // var response = null;

    // try {
    //   response = await openai.chat.completions.create({
    //     model: 'gpt-4o-mini', // Specify the model you want to use
    //     messages: [
    //       { role: 'system', content: `You are a dev who owns this github profile ${username}` },
    //       { role: 'user', content: 'Write a brief summary(without markup) in plain text (including top 3 languages you code in and top 5 projects) on why would someone donate you based on your github stats & overall reputaion as a dev on socials based' },
    //     ],
    //     response_format: { type: 'text' }
    //   });
    //   console.log(response.choices[0].message.content);
    // } catch (error) {
    //   console.log(error);
    // }



    const baseHref = new URL(
      `/api/actions/gittip`,
      requestUrl.origin,
    ).toString();

    const payload: ActionGetResponse = {
      title: title ?? "Actions Example - Transfer Native SOL",
      icon: image,
      description,
      label: "Donate", // this value will be ignored since `links.actions` exists
      links: {
        actions: [
          {
            label: "Donate SEND", // button text
            href: `${baseHref}?amount={amount}&to=${solanaAddress}`, // this href will have a text input
            parameters: [
              {
                name: "amount", // parameter name in the `href` above
                label: "Enter the amount of SEND to donate", // placeholder of the text input
                required: true,
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { amount, toPubkey } = validatedQueryParams(requestUrl);

    const body: ActionPostRequest = await req.json();

    // validate the client provided input
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl("devnet"),
    );

    // ensure the receiving account will be rent exempt
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0, // note: simple accounts that just store native SOL have `0` bytes of data
    );
    if (amount * LAMPORTS_PER_SOL < minimumBalance) {
      throw `account may not be rent exempt: ${toPubkey.toBase58()}`;
    }

    const senderAccount = getAssociatedTokenAddressSync(
      new PublicKey('SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa'),
      account,
    );

    const receiverAccount = getAssociatedTokenAddressSync(
      new PublicKey('SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa'),
      toPubkey,
    )

    console.log("sender account", senderAccount.toBase58(), "receiver account" ,receiverAccount.toBase58());

          
    const transaction = new Transaction();
    transaction.feePayer = account;

    const latestBlockhash = await connection.getLatestBlockhash();

    transaction!.recentBlockhash = latestBlockhash.blockhash;
    transaction!.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

    transaction.add(createTransferInstruction(
        senderAccount,
        receiverAccount,
        account,
        amount * Math.pow(10, 6)
    ));
            
    // set the end user as the fee payer
    transaction.feePayer = account;

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Send ${amount} SEND to ${toPubkey.toBase58()}`,
      },
      // note: no additional signers are needed
      // signers: [],
    });

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

function validatedQueryParams(requestUrl: URL) {
  let toPubkey: PublicKey = Keypair.generate().publicKey;
  let amount: number = 0;

  try {
    if (requestUrl.searchParams.get("to")) {
      toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
    }
  } catch (err) {
    throw "Invalid input query parameter: to";
  }

  try {
    if (requestUrl.searchParams.get("amount")) {
      amount = parseFloat(requestUrl.searchParams.get("amount")!);
    }

    if (amount <= 0) throw "amount is too small";
  } catch (err) {
    throw "Invalid input query parameter: amount";
  }

  return {
    amount,
    toPubkey,
  };
}
