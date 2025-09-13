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

    // PDA для metadata
    const METADATA_PROGRAM_ID = new PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
    const [metadataPda] = await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    );

    // PDA для master edition
    const [masterEditionPda] = await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      METADATA_PROGRAM_ID
    );

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

    // RPC вызов Anchor с корректными PDAs
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
        metadata: metadataPda,
        masterEdition: masterEditionPda,
        tokenMetadataProgram: METADATA_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    console.log("✅ NFT заминчен:", mint.publicKey.toBase58());
  });
});
