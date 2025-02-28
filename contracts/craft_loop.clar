;; CraftLoop NFT Marketplace Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-for-sale (err u101))
(define-constant err-insufficient-funds (err u102))
(define-constant err-invalid-nft (err u103))

;; Define NFT token
(define-non-fungible-token craft-nft uint)

;; Data structures
(define-map nft-data uint 
  {
    name: (string-utf8 100),
    description: (string-utf8 500),
    artist: principal,
    price: uint,
    metadata: (optional (string-utf8 1000)),
    listed: bool
  }
)

(define-data-var nft-index uint u0)

;; Mint new NFT
(define-public (mint-nft (name (string-utf8 100)) 
                       (description (string-utf8 500))
                       (price uint)
                       (metadata (string-utf8 1000)))
  (let ((token-id (+ (var-get nft-index) u1)))
    (try! (nft-mint? craft-nft token-id tx-sender))
    (map-set nft-data token-id
      {
        name: name,
        description: description,
        artist: tx-sender,
        price: price,
        metadata: (some metadata),
        listed: false
      }
    )
    (var-set nft-index token-id)
    (ok token-id)
  )
)

;; List NFT for sale
(define-public (list-nft (token-id uint) (price uint))
  (let ((owner (unwrap! (nft-get-owner? craft-nft token-id) err-invalid-nft)))
    (asserts! (is-eq tx-sender owner) err-owner-only)
    (let ((nft (unwrap! (map-get? nft-data token-id) err-invalid-nft)))
      (map-set nft-data token-id
        (merge nft { price: price, listed: true })
      )
      (ok true)
    )
  )
)

;; Purchase NFT
(define-public (purchase-nft (token-id uint))
  (let ((nft (unwrap! (map-get? nft-data token-id) err-invalid-nft))
        (owner (unwrap! (nft-get-owner? craft-nft token-id) err-invalid-nft)))
    (asserts! (get listed nft) err-not-for-sale)
    (try! (stx-transfer? (get price nft) tx-sender owner))
    (try! (nft-transfer? craft-nft token-id owner tx-sender))
    (map-set nft-data token-id
      (merge nft { listed: false })
    )
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-nft-data (token-id uint))
  (map-get? nft-data token-id)
)

(define-read-only (get-nft-owner (token-id uint))
  (nft-get-owner? craft-nft token-id)
)
