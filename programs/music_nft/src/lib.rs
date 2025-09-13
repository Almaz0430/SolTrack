use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo, Transfer};

declare_id!("9ysQaigie6LHeqMEWGMWBYkdXFg4zyHhBnxzmZdMzG7T");

#[program]
pub mod music_nft {
    use super::*;

    pub fn create_music_nft(
        ctx: Context<CreateMusicNft>,
        title: String,
        symbol: String,
        uri: String,
        genre: String,
        price: u64, // цена в lamports (1 SOL = 1_000_000_000 lamports)
        bpm: u16,
        key: String,
    ) -> Result<()> {
        // Инициализируем NFT данные
        let nft_data = &mut ctx.accounts.nft_data;
        nft_data.title = title.clone();
        nft_data.symbol = symbol.clone();
        nft_data.uri = uri.clone();
        nft_data.genre = genre.clone();
        nft_data.price = price;
        nft_data.bpm = bpm;
        nft_data.key = key.clone();
        nft_data.owner = ctx.accounts.authority.key();
        nft_data.mint = ctx.accounts.mint.key();
        nft_data.amount = 1; // Количество доступных копий
        nft_data.amount_sold = 0;
        nft_data.is_for_sale = true;

        msg!("Creating music NFT: {} ({})", title, symbol);
        msg!("Genre: {}, Price: {} lamports, BPM: {}, Key: {}", genre, price, bpm, key);
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

    pub fn buy_music_nft(ctx: Context<BuyMusicNft>) -> Result<()> {
        let nft_data = &mut ctx.accounts.nft_data;
        
        // Проверяем, что NFT продается
        require!(nft_data.is_for_sale, ErrorCode::NftNotForSale);
        require!(nft_data.amount > nft_data.amount_sold, ErrorCode::NftSoldOut);
        
        // Проверяем, что покупатель отправил достаточно SOL
        require!(ctx.accounts.buyer.lamports() >= nft_data.price, ErrorCode::InsufficientFunds);

        // Переводим NFT покупателю
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.seller_token_account.to_account_info(),
                to: ctx.accounts.buyer_token_account.to_account_info(),
                authority: ctx.accounts.seller_authority.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, 1)?;

        // Обновляем данные NFT
        nft_data.amount_sold += 1;
        if nft_data.amount_sold >= nft_data.amount {
            nft_data.is_for_sale = false;
        }

        // Переводим SOL продавцу через System Program
        let transfer_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.buyer.to_account_info(),
            to: ctx.accounts.seller_authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_instruction,
        );
        anchor_lang::system_program::transfer(cpi_ctx, nft_data.price)?;

        msg!("✅ Music NFT purchased successfully! Price: {} lamports", nft_data.price);

        Ok(())
    }

    pub fn update_nft_price(ctx: Context<UpdateNftPrice>, new_price: u64) -> Result<()> {
        let nft_data = &mut ctx.accounts.nft_data;
        
        // Проверяем, что только владелец может изменить цену
        require!(nft_data.owner == ctx.accounts.authority.key(), ErrorCode::Unauthorized);
        
        nft_data.price = new_price;
        
        msg!("✅ NFT price updated to: {} lamports", new_price);
        
        Ok(())
    }
}

// Структура для хранения данных NFT
#[account]
pub struct MusicNftData {
    pub title: String,           // Название трека/альбома
    pub symbol: String,          // Символ
    pub uri: String,             // URI метаданных в IPFS
    pub genre: String,           // Жанр
    pub price: u64,              // Цена в lamports
    pub bpm: u16,                // BPM
    pub key: String,             // Тональность
    pub owner: Pubkey,           // Владелец NFT
    pub mint: Pubkey,            // Mint аккаунт
    pub amount: u32,             // Общее количество копий
    pub amount_sold: u32,        // Количество проданных копий
    pub is_for_sale: bool,       // Продается ли NFT
}

#[derive(Accounts)]
pub struct CreateMusicNft<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // владелец NFT
    #[account(mut)]
    pub payer: Signer<'info>, // платит за транзакцию
    /// CHECK: Mint аккаунт будет создан в той же транзакции
    #[account(mut)]
    pub mint: UncheckedAccount<'info>, // минт-аккаунт токена
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>, // куда зачислится NFT
    
    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 32 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 1 + 32 + 32 + 4 + 4 + 1,
        seeds = [b"music_nft", mint.key().as_ref()],
        bump
    )]
    pub nft_data: Account<'info, MusicNftData>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyMusicNft<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>, // покупатель
    #[account(mut)]
    pub seller_authority: SystemAccount<'info>, // продавец
    #[account(mut)]
    pub seller_token_account: Account<'info, TokenAccount>, // токен аккаунт продавца
    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>, // токен аккаунт покупателя
    
    #[account(
        mut,
        seeds = [b"music_nft", seller_token_account.mint.as_ref()],
        bump
    )]
    pub nft_data: Account<'info, MusicNftData>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateNftPrice<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // владелец NFT
    
    #[account(
        mut,
        seeds = [b"music_nft", nft_data.mint.as_ref()],
        bump
    )]
    pub nft_data: Account<'info, MusicNftData>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("NFT is not for sale")]
    NftNotForSale,
    #[msg("NFT is sold out")]
    NftSoldOut,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Unauthorized")]
    Unauthorized,
}
