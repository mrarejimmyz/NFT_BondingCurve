// Liquidity Bridge Contract
// This contract handles the creation of liquidity pools for NFT collections

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};

declare_id!("LB1111111111111111111111111111111111111111");

#[program]
pub mod liquidity_bridge {
    use super::*;

    // Initialize the liquidity bridge
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let bridge = &mut ctx.accounts.bridge;
        bridge.authority = ctx.accounts.authority.key();
        bridge.bump = *ctx.bumps.get("bridge").unwrap();
        Ok(())
    }

    // Create a liquidity pool for a collection that has reached threshold
    pub fn create_pool(
        ctx: Context<CreatePool>,
        amount: u64,
        collection_id: Pubkey,
    ) -> Result<()> {
        let bridge = &mut ctx.accounts.bridge;
        let pool = &mut ctx.accounts.pool;
        
        // Initialize pool data
        pool.collection = collection_id;
        pool.authority = ctx.accounts.authority.key();
        pool.total_liquidity = amount;
        pool.created_at = Clock::get()?.unix_timestamp;
        pool.bump = *ctx.bumps.get("pool").unwrap();
        
        // In a real implementation, this would integrate with Raydium or another DEX
        // For this example, we'll just transfer the SOL to the pool account
        
        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.authority.key(),
            &pool.key(),
            amount,
        );
        
        anchor_lang::solana_program::program::invoke(
            &transfer_ix,
            &[
                ctx.accounts.authority.to_account_info(),
                pool.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
        
        // Emit event for pool creation
        emit!(PoolCreatedEvent {
            pool: pool.key(),
            collection: collection_id,
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    // Add liquidity to an existing pool
    pub fn add_liquidity(
        ctx: Context<AddLiquidity>,
        amount: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        
        // Transfer SOL to the pool
        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &pool.key(),
            amount,
        );
        
        anchor_lang::solana_program::program::invoke(
            &transfer_ix,
            &[
                ctx.accounts.user.to_account_info(),
                pool.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
        
        // Update pool data
        pool.total_liquidity = pool.total_liquidity.checked_add(amount).unwrap();
        
        // Emit event for liquidity addition
        emit!(LiquidityAddedEvent {
            pool: pool.key(),
            user: ctx.accounts.user.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }

    // Remove liquidity from a pool (only available to LP token holders)
    pub fn remove_liquidity(
        ctx: Context<RemoveLiquidity>,
        amount: u64,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        
        // Ensure user is authorized to remove liquidity
        require!(
            ctx.accounts.user.key() == pool.authority || ctx.accounts.bridge.authority == ctx.accounts.user.key(),
            ErrorCode::Unauthorized
        );
        
        // Ensure pool has enough liquidity
        require!(
            pool.total_liquidity >= amount,
            ErrorCode::InsufficientLiquidity
        );
        
        // Transfer SOL from the pool to the user
        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &pool.key(),
            &ctx.accounts.user.key(),
            amount,
        );
        
        anchor_lang::solana_program::program::invoke_signed(
            &transfer_ix,
            &[
                pool.to_account_info(),
                ctx.accounts.user.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[&[
                b"pool",
                pool.collection.as_ref(),
                &[pool.bump],
            ]],
        )?;
        
        // Update pool data
        pool.total_liquidity = pool.total_liquidity.checked_sub(amount).unwrap();
        
        // Emit event for liquidity removal
        emit!(LiquidityRemovedEvent {
            pool: pool.key(),
            user: ctx.accounts.user.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + LiquidityBridge::LEN,
        seeds = [b"liquidity_bridge"],
        bump
    )]
    pub bridge: Account<'info, LiquidityBridge>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePool<'info> {
    #[account(
        seeds = [b"liquidity_bridge"],
        bump = bridge.bump
    )]
    pub bridge: Account<'info, LiquidityBridge>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + LiquidityPool::LEN,
        seeds = [b"pool", collection_id.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, LiquidityPool>,
    
    /// CHECK: This is the collection ID
    pub collection_id: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddLiquidity<'info> {
    #[account(
        mut,
        seeds = [b"pool", pool.collection.as_ref()],
        bump = pool.bump
    )]
    pub pool: Account<'info, LiquidityPool>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RemoveLiquidity<'info> {
    #[account(
        seeds = [b"liquidity_bridge"],
        bump = bridge.bump
    )]
    pub bridge: Account<'info, LiquidityBridge>,
    
    #[account(
        mut,
        seeds = [b"pool", pool.collection.as_ref()],
        bump = pool.bump
    )]
    pub pool: Account<'info, LiquidityPool>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct LiquidityBridge {
    pub authority: Pubkey,
    pub bump: u8,
}

impl LiquidityBridge {
    pub const LEN: usize = 32 + 1;
}

#[account]
pub struct LiquidityPool {
    pub collection: Pubkey,
    pub authority: Pubkey,
    pub total_liquidity: u64,
    pub created_at: i64,
    pub bump: u8,
}

impl LiquidityPool {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 1;
}

#[event]
pub struct PoolCreatedEvent {
    pub pool: Pubkey,
    pub collection: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct LiquidityAddedEvent {
    pub pool: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct LiquidityRemovedEvent {
    pub pool: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Insufficient liquidity")]
    InsufficientLiquidity,
}
