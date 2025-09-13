import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { MusicNft } from "../target/types/music_nft";
import {
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

describe("music_nft", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.MusicNft as anchor.Program<MusicNft>;
  const wallet = provider.wallet;

  it("Минт музыкального NFT", async () => {
    const mint = anchor.web3.Keypair.generate();

    // Упрощенная версия без Metaplex

    // Создаем mint-аккаунт
    const lamportsForMint = await provider.connection.getMinimumBalanceForRentExemption(82);
    const createMintTx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: 82,
        lamports: lamportsForMint,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint.publicKey,
        0,
        wallet.publicKey,
        wallet.publicKey
      )
    );
    await provider.sendAndConfirm(createMintTx, [mint]);

    // Создаем ATA для кошелька
    const tokenAccount = await getAssociatedTokenAddress(
      mint.publicKey,
      wallet.publicKey
    );
    const createAtaTx = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        tokenAccount,
        wallet.publicKey,
        mint.publicKey
      )
    );
    await provider.sendAndConfirm(createAtaTx);

    // RPC вызов Anchor с упрощенными аккаунтами
    await program.methods
      .createMusicNft(
        "My Track",           // title
        "MUS",                // symbol
        "ipfs://QmFakeMetaUri" // uri
      )
      .accounts({
        authority: wallet.publicKey,
        payer: wallet.publicKey,
        mint: mint.publicKey,
        tokenAccount: tokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ NFT заминчен:", mint.publicKey.toBase58());
  });
});
