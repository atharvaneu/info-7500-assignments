## Assignment 2 - Merkle Trees

[Assignment link](https://docs.google.com/document/d/1bBwXFBkseueWsjyz_r_XG3Tv2efEPZ-n_91VOLs3X-M/edit#heading=h.gjdgxs)

### How to test?

1. Clone repo and `cd merkle`

2. Generate a Merkle proof by using `cargo run prove {total number of leaves} {leaf_position}`

```
    cargo run prove 10 4
```

PS: Make sure that total_number_of_leaves is greater than leaf_position

3.  Verify the generated Merkle proof with `cargo run verify {path_to_proof_yaml} {merkle_root_hash}`

```
cargo run verify ./proof_gen_10_4.yaml merkle_root_base_64_hash_value
```
