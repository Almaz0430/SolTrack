use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use anchor_spl::metadata::{self, CreateMetadataAccountsV3, CreateMasterEditionV3};
use mpl_token_metadata::types::DataV2;

declare_id!("9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T");

#[program]
pub mod music_nft {
    use super::*;

    pub fn create_music_nft(
        ctx: Context<CreateMusicNft>,
        title: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        // ----------------------------
        // Создаём Metadata через Metaplex
        // ----------------------------
        let data = DataV2 {
            name: title.clone(),
            symbol: symbol.clone(),
            uri: uri.clone(),
            seller_fee_basis_points: 100, // 1% royalties
            creators: None,
            collection: None,
            uses: None,
        };

        let cpi_accounts = CreateMetadataAccountsV3 {
            metadata: ctx.accounts.metadata.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            mint_authority: ctx.accounts.authority.to_account_info(),
            payer: ctx.accounts.payer.to_account_info(),
            update_authority: ctx.accounts.authority.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_metadata_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);
        metadata::create_metadata_accounts_v3(cpi_ctx, data, true, false, None)?;

        // ----------------------------
        // Создаём Master Edition
        // ----------------------------
        let cpi_accounts = CreateMasterEditionV3 {
            edition: ctx.accounts.master_edition.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            mint_authority: ctx.accounts.authority.to_account_info(),
            payer: ctx.accounts.payer.to_account_info(),
            update_authority: ctx.accounts.authority.to_account_info(),
            metadata: ctx.accounts.metadata.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(), // <-- добавлено
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        metadata::create_master_edition_v3(cpi_ctx, Some(0))?;

        // ----------------------------
        // Минтим 1 NFT в токен аккаунт владельца
        // ----------------------------
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        );
        token::mint_to(cpi_ctx, 1)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMusicNft<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // владелец NFT
    #[account(mut)]
    pub payer: Signer<'info>, // платит за транзакцию
    #[account(mut)]
    pub mint: Account<'info, Mint>, // минт-аккаунт токена
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>, // куда зачислится NFT

    /// CHECK: Metaplex Metadata PDA (мы доверяем Metaplex)
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    /// CHECK: MasterEdition PDA (мы доверяем Metaplex)
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,

    /// CHECK: внешний Metaplex program (никаких проверок)
    pub token_metadata_program: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
