// NFT Creator Contract
// This contract handles the creation and management of NFT collections with bonding curves

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};
use solana_program::program_option::COption;
use metaplex_token_metadata::state::{Metadata, PREFIX};
use std::convert::TryFrom;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod nft_creator {
    use super::*;

    // Initialize the platform with global settings
    pub fn initialize_platform(
        ctx: Context<InitializePlatform>,
        platform_fee: u64,
        creator_reward: u64,
        threshold_amount: u64,
    ) -> Result<()> {
        let platform = &mut ctx.accounts.platform;
        platform.authority = ctx.accounts.authority.key();
        platform.platform_fee = platform_fee;
        platform.creator_reward = creator_reward;
        platform.threshold_amount = threshold_amount;
        platform.bump = *ctx.bumps.get("platform").unwrap();
        Ok(())
    }

    // Create a new NFT collection with bonding curve parameters
    pub fn create_collection(
        ctx: Context<CreateCollection>,
        name: String,
        symbol: String,
        uri: String,
        base_price: u64,
        growth_factor: u64,
    ) -> Result<()> {
        let collection = &mut ctx.accounts.collection;
        let creator = &ctx.accounts.creator;
        
        collection.name = name;
        collection.symbol = symbol;
        collection.uri = uri;
        collection.creator = creator.key();
        collection.base_price = base_price;
        collection.growth_factor = growth_factor;
        collection.market_cap = 0;
        collection.threshold_reached = false;
        collection.bump = *ctx.bumps.get("collection").unwrap();
        
        Ok(())
    }

    // Mint a new NFT in a collection
    pub fn mint_nft(
        ctx: Context<MintNFT>,
        name: String,
        symbol: String,
        uri: String,
        attributes: Vec<NFTAttribute>,
    ) -> Result<()> {
        let collection = &mut ctx.accounts.collection;
        let nft = &mut ctx.accounts.nft;
        let buyer = &ctx.accounts.buyer;
        let platform = &ctx.accounts.platform;
        
        // Set NFT data
        nft.name = name;
        nft.symbol = symbol;
        nft.uri = uri;
        nft.collection = collection.key();
        nft.owner = buyer.key();
        nft.attributes = attributes;
        nft.bump = *ctx.bumps.get("nft").unwrap();
        
        // Calculate price (for first NFT, it's just the base price)
        let price = collection.base_price;
        
        // Transfer SOL from buyer to platform escrow
        let platform_fee_amount = price.checked_mul(platform.platform_fee).unwrap().checked_div(10000).unwrap();
        let creator_amount = platform.creator_reward;
        let escrow_amount = price.checked_sub(platform_fee_amount).unwrap();
        
        // Transfer platform fee
        let platform_fee_ix = anchor_lang::solana_program::system_instruction::transfer(
            &buyer.key(),
            &platform.key(),
            platform_fee_amount,
        );
        anchor_lang::solana_program::program::invoke(
            &platform_fee_ix,
            &[
                buyer.to_account_info(),
                platform.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
        
        // Transfer creator reward
        let creator_reward_ix = anchor_lang::solana_program::system_instruction::transfer(
            &buyer.key(),
            &collection.creator,
            creator_amount,
        );
        anchor_lang::solana_program::program::invoke(
            &creator_reward_ix,
            &[
                buyer.to_account_info(),
                ctx.accounts.creator.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
        
        // Transfer remaining amount to escrow
        let escrow_ix = anchor_lang::solana_program::system_instruction::transfer(
            &buyer.key(),
            &collection.key(),
            escrow_amount,
        );
        anchor_lang::solana_program::program::invoke(
            &escrow_ix,
            &[
                buyer.to_account_info(),
                collection.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
        
        // Update collection market cap
        collection.market_cap = collection.market_cap.checked_add(price).unwrap();
        
        // Check if threshold is reached
        if collection.market_cap >= platform.threshold_amount && !collection.threshold_reached {
            collection.threshold_reached = true;
            // Additional logic for threshold activation could be added here
        }
        
        Ok(())
    }

    // Buy an existing NFT
    pub fn buy_nft(ctx: Context<BuyNFT>) -> Result<()> {
        let collection = &mut ctx.accounts.collection;
        let nft = &mut ctx.accounts.nft;
        let buyer = &ctx.accounts.buyer;
        let seller = &ctx.accounts.seller;
        let platform = &ctx.accounts.platform;
        
        // Calculate price based on bonding curve
        let price = calculate_price(collection.market_cap, collection.base_price, collection.growth_factor);
        
        // Calculate platform fee
        let platform_fee_amount = price.checked_mul(platform.platform_fee).unwrap().checked_div(10000).unwrap();
        let seller_amount = price.checked_sub(platform_fee_amount).unwrap();
        
        // Transfer platform fee
        let platform_fee_ix = anchor_lang::solana_program::system_instruction::transfer(
            &buyer.key(),
            &platform.key(),
            platform_fee_amount,
        );
        anchor_lang::solana_program::program::invoke(
            &platform_fee_ix,
            &[
                buyer.to_account_info(),
                platform.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
        
        // Handle payment to seller based on threshold status
        if collection.threshold_reached {
            // Post-threshold: Add to synthetic SOL balance
            // In a real implementation, this would update a balance in a separate account
            // For this example, we'll just transfer to the collection account
            let escrow_ix = anchor_lang::solana_program::system_instruction::transfer(
                &buyer.key(),
                &collection.key(),
                seller_amount,
            );
            anchor_lang::solana_program::program::invoke(
                &escrow_ix,
                &[
                    buyer.to_account_info(),
                    collection.to_account_info(),
                    ctx.accounts.system_program.to_account_info(),
                ],
            )?;
        } else {
            // Pre-threshold: Direct payment to seller
            let seller_ix = anchor_lang::solana_program::system_instruction::transfer(
                &buyer.key(),
                &seller.key(),
                seller_amount,
            );
            anchor_lang::solana_program::program::invoke(
                &seller_ix,
                &[
                    buyer.to_account_info(),
                    seller.to_account_info(),
                    ctx.accounts.system_program.to_account_info(),
                ],
            )?;
        }
        
        // Update NFT ownership
        nft.owner = buyer.key();
        
        // Update collection market cap
        collection.market_cap = collection.market_cap.checked_add(price).unwrap();
        
        // Check if threshold is reached
        if collection.market_cap >= platform.threshold_amount && !collection.threshold_reached {
            collection.threshold_reached = true;
            // Additional logic for threshold activation could be added here
        }
        
        Ok(())
    }

    // Withdraw synthetic SOL (pre-threshold only)
    pub fn withdraw_synthetic_sol(ctx: Context<WithdrawSyntheticSol>, amount: u64) -> Result<()> {
        let collection = &ctx.accounts.collection;
        let user = &ctx.accounts.user;
        
        // Ensure collection has not reached threshold
        require!(!collection.threshold_reached, ErrorCode::ThresholdReached);
        
        // In a real implementation, this would check the user's synthetic SOL balance
        // For this example, we'll just transfer from the collection account
        
        // Transfer SOL from collection to user
        let withdraw_ix = anchor_lang::solana_program::system_instruction::transfer(
            &collection.key(),
            &user.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke_signed(
            &withdraw_ix,
            &[
                collection.to_account_info(),
                user.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[&[
                b"collection",
                collection.creator.as_ref(),
                collection.name.as_bytes(),
                &[collection.bump],
            ]],
        )?;
        
        Ok(())
    }

    // Create liquidity pool (post-threshold)
    pub fn create_liquidity_pool(ctx: Context<CreateLiquidityPool>, amount: u64) -> Result<()> {
        let collection = &mut ctx.accounts.collection;
        
        // Ensure collection has reached threshold
        require!(collection.threshold_reached, ErrorCode::ThresholdNotReached);
        
        // In a real implementation, this would integrate with Raydium or another DEX
        // For this example, we'll just mark the collection as having a liquidity pool
        
        collection.has_liquidity_pool = true;
        
        Ok(())
    }
}

// Helper function to calculate price based on bonding curve
fn calculate_price(market_cap: u64, base_price: u64, growth_factor: u64) -> u64 {
    // In a real implementation, this would use a more precise calculation
    // For this example, we'll use a simplified formula
    // price = base_price * (1 + growth_factor * market_cap / 1_000_000)
    let growth = market_cap.checked_mul(growth_factor).unwrap().checked_div(1_000_000).unwrap();
    let multiplier = 1_000_000 + growth;
    base_price.checked_mul(multiplier).unwrap().checked_div(1_000_000).unwrap()
}

#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Platform::LEN,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateCollection<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Collection::LEN,
        seeds = [b"collection", creator.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub collection: Account<'info, Collection>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub platform: Account<'info, Platform>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(
        mut,
        seeds = [b"collection", collection.creator.as_ref(), collection.name.as_bytes()],
        bump = collection.bump
    )]
    pub collection: Account<'info, Collection>,
    
    #[account(
        init,
        payer = buyer,
        space = 8 + NFT::LEN,
        seeds = [b"nft", collection.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub nft: Account<'info, NFT>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    /// CHECK: This is the creator of the collection
    #[account(mut, address = collection.creator)]
    pub creator: AccountInfo<'info>,
    
    pub platform: Account<'info, Platform>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyNFT<'info> {
    #[account(
        mut,
        seeds = [b"collection", collection.creator.as_ref(), collection.name.as_bytes()],
        bump = collection.bump
    )]
    pub collection: Account<'info, Collection>,
    
    #[account(
        mut,
        seeds = [b"nft", collection.key().as_ref(), nft.name.as_bytes()],
        bump = nft.bump,
        constraint = nft.owner == seller.key()
    )]
    pub nft: Account<'info, NFT>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    /// CHECK: This is the current owner of the NFT
    #[account(mut)]
    pub seller: AccountInfo<'info>,
    
    pub platform: Account<'info, Platform>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawSyntheticSol<'info> {
    #[account(
        mut,
        seeds = [b"collection", collection.creator.as_ref(), collection.name.as_bytes()],
        bump = collection.bump
    )]
    pub collection: Account<'info, Collection>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateLiquidityPool<'info> {
    #[account(
        mut,
        seeds = [b"collection", collection.creator.as_ref(), collection.name.as_bytes()],
        bump = collection.bump
    )]
    pub collection: Account<'info, Collection>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    /// CHECK: This would be the Raydium program in a real implementation
    pub dex_program: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Platform {
    pub authority: Pubkey,
    pub platform_fee: u64,     // In basis points (e.g., 200 = 2%)
    pub creator_reward: u64,   // In lamports
    pub threshold_amount: u64, // In lamports
    pub bump: u8,
}

impl Platform {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 1;
}

#[account]
pub struct Collection {
    pub name: String,           // Max 32 bytes
    pub symbol: String,         // Max 10 bytes
    pub uri: String,            // Max 200 bytes
    pub creator: Pubkey,
    pub base_price: u64,
    pub growth_factor: u64,
    pub market_cap: u64,
    pub threshold_reached: bool,
    pub has_liquidity_pool: bool,
    pub bump: u8,
}

impl Collection {
    pub const LEN: usize = 32 + 10 + 200 + 32 + 8 + 8 + 8 + 1 + 1 + 1;
}

#[account]
pub struct NFT {
    pub name: String,           // Max 32 bytes
    pub symbol: String,         // Max 10 bytes
    pub uri: String,            // Max 200 bytes
    pub collection: Pubkey,
    pub owner: Pubkey,
    pub attributes: Vec<NFTAttribute>,
    pub bump: u8,
}

impl NFT {
    pub const LEN: usize = 32 + 10 + 200 + 32 + 32 + 100 + 1; // 100 bytes for attributes
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct NFTAttribute {
    pub trait_type: String,     // Max 20 bytes
    pub value: String,          // Max 20 bytes
}

#[error_code]
pub enum ErrorCode {
    #[msg("Collection has already reached threshold")]
    ThresholdReached,
    #[msg("Collection has not reached threshold yet")]
    ThresholdNotReached,
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Invalid amount")]
    InvalidAmount,
}
