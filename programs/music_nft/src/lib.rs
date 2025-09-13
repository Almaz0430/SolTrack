use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::metadata::{self, CreateMetadataAccountsV3};
use mpl_token_metadata::types::DataV2;

// если где-то потребуется invoke_signed, можно импортировать:
// use solana_program::program::invoke_signed;

declare_id!("prTa5Rvsbrnc3CYU3ZH3tnmMMwRij1grD142T5ZAhtt");

#[program]
pub mod music_nft {
    use super::*;

    pub fn mint_music_nft(
        ctx: Context<MintMusicNft>,
        metadata_uri: String,
        title: String,
        symbol: String,
    ) -> Result<()> {
        // 1) Mint 1 token to the associated token account
        token::mint_to(
            ctx.accounts.mint_to_ctx(),
            1, // amount: 1 (NFT)
        )?;

        // 2) Create metadata via anchor_spl helper (CPI to Metaplex Token Metadata)
        // Prepare data (DataV2) for metadata (image/animation uri is stored in uri)
        let data = DataV2 {
            name: title.clone(),
            symbol: symbol.clone(),
            uri: metadata_uri.clone(),
            seller_fee_basis_points: 0, // set as needed (e.g. 500 = 5%)
            creators: None,
            collection: None,
            uses: None,
        };

        // Build CPI accounts wrapper that anchor_spl expects
        let cpi_accounts = CreateMetadataAccountsV3 {
            metadata: ctx.accounts.metadata.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            mint_authority: ctx.accounts.authority.to_account_info(),
            payer: ctx.accounts.authority.to_account_info(),
            update_authority: ctx.accounts.authority.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
            // token_program is optional for this CPI wrapper in some anchor_spl versions,
            // but if required, it can be added to the wrapper or passed as remaining_account.
        };

        // Create CpiContext with the Token Metadata program account as the program
        let cpi_program = ctx.accounts.token_metadata_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // Call the helper. Note: seller_fee_basis_points currently set in DataV2.
        // create_metadata_accounts_v3 signature: (ctx, data, is_mutable, collection, uses, collection_details)
        metadata::create_metadata_accounts_v3(
            cpi_ctx,
            data,
            false, // is_mutable
            None,  // collection
            None,  // uses
            None,  // collection_details
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintMusicNft<'info> {
    /// Signer who pays for tx and will be mint authority / update authority
    #[account(mut)]
    pub authority: Signer<'info>,

    /// New mint to be created (SPL mint)
    #[account(
        init,
        payer = authority,
        mint::decimals = 0,
        mint::authority = authority,
        mint::freeze_authority = authority
    )]
    pub mint: Account<'info, Mint>,

    /// Associated token account for the authority (to receive the minted NFT)
    #[account(
        init,
        payer = authority,
        associated_token::mint = mint,
        associated_token::authority = authority
    )]
    pub token_account: Account<'info, TokenAccount>,

    /// CHECK: Metaplex metadata account (PDA) - validated by CPI to token-metadata program
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    /// Program accounts
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// Metaplex Token Metadata program (CPI target)
    /// CHECK: treated as program id for CPI
    pub token_metadata_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> MintMusicNft<'info> {
    pub fn mint_to_ctx(&self) -> CpiContext<'_, '_, '_, 'info, token::MintTo<'info>> {
        // prepare CPI accounts for token::mint_to
        let cpi_accounts = token::MintTo {
            mint: self.mint.to_account_info(),
            to: self.token_account.to_account_info(),
            authority: self.authority.to_account_info(),
        };
        let cpi_program = self.token_program.to_account_info();
        CpiContext::new(cpi_program, cpi_accounts)
    }
}


