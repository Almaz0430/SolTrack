use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, MintTo, Transfer};
use anchor_spl::metadata::{self, Metadata, MetadataAccount};

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
        artist_royalty: u16, // роялти артиста в базисных пунктах (100 = 1%)
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
        nft_data.artist_royalty = artist_royalty;
        nft_data.platform_fee = 500; // 5% комиссия площадки
        nft_data.platform_wallet = ctx.accounts.platform_wallet.key();

        msg!("Creating music NFT: {} ({})", title, symbol);
        msg!("Genre: {}, Price: {} lamports, BPM: {}, Key: {}", genre, price, bpm, key);
        msg!("Metadata URI: {}", uri);
        msg!("Artist Royalty: {} basis points", artist_royalty);

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

        msg!("✅ Music NFT with royalty system minted successfully!");

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

        // Рассчитываем роялти и комиссии
        let total_price = nft_data.price;
        let artist_royalty_amount = (total_price * nft_data.artist_royalty as u64) / 10000;
        let platform_fee_amount = (total_price * nft_data.platform_fee as u64) / 10000;
        let seller_amount = total_price - artist_royalty_amount - platform_fee_amount;

        // Переводим SOL продавцу
        let transfer_to_seller = anchor_lang::system_program::Transfer {
            from: ctx.accounts.buyer.to_account_info(),
            to: ctx.accounts.seller_authority.to_account_info(),
        };
        let cpi_ctx_seller = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_to_seller,
        );
        anchor_lang::system_program::transfer(cpi_ctx_seller, seller_amount)?;

        // Переводим роялти артисту (если есть)
        if artist_royalty_amount > 0 {
            let transfer_to_artist = anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.artist_wallet.to_account_info(),
            };
            let cpi_ctx_artist = CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                transfer_to_artist,
            );
            anchor_lang::system_program::transfer(cpi_ctx_artist, artist_royalty_amount)?;
        }

        // Переводим комиссию площадке
        if platform_fee_amount > 0 {
            let transfer_to_platform = anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.platform_wallet.to_account_info(),
            };
            let cpi_ctx_platform = CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                transfer_to_platform,
            );
            anchor_lang::system_program::transfer(cpi_ctx_platform, platform_fee_amount)?;
        }

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

    pub fn update_artist_royalty(ctx: Context<UpdateNftPrice>, new_royalty: u16) -> Result<()> {
        let nft_data = &mut ctx.accounts.nft_data;
        
        // Проверяем, что только владелец может изменить роялти
        require!(nft_data.owner == ctx.accounts.authority.key(), ErrorCode::Unauthorized);
        
        // Проверяем, что роялти не превышает 50% (5000 базисных пунктов)
        require!(new_royalty <= 5000, ErrorCode::InvalidRoyalty);
        
        nft_data.artist_royalty = new_royalty;
        
        msg!("✅ Artist royalty updated to: {} basis points", new_royalty);
        
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
    pub artist_royalty: u16,     // Роялти артиста в базисных пунктах (100 = 1%)
    pub platform_fee: u16,       // Комиссия площадки в базисных пунктах (500 = 5%)
    pub platform_wallet: Pubkey, // Кошелек площадки для получения комиссии
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
        space = 8 + 32 + 32 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 1 + 32 + 32 + 4 + 4 + 1 + 2 + 2 + 32,
        seeds = [b"music_nft", mint.key().as_ref()],
        bump
    )]
    pub nft_data: Account<'info, MusicNftData>,

    /// CHECK: Platform wallet for fees
    pub platform_wallet: UncheckedAccount<'info>,

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

    /// CHECK: Artist wallet for royalties
    pub artist_wallet: UncheckedAccount<'info>,
    
    /// CHECK: Platform wallet for fees
    pub platform_wallet: UncheckedAccount<'info>,

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
    #[msg("Invalid royalty percentage")]
    InvalidRoyalty,
}
