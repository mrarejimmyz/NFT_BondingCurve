// Bonding Curve Contract
// This contract implements the bonding curve mechanism for NFT pricing

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token};

declare_id!("BC1111111111111111111111111111111111111111");

#[program]
pub mod bonding_curve_engine {
    use super::*;

    // Initialize the bonding curve parameters
    pub fn initialize(
        ctx: Context<Initialize>,
        base_price: u64,
        growth_factor: u64,
        threshold_amount: u64,
    ) -> Result<()> {
        let curve = &mut ctx.accounts.curve;
        curve.authority = ctx.accounts.authority.key();
        curve.base_price = base_price;
        curve.growth_factor = growth_factor;
        curve.threshold_amount = threshold_amount;
        curve.market_cap = 0;
        curve.threshold_reached = false;
        curve.bump = *ctx.bumps.get("curve").unwrap();
        Ok(())
    }

    // Update market cap after a transaction
    pub fn update_market_cap(
        ctx: Context<UpdateMarketCap>,
        transaction_amount: u64,
    ) -> Result<()> {
        let curve = &mut ctx.accounts.curve;
        
        // Only the authority can update the market cap
        require!(
            ctx.accounts.authority.key() == curve.authority,
            ErrorCode::Unauthorized
        );
        
        // Update market cap
        curve.market_cap = curve.market_cap.checked_add(transaction_amount).unwrap();
        
        // Check if threshold is reached
        if curve.market_cap >= curve.threshold_amount && !curve.threshold_reached {
            curve.threshold_reached = true;
            emit!(ThresholdReachedEvent {
                collection: curve.key(),
                market_cap: curve.market_cap,
                timestamp: Clock::get()?.unix_timestamp,
            });
        }
        
        Ok(())
    }

    // Calculate price based on current market cap
    pub fn calculate_price(ctx: Context<CalculatePrice>) -> Result<u64> {
        let curve = &ctx.accounts.curve;
        
        // Calculate price using the exponential formula
        let price = calculate_price_internal(
            curve.market_cap,
            curve.base_price,
            curve.growth_factor
        );
        
        emit!(PriceCalculatedEvent {
            collection: curve.key(),
            market_cap: curve.market_cap,
            price,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(price)
    }
}

// Helper function to calculate price based on bonding curve formula
fn calculate_price_internal(market_cap: u64, base_price: u64, growth_factor: u64) -> u64 {
    // price = base_price * e^(growth_factor * market_cap)
    // For Solana, we need to use fixed-point arithmetic
    // We'll use a simplified approximation: base_price * (1 + growth_factor * market_cap / 10^6)
    
    let growth = market_cap.checked_mul(growth_factor).unwrap().checked_div(1_000_000).unwrap();
    let multiplier = 1_000_000 + growth;
    base_price.checked_mul(multiplier).unwrap().checked_div(1_000_000).unwrap()
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + BondingCurve::LEN,
        seeds = [b"bonding_curve", authority.key().as_ref()],
        bump
    )]
    pub curve: Account<'info, BondingCurve>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateMarketCap<'info> {
    #[account(
        mut,
        seeds = [b"bonding_curve", curve.authority.as_ref()],
        bump = curve.bump
    )]
    pub curve: Account<'info, BondingCurve>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CalculatePrice<'info> {
    #[account(
        seeds = [b"bonding_curve", curve.authority.as_ref()],
        bump = curve.bump
    )]
    pub curve: Account<'info, BondingCurve>,
}

#[account]
pub struct BondingCurve {
    pub authority: Pubkey,
    pub base_price: u64,
    pub growth_factor: u64,
    pub threshold_amount: u64,
    pub market_cap: u64,
    pub threshold_reached: bool,
    pub bump: u8,
}

impl BondingCurve {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 8 + 1 + 1;
}

#[event]
pub struct ThresholdReachedEvent {
    pub collection: Pubkey,
    pub market_cap: u64,
    pub timestamp: i64,
}

#[event]
pub struct PriceCalculatedEvent {
    pub collection: Pubkey,
    pub market_cap: u64,
    pub price: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized")]
    Unauthorized,
}
