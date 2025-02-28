import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Test NFT minting",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('craft-loop', 'mint-nft',
        [
          types.utf8("Test NFT"),
          types.utf8("Test Description"),
          types.uint(1000),
          types.utf8("{materials: 'wood'}")
        ],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(1);
    
    const nftData = chain.callReadOnlyFn(
      'craft-loop',
      'get-nft-data',
      [types.uint(1)],
      deployer.address
    );
    
    nftData.result.expectSome().expectTuple();
  }
});

Clarinet.test({
  name: "Test NFT listing and purchase",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const buyer = accounts.get('wallet_1')!;
    
    // Mint NFT
    let block = chain.mineBlock([
      Tx.contractCall('craft-loop', 'mint-nft',
        [
          types.utf8("Test NFT"),
          types.utf8("Test Description"),
          types.uint(1000),
          types.utf8("{materials: 'wood'}")
        ],
        deployer.address
      )
    ]);
    
    // List NFT
    block = chain.mineBlock([
      Tx.contractCall('craft-loop', 'list-nft',
        [types.uint(1), types.uint(500)],
        deployer.address
      )
    ]);
    
    block.receipts[0].result.expectOk().expectBool(true);
    
    // Purchase NFT
    block = chain.mineBlock([
      Tx.contractCall('craft-loop', 'purchase-nft',
        [types.uint(1)],
        buyer.address
      )
    ]);
    
    block.receipts[0].result.expectOk().expectBool(true);
    
    // Verify ownership
    const nftOwner = chain.callReadOnlyFn(
      'craft-loop',
      'get-nft-owner',
      [types.uint(1)],
      deployer.address
    );
    
    nftOwner.result.expectSome().expectPrincipal(buyer.address);
  }
});
