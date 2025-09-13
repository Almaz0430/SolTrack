use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};

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
        // Простое логирование для демонстрации
        msg!("Creating music NFT: {} ({})", title, symbol);
        msg!("Metadata URI: {}", uri);

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

        msg!("✅ Music NFT minted successfully!");

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

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
